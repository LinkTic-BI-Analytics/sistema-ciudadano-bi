import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Falla el build si hay un error de tipo. El modo por defecto de Next los
  // deja pasar en producción, y un error de tipo que solo aparece en el editor
  // es un error que nadie ve.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;
