"use client";

import { useActionState } from "react";
import { crearEncuentro, generarEnlace, type Hecho } from "./acciones.ts";
import { Campo, Opciones } from "../consola/campos.tsx";

function Aviso({ hecho }: { hecho: Hecho | null }) {
  if (!hecho) return null;
  return hecho.ok
    ? <p className="bo-observation" role="status">{hecho.mensaje}</p>
    : <p className="bo-small" role="alert"><strong>No se pudo:</strong> {hecho.error}</p>;
}

export function CrearEncuentro() {
  const [hecho, accion, guardando] = useActionState<Hecho | null, FormData>(crearEncuentro, null);
  return (
    <form action={accion}>
      <Campo id="enc-titulo" name="titulo" etiqueta="Título del encuentro"
             ejemplo="Mesa sobre el agua en la zona rural" />
      <Campo id="enc-tema" name="tema" etiqueta="Tema" opcional ejemplo="Vivienda, Ciudad y Territorio" />
      <Opciones id="enc-modalidad" name="modalidad" etiqueta="Modalidad">
        <option value="presencial">Presencial</option>
        <option value="virtual">Virtual</option>
        <option value="mixta">Mixta</option>
      </Opciones>
      {/* Con zona horaria siempre: «a las 9» no dice nada sin decir dónde son
          las 9, y quien se conecta desde otro huso llega tarde. */}
      <div className="bo-field">
        <label className="bo-label-tag" htmlFor="enc-fecha">Cuándo empieza</label>
        <input id="enc-fecha" name="comienza_en" type="datetime-local" required />
      </div>
      <Campo id="enc-zona" name="zona_horaria" etiqueta="Zona horaria" opcional
             defaultValue="America/Bogota" />
      <Campo id="enc-lugar" name="lugar" etiqueta="Lugar (si es presencial)" opcional
             ejemplo="Caseta comunal de la vereda El Salado" />
      <Campo id="enc-sala" name="sala" etiqueta="Sala (si es virtual)" opcional
             ejemplo="https://encuentro.ejemplo/agua" />
      {/* Las ayudas se dicen o no se dicen. Prometerlas sin tenerlas es peor
          que callarlas: alguien organiza el viaje contando con ellas. */}
      <Campo id="enc-ayudas" name="ayudas" etiqueta="Ayudas reales" opcional
             ejemplo="Interpretación en lengua de señas; transporte desde la cabecera" />
      <Campo id="enc-cupos" name="cupos" etiqueta="Cupos" opcional />
      <Aviso hecho={hecho} />
      <button className="bo-button" data-variant="primary" disabled={guardando}>
        {guardando ? "Creando…" : "Crear encuentro"}
      </button>
    </form>
  );
}

export function GenerarEnlace({ encuentros }: { encuentros: { id: string; titulo: string }[] }) {
  const [hecho, accion, guardando] = useActionState<Hecho | null, FormData>(generarEnlace, null);
  if (encuentros.length === 0) {
    return <p className="bo-empty">Primero hay que crear un encuentro.</p>;
  }
  return (
    <form action={accion}>
      <Opciones id="enl-encuentro" name="encuentro" etiqueta="Encuentro">
        <option value="">Escoge uno…</option>
        {encuentros.map((e) => <option key={e.id} value={e.id}>{e.titulo}</option>)}
      </Opciones>
      <Opciones id="enl-pieza" name="pieza" etiqueta="Pieza">
        <option value="afiche">Afiche</option>
        <option value="volante">Volante</option>
        <option value="publicacion">Publicación digital</option>
        <option value="radio">Radio</option>
        <option value="otro">Otra</option>
      </Opciones>
      {/* Las UTMs describen difusión. **No conceden permisos** y no llevan
          nombres de personas: es texto que acaba en pantallas internas. */}
      <Campo id="enl-source" name="utm_source" etiqueta="utm_source" opcional ejemplo="whatsapp" />
      <Campo id="enl-medium" name="utm_medium" etiqueta="utm_medium" opcional ejemplo="mensajeria" />
      <Campo id="enl-campaign" name="utm_campaign" etiqueta="utm_campaign" opcional ejemplo="agua-2026" />
      <Campo id="enl-autor" name="autor" etiqueta="Quién lo genera" opcional ejemplo="comunicaciones" />
      <Aviso hecho={hecho} />
      <button className="bo-button" data-variant="primary" disabled={guardando}>
        {guardando ? "Generando…" : "Generar enlace y QR"}
      </button>
    </form>
  );
}
