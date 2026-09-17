// Un aporte hablado de muestra, con su grabación de verdad.
//
// No se puede sembrar por SQL: la base rechaza un aporte por voz sin grabación
// —sería un aporte cuyo original se perdió (ADR 0013)— y el archivo tiene que
// existir en el depósito, no solo la fila. Una fila que apunta a un archivo que
// no está es exactamente lo que las pruebas vigilan que no pase.
//
// Va sin IA a propósito: el relato dice lo que diría una transcripción que no
// se entendió del todo, que es justo el caso que el revisor tiene que ver.

import { guardarGrabacion } from "../producto/src/captura/voz.ts";
import { recibirAporte } from "../producto/src/captura/recibir.ts";
import { procesoVigente } from "../producto/src/datos/proceso.ts";
import { clienteServidor } from "../producto/src/datos/cliente.ts";

const CLAVE = "muestra-voz";
const p = clienteServidor().schema("participacion");

const { data: existe } = await p.from("aporte").select("id").eq("clave_envio", CLAVE).maybeSingle();
if (existe) {
  console.log("  por voz:            ya estaba");
} else {
  const procesoId = await procesoVigente();
  // Una cabecera de webm y poco más. Basta para que el archivo exista y pese.
  const audio = new Uint8Array(2048);
  audio.set([0x1a, 0x45, 0xdf, 0xa3, 0x01, 0x00, 0x00, 0x00]);

  const g = await guardarGrabacion({
    procesoId, audio, tipoMime: "audio/webm", segundos: 34,
  });
  const r = await recibirAporte({
    procesoId, claveEnvio: CLAVE,
    relato: "la via de la vereda esta intransitable y el bus no sube cuando llueve",
    canal: "voz_transcrita", grabacionId: g.grabacionId,
    lugarDeclarado: "la vereda de arriba",
  });
  // El tema es el sector que responde: una vía que no sirve es Transporte.
  // Confirmado, porque quien habló también escogió —hablar por voz no deja a
  // nadie sin poder decir de qué se trata—.
  await p.from("aporte")
    .update({
      afectados: "los que vamos al colegio", desde_cuando: "desde que empezaron las lluvias",
      tema: "Transporte", tema_propuesto: "Transporte",
    })
    .eq("id", r.aporteId);
  console.log("  por voz:            sembrado con su grabación");
}
