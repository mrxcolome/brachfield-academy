# PENDIENTE: regenerar las 4 imágenes de recursos (aprobado por el propietario 2026-08-17)

Las 4 tarjetas del bloque «Recursos que usarás mañana mismo» de la landing
siguen con imágenes "de ambiente". El propietario aprobó regenerarlas con el
enfoque **documento protagonista** ya validado en formato-plantillas y
formato-recursos (v2).

## Procedimiento (sesión con el conector Magnific de claude.ai activo)

1. Generar cada imagen con `images_generate`:
   - mode: `seedream-5-pro` · aspectRatio: `16:9` · resolution: `2k` · count: 1
   - references: `[{ "type": "style", "identifier": "79NMEd9JAL" }]` (la imagen
     de Cursos aprobada, referencia de estilo de toda la serie)
2. Esperar con `creations_wait`, enseñar los webUrl al propietario y esperar su OK.
3. Integración por el puente de GitHub (el sandbox no alcanza pikaso.cdnpk.net):
   escribir `docs/landing-image-urls.json` con `{ "imagenes": { "<nombre>": "<url firmada>" } }`
   y hacer push → el workflow fetch-landing-images descarga, optimiza a WebP y
   commitea en public/landing/ → `git pull`, borrar el json temporal, actualizar
   los identificadores en docs/landing-images.json, push. La landing y todas las
   tarjetas de la plataforma se actualizan solas (mismo nombre de archivo).
4. Borrar este archivo al terminar.

## Los 4 prompts (ESCENA distinta; el resto idéntico en los cuatro)

Plantilla común — sustituir `{ESCENA}`:

> Fotografía corporativa editorial, una imagen de una misma serie fotográfica coherente. ESCENA: {ESCENA} ESCENARIO: siempre la misma oficina moderna de Barcelona: mesas de roble claro, sillas tapizadas en azul marino, luz de media mañana. CÁMARA: plano picado a unos 40 grados, muy cerrado sobre el documento; solo el documento nítido, bordes suavemente desenfocados. LUZ: luz natural de ventana desde la izquierda, sombras suaves, sin flash. COLOR: etalonaje editorial apagado y elegante: azules marinos profundos, grises cálidos, roble claro y un único acento ámbar; contraste bajo. EVITAR: texto legible, rótulos, logotipos; nada de HDR ni aspecto de ilustración o 3D. FORMATO: fotografía horizontal 16:9, realista, estilo reportaje corporativo editorial de consultoría financiera premium.

| Archivo | ESCENA |
| --- | --- |
| recurso-politica | primer plano cenital de un documento ejecutivo de portada sobria que llena la mayor parte del encuadre, con encabezado y párrafos claramente estructurados (texto desenfocado e ilegible) y una línea de firma al pie; una pluma estilográfica elegante reposa sobre el documento; nada más en escena. |
| recurso-ficha | primer plano cenital de un formulario de evaluación con casillas, campos y una columna de puntuación, sujeto a un portapapeles azul marino que llena la mayor parte del encuadre; una calculadora asoma desenfocada por una esquina; nada más en escena. |
| recurso-procedimiento | primer plano cenital de un diagrama de flujo impreso con cajas conectadas por flechas que llena el encuadre; una mano coloca una nota adhesiva ámbar sobre una de las cajas; nada más en escena. |
| recurso-plan | primer plano cenital de un cronograma impreso con etapas ordenadas sobre una línea temporal que llena el encuadre; una mano desplaza una pequeña ficha ámbar de una etapa a la siguiente; nada más en escena. |
