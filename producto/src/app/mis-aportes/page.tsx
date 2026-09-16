import { Consultar } from "./formulario.tsx";
import { Cabecera, Pie, Tricolor } from "../../producto/marca.tsx";

export const dynamic = "force-dynamic";
export const metadata = { title: "Consultar mi aporte" };

export default function MisAportes() {
  return (
    <div className="pc-ui">
      <div className="pc-shell">
        <Cabecera />
        <main className="pc-main">
          <p className="pc-eyebrow"><Tricolor />Consultar</p>
          <h1>¿Qué pasó con lo que conté?</h1>
          <p className="pc-intro">
            Con tu código puedes ver tu aporte y cómo va. No pedimos cuenta ni correo.
          </p>
          <Consultar />
        </main>
        <Pie />
      </div>
    </div>
  );
}
