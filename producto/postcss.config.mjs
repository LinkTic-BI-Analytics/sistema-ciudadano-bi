// Tailwind 4 no lleva archivo de configuración: los tokens viven en el CSS
// (ADR 0006). Esto es lo único que hace falta.
export default { plugins: { "@tailwindcss/postcss": {} } };
