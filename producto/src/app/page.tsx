export default function Página() {
  return (
    <main style={{ padding: "3rem", fontFamily: "system-ui, sans-serif", maxWidth: "42rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>El proyecto base levanta</h1>
      <p>
        Esto no es el producto: es la comprobación de que el andamiaje arranca. Lo que se ve
        aquí se reemplaza con el primer módulo que pase la prueba del sobre cerrado.
      </p>
      <p style={{ color: "#5b6572" }}>
        No hay ninguna tabla todavía, y es a propósito. Ver{" "}
        <code>supabase/schemas/LEEME.md</code>.
      </p>
    </main>
  );
}
