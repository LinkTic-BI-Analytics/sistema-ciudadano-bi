import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Participación Ciudadana",
  description:
    "Cuéntanos qué necesita mejorar donde vives. Podrás revisar lo que entendimos y conocer qué pasó con tu aporte.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // `lang` no es decorativo: un lector de pantalla lo usa para escoger la voz.
  return (
    <html lang="es-CO">
      <body>{children}</body>
    </html>
  );
}
