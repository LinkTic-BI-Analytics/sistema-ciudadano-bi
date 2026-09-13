import { VistaModulos } from "@/harness/VistaModulos";
import { proyecto } from "@/harness/modulos";
import { modulosDePrueba } from "./carga";

// Ruta de la arena. Sirve para mirar la vista bajo carga antes de cosecharla.
export default function ModulosPrueba() {
  return (
    <VistaModulos
      proyecto={{ ...proyecto, nombre: "Carga de prueba · 50 módulos" }}
      modulos={modulosDePrueba}
    />
  );
}
