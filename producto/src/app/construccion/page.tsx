import { readFileSync } from "node:fs";
import { join } from "node:path";
import { VistaConstruccion } from "@/harness/vista-construccion/VistaConstruccion";
import type { EstadoConstruccion } from "@/harness/vista-construccion/estado";

// El tablero de la construcción. Hermana de `/modulos` y `/telemetria`.
//
// Lee `construccion/.estado.json` en cada petición, no en el build: si se
// prerenderizara, la pantalla mostraría el estado del día que se compiló y
// nadie se daría cuenta. Un tablero que miente es peor que no tener tablero.
export const dynamic = "force-dynamic";

const RAIZ = join(process.cwd(), "..");

function leerObjetivo(): string {
  try {
    const hoja = readFileSync(join(RAIZ, "construccion/hoja-de-ruta.md"), "utf8").split("\n");
    const i = hoja.findIndex((l) => l.startsWith("**Objetivo vigente:**"));
    if (i < 0) return "";
    const partes = [hoja[i]!.split("**", 3)[2]!.trim()];
    for (const sig of hoja.slice(i + 1)) {
      if (!sig.trim() || sig.startsWith("**")) break;
      partes.push(sig.trim());
    }
    return partes.join(" ");
  } catch {
    return "";
  }
}

export default function Construccion() {
  let estado: EstadoConstruccion;
  try {
    estado = JSON.parse(readFileSync(join(RAIZ, "construccion/.estado.json"), "utf8"));
  } catch {
    // Decir qué falta y cómo se arregla, en vez de una pantalla en blanco o un
    // error de Next que habla de JSON y no de lo que la persona estaba haciendo.
    return (
      <div className="harness">
        <div className="harness__hoja">
          <h1>Todavía no hay estado de construcción</h1>
          <p>
            Corre <code>./scripts/construccion.sh</code> desde la raíz del repositorio. Lo
            deriva de la hoja de ruta, los contratos, los vacíos y los worktrees de git.
          </p>
        </div>
      </div>
    );
  }
  return <VistaConstruccion estado={estado} objetivo={leerObjetivo()} />;
}
