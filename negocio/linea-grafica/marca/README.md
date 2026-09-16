Aquí van los archivos de marca: el logo en SVG, las tipografías, los íconos.

El logo va en SVG y no en PNG: se usa en tamaños distintos y en fondo claro y oscuro.
Si solo existe en PNG, se pide igual y se anota que se pidió el SVG.

## Lo que hay hoy

Los archivos de marca llegaron **dentro** de la entrega de tokens, en
`../tokens/patria-milagro-v1/assets/`, y ahí se quedaron: su documentación los referencia por
ruta relativa y separarlos la rompería. Son once PNG —ninguno en SVG, y eso está pedido en el
`README.md` de la carpeta de arriba—.

**El producto sirve uno solo**, `fondo-bandera-dark.png`, y `scripts/marca.sh` lo convierte a JPEG (1,5 MB → 144 KB) en
`producto/public/marca/`. Ese guion lleva la lista de lo que entra y, al lado de cada
ausencia, por qué no entra: el escudo y la marca del Gobierno esperan el manual institucional
(`Q34`), y los logos de Defensores de la Patria y Banco de Talentos son de **otras campañas**
del mismo ecosistema, no de este producto.
