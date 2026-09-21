/**
 * El token y el secreto de los recorridos, y dónde queda la sesión.
 *
 * **No son los de verdad, a propósito.** El servidor de los recorridos los
 * recibe por `webServer.env` y así pisa lo que haya en `.env.local`: la suite
 * no depende de que quien la corre tenga el token del equipo, y el token del
 * equipo no queda escrito en un archivo de pruebas.
 */
export const TOKEN_RECORRIDOS = "token-de-los-recorridos";
export const SECRETO_RECORRIDOS = "secreto-de-los-recorridos-que-no-sirve-en-otro-lado";

/** `test-results/` ya está fuera de git, y Playwright lo vacía al arrancar. */
export const SESION = "test-results/sesion.json";
