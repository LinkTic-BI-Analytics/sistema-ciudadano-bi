// Un proveedor de IA que contesta siempre lo mismo, para los recorridos.
//
// **No es un atajo: es lo único que hace probable la mitad del producto.** Con
// la IA de verdad, cuántas vueltas ve la persona y si contó una cosa o tres
// depende de lo que el modelo decida esa vez, y una prueba que depende de eso
// no prueba el producto. Con la IA apagada, esos caminos sencillamente no
// existen y no se prueban nunca.
//
// Habla la misma API que OpenRouter y Mistral —*chat completions*— así que lo
// que se ejercita es el código real de punta a punta: la llamada, el `JSON`, el
// guardián de anclaje y la pantalla.
//
// Contesta según lo que diga el relato, no según una lista de casos, para que
// una prueba nueva no tenga que tocar este archivo.

import { createServer } from "node:http";

const PUERTO = Number(process.env.IA_FALSA_PUERTO ?? 3199);

/** Parte el relato en problemas por los separadores que usa la gente. */
function leer(relato: string) {
  const limpio = relato.replace(/\s+/g, " ").trim();

  // «y además», «también», «otra cosa» y las comas separan cosas distintas.
  // Es tosco a propósito: aquí no se imita el criterio del modelo, se fabrica
  // una respuesta con la forma que el modelo devuelve.
  const problemas = limpio.split(/,\s*(?:y\s+)?(?:ademas|además|tambien|también)?\s*/i)
    .map((x) => x.trim()).filter((x) => x.length > 8);

  const busca = (re: RegExp) => limpio.match(re)?.[0]?.trim() ?? null;

  return {
    problemas: problemas.length ? problemas : [limpio],
    problema: problemas[0] ?? limpio,
    lugar: busca(/(?:en|de)\s+(?:la\s+)?(?:vereda|barrio|corregimiento|municipio)\s+[^,.]+/i),
    afectados: busca(/\b\d+\s+(?:familias|casas|personas|niños|ninos)\b/i),
    desdeCuando: busca(/(?:hace|desde)\s+[^,.]{3,30}/i),
    resultadoEsperado: null,
    solucionSugerida: null,
  };
}

createServer((pedido, respuesta) => {
  let cuerpo = "";
  pedido.on("data", (t) => { cuerpo += t; });
  pedido.on("end", () => {
    let relato = "";
    try {
      const j = JSON.parse(cuerpo);
      relato = j?.messages?.find((m: { role: string }) => m.role === "user")?.content ?? "";
    } catch { /* un cuerpo roto se contesta con una lectura vacía */ }

    respuesta.writeHead(200, { "content-type": "application/json" });
    respuesta.end(JSON.stringify({
      choices: [{ message: { content: JSON.stringify(leer(relato)) } }],
    }));
  });
}).listen(PUERTO, () => console.log(`ia falsa en ${PUERTO}`));
