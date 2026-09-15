import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Falla el build si hay un error de tipo. El modo por defecto de Next los
  // deja pasar en producción, y un error de tipo que solo aparece en el editor
  // es un error que nadie ve.
  // **Dónde se compila.** `validar.sh` corre `npm run build` mientras alguien
  // suele tener el `npm run dev` abierto mirando la pantalla, y los dos
  // escribían en `.next`: el build se llevaba por delante el servidor de
  // desarrollo —que empezaba a devolver 500 con manifiestos que ya no
  // existían— y a veces fallaba él mismo, dando un rojo que no era del código.
  //
  // Con la carpeta separada, el chequeo deja de depender de si hay un servidor
  // levantado.
  distDir: process.env.DIR_BUILD || ".next",
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;
