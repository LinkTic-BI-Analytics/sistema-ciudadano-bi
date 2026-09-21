/**
 * El acceso a la zona interna: un token compartido y una sesión en dos JWT.
 *
 * Quien entra a `/consola` o `/administracion` pone el `ACCESS_TOKEN`. Si es el
 * correcto, recibe dos cookies:
 *
 *   · **acceso**, que vive quince minutos y es la que se revisa en cada
 *     petición;
 *   · **renovación**, que vive ocho horas —una jornada— y solo sirve para pedir
 *     otra de acceso. Cumplidas las ocho horas se vuelve a poner el token.
 *
 * Las dos son `httpOnly`: el JavaScript de la página no las ve, así que un
 * guion inyectado tampoco se las lleva.
 *
 * ## Por qué se firma con `JWT_SECRET` y no con el `ACCESS_TOKEN`
 *
 * El token lo conoce todo el equipo; el secreto, solo el servidor. Si se
 * firmara con el token, cualquiera que lo sepa podría fabricarse una sesión de
 * un año sin pasar por el login.
 *
 * ## Por qué cada JWT lleva una huella del token
 *
 * Cuando el token se filtra, se cambia. Si las sesiones abiertas con el viejo
 * siguieran vivas, cambiarlo no serviría de nada durante ocho horas. La huella
 * es un HMAC del token con el secreto —no el token, ni un hash que se pueda
 * atacar sin el secreto— y al rotar el token deja de coincidir.
 *
 * ## Por qué a mano y no con una librería
 *
 * El middleware de Next corre en el runtime Edge, que no tiene `node:crypto`.
 * Esto usa solo Web Crypto, que está en los dos runtimes y en `node --test`, y
 * firma un solo algoritmo: la cabecera se compara entera, así que `alg: none`
 * o cualquier otro algoritmo no llegan ni a verificarse.
 *
 * **Esto no identifica a nadie.** Un token compartido dice «alguien del
 * equipo», no quién. Cuando llegue el mecanismo de identidad (`P4`), esto se
 * reemplaza; mientras tanto, la auditoría no puede atribuir una acción a una
 * persona con esto.
 */

export const COOKIE_ACCESO = "pc-acceso";
export const COOKIE_RENOVACION = "pc-renovacion";

/** En segundos, como los `exp` de un JWT. */
export const DURACION_ACCESO = 15 * 60;
export const DURACION_RENOVACION = 8 * 60 * 60;

export type Tipo = "acceso" | "renovacion";
export type Claves = { secreto: string; token: string };

/** Un secreto de HMAC-SHA256 más corto que su salida es un secreto débil. */
const SECRETO_MINIMO = 32;

/** Las dos, o ninguna: sin alguna de las dos, nadie entra. */
export function clavesDelEntorno(): Claves | null {
  const secreto = process.env.JWT_SECRET ?? "";
  const token = process.env.ACCESS_TOKEN ?? "";
  if (!token || secreto.length < SECRETO_MINIMO) return null;
  return { secreto, token };
}

/** Las opciones de las dos cookies. `secure` fuera de desarrollo, que corre en http. */
export function opcionesCookie(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

// ─── Base64url ───────────────────────────────────────────────────────────────

const texto = new TextEncoder();

function aB64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function deB64url(s: string): Uint8Array<ArrayBuffer> {
  const binario = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  return Uint8Array.from(binario, (c) => c.charCodeAt(0));
}

/** La única cabecera que se firma, y la única que se acepta. */
const CABECERA = aB64url(texto.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));

// ─── Firmar y verificar ──────────────────────────────────────────────────────

function llave(secreto: string) {
  return crypto.subtle.importKey(
    "raw", texto.encode(secreto), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"],
  );
}

async function hmac(secreto: string, dato: string): Promise<string> {
  const firma = await crypto.subtle.sign("HMAC", await llave(secreto), texto.encode(dato));
  return aB64url(new Uint8Array(firma));
}

/** Qué token estaba vigente cuando se abrió la sesión. Ver la cabecera. */
function huella(claves: Claves): Promise<string> {
  return hmac(claves.secreto, `huella:${claves.token}`);
}

export async function firmar(tipo: Tipo, claves: Claves, ahora = Date.now()): Promise<string> {
  const iat = Math.floor(ahora / 1000);
  const exp = iat + (tipo === "acceso" ? DURACION_ACCESO : DURACION_RENOVACION);
  const carga = aB64url(texto.encode(JSON.stringify({
    sub: "equipo", tipo, huella: await huella(claves), iat, exp,
  })));
  return `${CABECERA}.${carga}.${await hmac(claves.secreto, `${CABECERA}.${carga}`)}`;
}

export async function verificar(
  jwt: string, tipo: Tipo, claves: Claves, ahora = Date.now(),
): Promise<boolean> {
  try {
    const partes = jwt.split(".");
    if (partes.length !== 3) return false;
    const [cab, carga, firma] = partes as [string, string, string];
    if (cab !== CABECERA || !firma) return false;

    // `subtle.verify` compara en tiempo constante; un `===` sobre la firma no.
    const valida = await crypto.subtle.verify(
      "HMAC", await llave(claves.secreto), deB64url(firma), texto.encode(`${cab}.${carga}`),
    );
    if (!valida) return false;

    const datos = JSON.parse(new TextDecoder().decode(deB64url(carga)));
    const segundos = Math.floor(ahora / 1000);
    return datos.tipo === tipo
      && typeof datos.exp === "number" && segundos < datos.exp
      && typeof datos.iat === "number" && datos.iat <= segundos + 60
      && datos.huella === await huella(claves);
  } catch {
    // Base64 roto, JSON roto: no es un token nuestro.
    return false;
  }
}

/**
 * Si lo que se escribió en el login es el token.
 *
 * Se comparan los dos resúmenes y no las cadenas: un `===` termina en el primer
 * carácter distinto, y cuánto tarda en contestar dice cuántos acertaste.
 */
export async function mismoToken(dado: string, esperado: string): Promise<boolean> {
  if (!dado || !esperado) return false;
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", texto.encode(dado)),
    crypto.subtle.digest("SHA-256", texto.encode(esperado)),
  ]);
  const x = new Uint8Array(a), y = new Uint8Array(b);
  let distinto = 0;
  for (let i = 0; i < x.length; i++) distinto |= x[i]! ^ y[i]!;
  return distinto === 0;
}

// ─── Rutas ───────────────────────────────────────────────────────────────────

/** Lo que pide el token. `/parametros` no está porque todavía no existe. */
export const RUTAS_PRIVADAS = ["/consola", "/administracion"] as const;

export function esPrivada(ruta: string): boolean {
  return RUTAS_PRIVADAS.some((r) => ruta === r || ruta.startsWith(`${r}/`));
}

/**
 * A dónde se vuelve después de ingresar.
 *
 * Solo a una ruta privada de este mismo sitio. Un «siguiente» que acepta
 * cualquier cosa manda a alguien a `//otro.sitio` justo después de que puso el
 * token, y la página de allá puede pedírselo otra vez.
 */
export function destinoSeguro(siguiente: unknown): string {
  if (typeof siguiente !== "string") return "/consola";
  const ruta = siguiente.split(/[?#]/, 1)[0] ?? "";
  return siguiente.startsWith("/") && esPrivada(ruta) ? siguiente : "/consola";
}
