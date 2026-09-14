import { defineConfig, devices } from "@playwright/test";

// Los recorridos se prueban en un navegador de verdad. `AGENTS.md` §12: una
// pantalla no se da por terminada con una afirmación.
//
// Dos anchos, y no son decorativos: 390 px es el teléfono desde el que va a
// entrar la mayoría, y el sistema de diseño ya se validó a 320 px efectivos.
export default defineConfig({
  testDir: "./pruebas/e2e",
  fullyParallel: false,
  reporter: process.env.CI ? "list" : [["list"]],
  use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure" },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"] } },
    { name: "telefono", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
