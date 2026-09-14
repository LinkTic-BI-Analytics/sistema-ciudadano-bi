import { defineConfig, devices } from "@playwright/test";

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
  reporter: process.env.CI ? "list" : [["list"]],
  use: { baseURL: "http://127.0.0.1:3101", trace: "retain-on-failure" },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"] } },
    { name: "telefono", use: { ...devices["Pixel 5"] } },
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
  webServer: {
    command: "npm run dev -- --port 3101",
    url: "http://127.0.0.1:3101",
    reuseExistingServer: false,
    timeout: 120_000,
    env: { SIN_IA: "1", OPENROUTER_API_KEY: "", MISTRAL_API_KEY: "" },
  },
});
