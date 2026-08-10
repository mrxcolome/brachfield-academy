// Config propio del prototipo: evita que Vite herede el postcss.config.mjs
// de la raíz (Tailwind 4 del producto), que no está en estas dependencias.
module.exports = { plugins: {} }
