# La línea gráfica

**Es una entrada del proyecto, como los documentos.** Si el equipo del cliente ya tiene
tokens, una guía de marca o un sistema de diseño, va aquí — y el MVP se construye con eso
desde el primer módulo.

## Por qué importa para descubrir, y no es cosmética

Porque **la línea gráfica cambia de qué habla la gente cuando mira.**

Si el instrumento se ve como un boceto gris, quien lo mira comenta el boceto: que los
botones están feos, que falta el logo, que ese azul no es el nuestro. Si se ve como su
producto, comenta lo que nos sirve: que ese paso sobra, que ahí falta un dato, que nadie
haría eso en ese orden.

Es el mismo problema que resuelve la separación de las dos vistas —que quien viene a validar
mire el producto y no el andamiaje— aplicado al aspecto. Y por eso **no se deja para el
final**: se pone antes de construir el primer módulo, cuando todavía no hay diez pantallas
que rehacer.

## Qué va aquí

**Lo que el cliente entregó, crudo** — igual que `insumos/`:

| Carpeta | Qué se deja ahí |
|---|---|
| **`tokens/`** | **El sistema de diseño tal como venga**: un `tokens.json` de Figma, un `variables.css`, un `tailwind.config.js`, una guía de marca. Es lo que más peso tiene |
| **`marca/`** | Los archivos: el logo en SVG, tipografías, íconos |
| **`referencias/`** | **Lo que alguien vaya pasando**: capturas, enlaces, *"que se vea como esto"*. Cuando no hay sistema, esto es de lo que se construye |
| Este archivo | De dónde salió cada cosa, y qué falta |

**Se copian tal como lleguen.** No hay que convertirlos, ordenarlos ni escoger cuáles sirven:
eso es el paso siguiente y deja rastro.

**Los valores que el producto consume viven en `mvp/src/producto/tokens.css`.** Es la misma
relación que hay entre `insumos/` y `lectura-documental.md`: aquí está la fuente, allá lo
derivado. Y allá **cada valor que no salga de aquí va marcado `PROVISIONAL`**.

## Las reglas

**Si no hay nada, se construye con lo que vaya llegando.** No se espera a tener la marca
completa para arrancar.

**Cada token dice de dónde salió, y hay tres orígenes que no pesan igual**: lo que entregó el
cliente —que es la marca y no se discute—, lo que salió de una referencia —que sirve para
construir pero **no está decidido**— y lo que pusimos nosotros, que no representa ninguna
decisión. Un archivo donde no se distinguen los tres miente al mes.

**Lo que no dio el cliente se marca `PROVISIONAL`.** No se inventa una marca por la misma
razón que no se inventa un número: una paleta plausible es indistinguible de una real y
nadie la va a cuestionar después. Lo provisional se dice en el renglón del token, y se abre
como pregunta en `vacios.md`.

**Esto es del producto, nunca del harness.** `/modulos` y `/telemetria` no se pintan con la
marca del cliente: son las vistas internas y se ven igual en todos los proyectos. Está
escrito en `harness/interfaz.md` I5.

**Un token que nadie usa no existe.** Si se declara un color y ninguna pantalla lo consume,
sobra. Esto no es una guía de marca: es la entrada de la que se construye.

---

## De dónde salió lo que hay hoy

Han llegado **dos entregas**, y la segunda no reemplaza a la primera: la primera trae la
estructura del producto y la segunda la identidad.

| Entrega | Qué trae | Qué manda de ella |
|---|---|---|
| `tokens/sistema-diseno-participacion-v0.5/` | El sistema de tokens en formato DTCG, su generador con la compuerta de contraste, las hojas de componentes de las dos caras —ciudadanía y perfil interno—, y los documentos de dirección y validación | **La estructura**: qué tokens existen, cómo se llaman, qué clase pinta cada cosa, y que el contraste es una compuerta y no una recomendación |
| `tokens/patria-milagro-v1/` (16-sep-2026) | La línea gráfica del ecosistema «Patria Milagro»: `tokens.css`, `tokens.json`, tema de Tailwind, once activos de marca, capturas y una documentación navegable. Sale de medir dos sitios en el navegador —bancodetalentos.com.co y el especial de presidencia.gov.co— no de un manual | **La identidad**: la paleta, las tipografías, los radios, la escala de elevación, el movimiento y el modo oscuro como principal |

**Cómo se juntaron.** No se cargaron dos sistemas: los valores de la segunda entraron en el
JSON de la primera, que sigue siendo la fuente, y el generador volvió a correr. Así la
compuerta de contraste sigue gobernando —ahora en los dos modos, 108 pares— y ninguna
pantalla tuvo que cambiar de clase para cambiar de color. Lo que la primera decía sobre
*forma* y la segunda contradice —el titular serif, que no hubiera sombras, que no hubiera
modo oscuro— está anotado en la cabecera de `direccion-visual.md`, para que dentro de tres
meses nadie tenga que adivinar cuál de las dos manda.

## Qué hay que pedir, y a quién

- **El manual institucional que confirme si va el escudo y la marca del Gobierno**, y en qué
  versión. Es la [`Q34`](../vacios.md) y la [`Q2`](../vacios.md), que son la misma
  conversación. Sin eso, el producto usa la bandera y la tricolor —que son símbolo nacional
  y firma gráfica— y **no** el escudo, que afirma una autoría que nadie ha confirmado.
- **Los logotipos en SVG.** Los once activos llegaron en PNG. Para un logo que se usa en
  tamaños distintos y sobre fondo claro y oscuro, el PNG se ve mal en cuanto crece.
- **Confirmar que el modo oscuro es el que va también para la cara ciudadana.** La entrega lo
  dice del portal y del tablero; este producto además es un formulario que se llena en la
  calle. Se construyó con los dos modos y un botón para cambiar, así que la respuesta no
  bloquea nada — pero cuál sale por defecto sí es una decisión de marca.
