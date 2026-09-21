/**
 * El catálogo de países, listo para sembrar al lado de DIVIPOLA.
 *
 * Hace falta porque la captura pregunta **desde dónde nos contactas**, y a esa
 * pregunta hay gente que contesta desde fuera del país: colombianos en el
 * exterior que tienen algo que decir sobre su municipio, y que hasta hoy no
 * tenían cómo decir dónde están. DIVIPOLA no llega ahí — es el catálogo de la
 * división político-administrativa **de Colombia**— así que el nivel `pais` es
 * una fila más en la misma tabla, no una tabla nueva.
 *
 * ## De dónde sale cada cosa, que es lo que hace que esto no sea inventado
 *
 *   el código   ISO 3166-1 alpha-2, los 249 asignados oficialmente. La lista
 *               está escrita abajo, completa y a la vista: es un estándar
 *               publicado, no un dato de este negocio.
 *   el nombre   CLDR, a través del ICU que trae Node (`Intl.DisplayNames` en
 *               español). No se traduce a mano: un nombre de país escrito a
 *               ojo es exactamente la clase de dato que después nadie sabe de
 *               dónde salió.
 *
 * Y si el ICU no conoce un código, **esto para**. Un país que se siembra con su
 * propio código por nombre —«MF» en la lista del formulario— es peor que uno
 * que falta, porque parece un dato.
 *
 * ## La versión
 *
 * Viaja con el dato, igual que la de DIVIPOLA y por la misma razón (`Q5`): los
 * nombres cambian —«Swazilandia» es «Esuatini» desde 2018, «Turquía» es
 * «Türkiye» desde 2022— y un corte exportado tiene que seguir siendo
 * reproducible. Por eso la versión dice **qué edición de CLDR** puso esos
 * nombres, y no la fecha en que alguien corrió el guion.
 *
 * **La versión de países no es la de DIVIPOLA.** Son dos catálogos distintos en
 * la misma tabla, y por eso `participacion.tomar_corte` toma la versión de
 * catálogo mirando solo los niveles de DIVIPOLA: el corte se calcula sobre
 * municipios, y un `max(version)` que mezclara los dos anotaría en el corte una
 * versión que no es la del catálogo con que se contó.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIR = join(RAIZ, "producto", "datos", "paises");

/**
 * ISO 3166-1 alpha-2, los 249 códigos asignados oficialmente.
 *
 * **Están todos, incluidos los deshabitados** —Antártida, Bouvet, las Tierras
 * Australes Francesas—. Recortar la lista a los países «de los que sí va a
 * escribir alguien» sería una suposición nuestra sobre quién participa, y
 * quitarla después de haber sembrado es más trabajo que dejarla.
 */
const ALPHA2 = `
AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ
BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ
CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ
DE DJ DK DM DO DZ
EC EE EG EH ER ES ET
FI FJ FK FM FO FR
GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY
HK HM HN HR HT HU
ID IE IL IM IN IO IQ IR IS IT
JE JM JO JP
KE KG KH KI KM KN KP KR KW KY KZ
LA LB LC LI LK LR LS LT LU LV LY
MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ
NA NC NE NF NG NI NL NO NP NR NU NZ
OM
PA PE PF PG PH PK PL PM PN PR PS PT PW PY
QA
RE RO RS RU RW
SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ
TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ
UA UG UM US UY UZ
VA VC VE VG VI VN VU
WF WS
YE YT
ZA ZM ZW
`.trim().split(/\s+/);

const ESPERADOS = 249;

function main(): number {
  if (ALPHA2.length !== ESPERADOS) {
    console.error(`  la lista trae ${ALPHA2.length} códigos y ISO 3166-1 asigna ${ESPERADOS}`);
    return 1;
  }
  if (new Set(ALPHA2).size !== ALPHA2.length) {
    console.error("  hay códigos repetidos en la lista");
    return 1;
  }

  const nombres = new Intl.DisplayNames(["es"], { type: "region" });
  const sinNombre: string[] = [];
  const filas = ALPHA2.map((codigo) => {
    const nombre = nombres.of(codigo);
    // `Intl.DisplayNames` devuelve el propio código cuando no lo conoce. Eso no
    // es un nombre: es el código otra vez, y en un desplegable se lee como un
    // error nuestro.
    if (!nombre || nombre === codigo) sinNombre.push(codigo);
    return { codigo, nombre: nombre ?? codigo };
  });

  if (sinNombre.length) {
    console.error(`  el ICU de este Node no conoce: ${sinNombre.join(", ")}`);
    console.error("  no se escribe nada: un país sembrado con su código por nombre parece un dato.");
    return 1;
  }

  // En el orden en que se va a mostrar. Ordenarlo aquí y no en la pantalla es
  // lo que hace que la lista se vea igual en el formulario, en la consola y en
  // una exportación.
  filas.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  const version = `CLDR ${process.versions.cldr}`;
  mkdirSync(DIR, { recursive: true });
  writeFileSync(
    join(DIR, "paises.csv"),
    "codigo,pais\n" + filas.map((f) => `${f.codigo},${comillas(f.nombre)}`).join("\n") + "\n",
    "utf-8",
  );
  writeFileSync(join(DIR, "VERSION"), `${version}\n`, "utf-8");
  writeFileSync(join(DIR, "LEEME.md"), leeme(version, filas.length), "utf-8");

  console.log(`  ${filas.length} países · versión ${version}`);
  console.log(`  ${join("producto", "datos", "paises", "paises.csv")}`);
  return 0;
}

/** Una coma dentro del nombre parte la fila. «Bonaire, San Eustaquio y Saba». */
function comillas(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function leeme(version: string, cuantos: number): string {
  return `# Países — el catálogo del nivel internacional

**Versión: ${version}.** Está en el archivo \`VERSION\` y viaja con cada fila sembrada, igual
que la de DIVIPOLA y por la misma razón (\`Q5\`): los nombres cambian —«Swazilandia» es
«Esuatini» desde 2018— y un corte exportado tiene que seguir siendo reproducible.

## Qué es y qué no

Es el catálogo de la pregunta **«¿desde dónde nos contactas?»** cuando la respuesta está
fuera de Colombia. **No es un catálogo de dónde ocurre el problema**: un problema que este
sistema pueda atender ocurre en un municipio colombiano, y eso lo sigue diciendo DIVIPOLA.

## De dónde sale

| Qué | Fuente |
|---|---|
| El código, de dos letras | ISO 3166-1 alpha-2 · los ${cuantos} asignados oficialmente |
| El nombre, en español | CLDR, por el ICU que trae Node (\`Intl.DisplayNames\`) |

Ninguno de los dos se escribe a mano. Se regenera con:

    ./scripts/paises.sh

El guion **para** si el ICU no conoce alguno de los códigos: un país sembrado con su propio
código por nombre se lee como un error en la pantalla de alguien.

## Por qué dos letras y no cinco dígitos

Conviven en la misma tabla que DIVIPOLA, \`participacion.territorio\`, y la forma del código
es lo que los distingue sin ambigüedad: **país dos letras, departamento dos dígitos,
municipio cinco, centro poblado ocho**. La restricción \`forma_del_codigo\` del esquema lo
hace imposible de confundir, y de ahí cuelga la del aporte: un contacto internacional con
código de municipio lo rechaza la base.
`;
}

process.exit(main());
