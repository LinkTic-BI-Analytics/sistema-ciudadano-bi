# Cosecha

Qué vuelve a la plantilla cuando un negocio termina.

**Sin esto, Fase 1 se muere en su primera versión.** Cada negocio enseña algo —una pregunta
que faltaba en la entrevista, una sección que nadie llenaba nunca, un caso que el árbol de
códigos no resolvía— y ese algo se queda enterrado en una copia que nadie va a volver a
abrir.

## Qué vuelve y qué no

| Vuelve | No vuelve |
|---|---|
| Una pregunta de entrevista que destapó algo y no estaba en el guion | Las respuestas de este negocio |
| Una sección de plantilla que nadie llenó nunca, en tres negocios seguidos | Una que este negocio no necesitó |
| Un caso que el árbol de decisión de códigos no resolvía | Un código concreto |
| Una regla de estilo que hubo que explicar dos veces | Un ejemplo del dominio |
| Un paso del ciclo que siempre se salta | Un frente específico |

La regla: **vuelve la forma, nunca el contenido.** Si al leerlo se puede saber de qué
negocio era, no está listo para volver.

## Los dos repositorios, y las dos direcciones

Esto no vive en un repositorio sino en dos, y saber cuál es cuál evita la mitad de los
errores:

| | |
|---|---|
| **La arena** — `Req-Fase1` | Donde se trabaja con negocios de verdad. **Se ensucia a propósito**: tiene documentos del cliente, un MVP construido, una especificación, vacíos, bitácora |
| **La línea base** — `Req-estandar` | Lo que se clona para cada negocio nuevo. **Está limpia y tiene que seguirlo** |

### Hacia arriba: la cosecha

De la arena a la base sube **la forma, nunca el contenido**. Es la regla de arriba, y la
prueba es la misma: si al leerlo se puede saber de qué negocio era, no está listo para subir.

Lo que más se cuela son tres cosas, y las tres pasaron:

- **Datos del negocio en un archivo de forma.** La vista de módulos subió una vez con los
  cuatro módulos de Product Hunt adentro, sus roles y sus pantallas.
- **Un nombre quemado en una vista del harness.** La telemetría tenía el nombre del negocio
  escrito en el código: una vista del harness no puede saber de qué negocio es.
- **La regla vieja al lado de la nueva.** Al corregir una regla se agregó la corregida y se
  dejó la anterior. El archivo terminó diciendo las dos cosas, y quien lo lea de arriba abajo
  aplica la primera que encuentre. **Corregir es reemplazar, no añadir.**

Las tres se buscan a máquina antes de subir, porque **lo que se cuela no se ve leyendo, se
ve buscando**:

```
./scripts/base-limpia.sh      # en la línea base. Devuelve 1 si encuentra algo
```

**Lo que sí sube con el negocio nombrado** es de dónde salió cada regla. Una regla sin el
caso que la produjo se discute en la primera revisión y se pierde. Eso no es contaminación:
es la razón por la que la regla se sostiene.

### Hacia abajo: refrescar la arena

Y de vez en cuando se trae la base a la arena, se prueba con ella, y se sigue refinando.

**No es sincronizar por prolijidad: es la única forma de comprobar que la base sirve sola.**
En la arena uno siempre tiene el contexto en la cabeza —sabe qué significa cada archivo, qué
falta, por qué eso se llama así— y con ese contexto encima todo se entiende. Quien clone la
base no lo tiene. Bajarla y arrancar con ella es ponerse en el lugar de esa persona, y es
donde se ve lo que a la base le falta.

Lo que se busca al bajarla, en este orden:

1. **¿Arranca?** Que un negocio nuevo pueda empezar sin abrir la arena para copiar algo.
2. **¿Se entiende sin nosotros?** Un archivo que solo se entiende sabiendo cómo quedó en el
   negocio anterior está incompleto.
3. **¿Sobra algo?** Una plantilla con secciones que nadie llenó en dos negocios seguidos.

## Cuándo se hace

Dos momentos, y ninguno es "cuando haya tiempo":

- **Al entregar cada módulo**, la pregunta corta: *¿qué de esto se repetiría en otro
  negocio?* Va en el paso final de `/entregar`, cuando la respuesta está fresca.
- **Al cerrar el negocio**, la revisión completa: releer el guion de la entrevista y las
  plantillas con la experiencia encima, y anotar lo que sobró y lo que faltó.

## Cómo se hace

1. Escribe el cambio en la plantilla de Fase 1, no en tu copia.
2. Si cambia cómo se hace algo, además un ADR corto en `decisiones/` con alcance `método`.
3. Si el cambio afecta a un comando, revisa que el comando siga leyendo la plantilla y no
   traiga la forma por dentro.

## Lo que se va a quedar corto primero

El guion de la entrevista. Está escrito desde un solo negocio, y el segundo va a tener un
bloque entero que aquí no existe. Eso no es un defecto de la plantilla: es exactamente para
lo que existe este archivo.
