import { Formulario } from "./formulario.tsx";

export const dynamic = "force-dynamic";

export const metadata = {
  // La misma frase que la portada. Decía «en tu comunidad» y la portada «donde
  // vives»: son la misma promesa dicha de dos formas, y quien llega desde un QR
  // no tiene por qué comprobar que aterrizó en el sitio correcto.
  title: "Cuéntanos qué necesita mejorar donde vives",
};

export default function Participar() {
  return (
    <div className="pc-ui">
      <div className="pc-shell">
        <header className="pc-header">
          <span className="pc-brand">Participación Ciudadana</span>
        </header>
        <main className="pc-main">
          <p className="pc-eyebrow">Contar una necesidad</p>
          <h1>Cuéntanos qué necesita mejorar donde vives</h1>
          <p className="pc-intro">
            Podrás revisar lo que entendimos y conocer qué pasó con tu aporte.
            No necesitas cuenta ni correo.
          </p>
          {/* La clave de envío se dibuja aquí, del lado del servidor: el
              formulario tiene que poder enviarse antes de que el navegador
              hidrate. `force-dynamic` arriba es lo que garantiza que sea una por
              visita y no una compartida. */}
          <Formulario claveDeReserva={crypto.randomUUID()} />
        </main>
        <footer className="pc-footer">
          <p className="pc-help">
            Esto registra información para que un equipo la revise.{" "}
            <strong>No es un canal de emergencias.</strong> Si hay personas en peligro, llama
            ahora al 123.
          </p>
        </footer>
      </div>
    </div>
  );
}
