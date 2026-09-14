import { Consultar } from "./formulario.tsx";

export const dynamic = "force-dynamic";
export const metadata = { title: "Consultar mi aporte" };

export default function MisAportes() {
  return (
    <div className="pc-ui">
      <div className="pc-shell">
        <header className="pc-header">
          <span className="pc-brand">Participación Ciudadana</span>
        </header>
        <main className="pc-main">
          <p className="pc-eyebrow">Consultar</p>
          <h1>¿Qué pasó con lo que conté?</h1>
          <p className="pc-intro">
            Con tu código puedes ver tu aporte y cómo va. No pedimos cuenta ni correo.
          </p>
          <Consultar />
        </main>
      </div>
    </div>
  );
}
