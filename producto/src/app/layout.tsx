import type { Metadata } from "next";
import { Montserrat, Inter, JetBrains_Mono } from "next/font/google";
import { GUION_TEMA } from "../producto/tema.tsx";
import { NOMBRE_SISTEMA } from "../producto/nombre.ts";
import "./globals.css";

// Las tres familias que pide la línea gráfica Patria Milagro v1: Montserrat en
// los titulares, Inter en el cuerpo y los controles, JetBrains Mono en las
// cifras que se comparan entre sí —el código del comprobante, los conteos—.
//
// Se sirven desde el propio dominio con `next/font` y no con un `<link>` a
// Google. Dos razones, y ninguna es de estilo:
//
//   · **una petición a un tercero desde el navegador de quien participa** deja
//     su IP en un registro que no controlamos, y aquí se cuentan necesidades
//     que pueden comprometer a quien las cuenta (`C2`);
//   · sin `size-adjust` el titular salta al cargar la fuente, y el salto ocurre
//     justo donde está el botón de contar.
//
// `variable` define la variable CSS que los tokens consumen: los nombres
// `--pc-fuente-*` salen de `participacion.tokens.json`, que es la fuente.
const display = Montserrat({
  subsets: ["latin"], weight: ["700", "800", "900"],
  variable: "--pc-fuente-display", display: "swap",
});
const cuerpo = Inter({
  subsets: ["latin"], weight: ["400", "500", "600", "700", "800"],
  variable: "--pc-fuente-cuerpo", display: "swap",
});
const cifra = JetBrains_Mono({
  subsets: ["latin"], weight: ["400", "700"],
  variable: "--pc-fuente-cifra", display: "swap",
});

export const metadata: Metadata = {
  title: NOMBRE_SISTEMA,
  description:
    "Cuéntanos qué necesita mejorar donde vives. Podrás revisar lo que entendimos y conocer qué pasó con tu aporte.",
};

// El color de la barra del navegador en un teléfono. Sin esto, la barra sale
// blanca sobre una página navy y parece que la pantalla está a medio cargar.
export const viewport = { themeColor: "#06142A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // `lang` no es decorativo: un lector de pantalla lo usa para escoger la voz.
  //
  // `data-tema` arranca en oscuro —el modo principal de la marca— y el guion de
  // abajo lo corrige antes de pintar si esta persona escogió el claro. Por eso
  // el `suppressHydrationWarning`: el atributo que React sirvió y el que hay en
  // el DOM cuando hidrata pueden no coincidir, y aquí eso es lo correcto.
  return (
    <html
      lang="es-CO"
      data-tema="oscuro"
      suppressHydrationWarning
      className={`${display.variable} ${cuerpo.variable} ${cifra.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: GUION_TEMA }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
