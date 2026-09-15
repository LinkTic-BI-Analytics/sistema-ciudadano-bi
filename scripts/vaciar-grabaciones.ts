// Borra los archivos de audio del depósito.
//
// Una fila borrada que deja el archivo detrás es la voz de alguien guardada sin
// nada que explique por qué está ahí. Y nadie la va a encontrar para limpiarla.
import { clienteServidor } from "../producto/src/datos/cliente.ts";

const sb = clienteServidor();
const { data: filas } = await sb.schema("participacion").from("grabacion").select("ruta");
const rutas = (filas ?? []).map((f) => f.ruta as string);
if (rutas.length) {
  await sb.storage.from("grabaciones").remove(rutas);
  console.log(`  audios borrados: ${rutas.length}`);
}
