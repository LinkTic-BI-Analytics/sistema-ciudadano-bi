import { defineConfig, devices } from "@playwright/test";
import { SECRETO_RECORRIDOS, SESION, TOKEN_RECORRIDOS } from "./pruebas/e2e/acceso-recorridos.ts";

// Los recorridos se prueban en un navegador de verdad. `AGENTS.md` §12: una
// pantalla no se da por terminada con una afirmación.
//
// Dos anchos, y no son decorativos: 390 px es el teléfono desde el que va a
// entrar la mayoría, y el sistema de diseño ya se validó a 320 px efectivos.
export default defineConfig({
  testDir: "./pruebas/e2e",
  fullyParallel: false,
  // **Un trabajador.** Los dos proyectos escriben en la misma base, y con dos
  // en paralelo una prueba veía los registros de la otra. Se descubrió porque
  // dos corridas seguidas daban resultados distintos — que es peor que fallar.
  workers: 1,
  globalSetup: "./pruebas/e2e/limpiar.ts",
  // **Y al terminar.** Limpiar solo al arrancar dejaba la consola llena de
  // fixtures hasta la siguiente corrida: quien la abría veía 115 aportes de
  // mentira y un solo aporte de una persona perdido entre ellos.
  globalTeardown: "./pruebas/e2e/recoger.ts",
  reporter: process.env.CI ? "list" : [["list"]],
  use: { baseURL: "http://127.0.0.1:3101", trace: "retain-on-failure" },
  // **La sesión se abre una vez, antes de todo.** La consola y la
  // administración piden el token; `sesion.setup.ts` entra por el formulario y
  // deja las cookies en `SESION`, y los dos proyectos arrancan con ellas.
  // `acceso.spec.ts` las descarta, porque lo que prueba es no tenerlas.
  projects: [
    { name: "sesion", testMatch: /sesion\.setup\.ts/ },
    { name: "escritorio", use: { ...devices["Desktop Chrome"], storageState: SESION }, dependencies: ["sesion"] },
    { name: "telefono", use: { ...devices["Pixel 5"], storageState: SESION }, dependencies: ["sesion"] },
  ],
  // **Su propio servidor, en su propio puerto y sin llave de IA.**
  //
  // Con la llave puesta, cada recorrido salía a OpenRouter y el flujo dependía
  // de lo que el modelo decidiera esa vez: cuántas partes encontrara cambiaba
  // cuántas vueltas veía la persona, y las pruebas empezaron a pasar o fallar
  // según el relato. Una prueba que depende del humor de un modelo no prueba el
  // producto. Además tardaba siete minutos y mandaba relatos de prueba a un
  // tercero, uno por caso.
  //
  // Así que aquí se ejercita el camino determinista —`leer()`, que deja las
  // cinco partes vacías y por lo tanto siempre dos vueltas— y el contrato con la
  // IA se prueba aparte, con el proveedor sustituido (`pruebas/lectura-ia.test.ts`).
  //
  // Puerto propio para no pisar el `npm run dev` de quien esté mirando la
  // pantalla, que sí tiene la llave.
  webServer: [
    // El proveedor falso, que contesta siempre lo mismo. Sin él, todo lo que
    // depende de la IA —cuántas vueltas ve la persona, si contó una cosa o
    // tres— o no se prueba nunca (con la IA apagada) o depende de lo que el
    // modelo conteste esa vez (con la IA de verdad).
    {
      command: "node --experimental-strip-types pruebas/e2e/ia-falsa.ts",
      url: "http://127.0.0.1:3199",
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      // **La base se prepara antes de arrancar, no en `globalSetup`.**
      // Playwright levanta el servidor primero y solo después corre el setup,
      // así que el proceso de los recorridos tiene que existir ya: si no, la
      // primera petición —la comprobación de que el servidor está vivo— falla y
      // la suite se cae esperando 120 segundos.
      command: "../scripts/recorridos-base.sh preparar && npm run dev -- --port 3101",
      url: "http://127.0.0.1:3101",
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        // **Su propio proceso, no el de desarrollo.** Sin esto la suite escribe
        // donde escribe quien esté probando a mano, y su limpieza se lleva por
        // delante lo que esa persona capturó.
        PROCESO_VIGENTE: "ESCENARIO DE PRUEBA — recorridos de navegador",
        OPENROUTER_API_KEY: "llave-de-los-recorridos",
        IA_URL: "http://127.0.0.1:3199/chat/completions",
        MISTRAL_API_KEY: "",
        // **El webhook de llamadas, apagado.** Sin esto cada corrida dispara el
        // flujo de n8n de verdad, y ese flujo llama a gente: una suite que se
        // corre diez veces al día son diez llamadas a un número inventado —o,
        // peor, a uno que existe. El contrato del aviso se prueba aparte, contra
        // un servidor local (`pruebas/llamada.test.ts`).
        SIN_WEBHOOK: "1",
        // **El token y el secreto de los recorridos**, no los del equipo
        // (`acceso-recorridos.ts`). Pisan lo que haya en `.env.local`.
        ACCESS_TOKEN: TOKEN_RECORRIDOS,
        JWT_SECRET: SECRETO_RECORRIDOS,
      },
    },
  ],
});
