# Guía inicial para una construcción sólida y paralela

## Propósito

Esta guía conecta dos capacidades distintas:

- **El estándar de descubrimiento** convierte conversaciones, documentos y decisiones de
  negocio en dominio, reglas, invariantes, evidencia y módulos entregables.
- **La disciplina de ejecución de Superpowers** convierte una especificación aprobada en
  planes pequeños, trabajo aislado, revisiones y verificación antes de integrar.

No se reemplaza un método con el otro. El primero decide **qué debe construirse y por qué**;
el segundo organiza **cómo construirlo sin perder control cuando trabajan varias personas o
agentes**.

El resultado buscado es que cualquier participante pueda responder, sin reconstruir la
historia de una conversación:

1. ¿Qué estamos construyendo?
2. ¿Por qué existe?
3. ¿Qué autoridad respalda la decisión?
4. ¿Qué está listo, en curso, bloqueado o terminado?
5. ¿Qué puede hacerse en paralelo ahora?
6. ¿Qué depende de qué?
7. ¿Cómo se comprobará que quedó bien?
8. ¿Quién puede modificar cada parte?

---

## 1. Las dos capas del proceso

### Capa A — Descubrimiento

Su producto no es el código del MVP. Su producto es conocimiento verificable del negocio:

- vocabulario y dominio;
- requerimientos funcionales (`RF`);
- cualidades (`C`);
- principios (`P`);
- reglas (`R`);
- invariantes (`I`);
- vacíos y decisiones;
- evidencia obtenida al construir y mostrar;
- módulos autocontenidos para el equipo de desarrollo.

En esta capa, construir es un instrumento para hacer aparecer preguntas. Por eso no deben
construirse varios frentes de descubrimiento simultáneamente solo para ganar velocidad: lo
aprendido en un frente puede cambiar, crear, reordenar o eliminar el siguiente.

### Capa B — Construcción formal

Comienza cuando existe al menos un módulo entregable que pasa la prueba del sobre cerrado.
Su producto sí es software mantenible:

- un plan de implementación trazable al módulo;
- tareas con límites e interfaces explícitas;
- pruebas automatizadas;
- cambios aislados;
- revisiones de cumplimiento y calidad;
- integración verificada;
- un registro durable del progreso.

En esta capa sí se busca paralelismo, pero únicamente entre tareas cuya independencia esté
demostrada.

### Regla de autoridad

Cuando dos artefactos se contradigan, manda el de mayor autoridad:

1. La decisión explícita de la persona autorizada del negocio.
2. El módulo entregable vigente y sus códigos `RF`, `C`, `P`, `R` e `I`.
3. La especificación vigente del negocio.
4. Las decisiones registradas en `vacios.md`.
5. El plan de implementación.
6. El contrato de una tarea.
7. El código existente.

El plan explica cómo cumplir la especificación; no tiene autoridad para cambiarla. El código
demuestra una implementación; no convierte automáticamente su comportamiento en regla de
negocio.

---

## 2. Principios que gobiernan todo el trabajo

### 2.1 La invariante manda sobre la velocidad

Ninguna línea paralela puede debilitar una invariante. La unidad de pertenencia y la
invariante suprema se implementan antes de los datos que podrían violarlas y se comprueban
en la integración completa.

### 2.2 Paralelo significa independiente, no simplemente simultáneo

Dos tareas solo pueden ejecutarse en paralelo cuando:

- no modifican los mismos archivos o recursos compartidos;
- no toman decisiones sobre la misma regla;
- sus interfaces ya están escritas y aprobadas;
- ninguna necesita el resultado todavía desconocido de la otra;
- pueden probarse de manera independiente;
- existe una prueba de integración que reunirá sus resultados.

Si cualquiera de estas condiciones falla, las tareas se ordenan por dependencia.

### 2.3 Una sola persona o agente integra

Puede haber muchos constructores, pero cada conjunto de trabajo tiene un único
**orquestador-integrador**. Esta figura asigna límites, resuelve solapamientos, controla la
hoja de ruta y verifica el resultado completo. Los agentes constructores no integran sus
propios cambios a la línea principal.

### 2.4 El estado vive en archivos, no en la memoria del chat

La hoja de ruta y el registro de ejecución son recuperables después de una pausa, cambio de
agente o pérdida de contexto. Una tarea no se considera terminada porque un agente lo diga:
se considera terminada cuando el registro enlaza sus pruebas, revisión y cambio integrado.

### 2.5 Evidencia antes que afirmaciones

“Terminado”, “corregido” y “cumple” requieren evidencia reciente:

- comando ejecutado;
- resultado esperado y resultado obtenido;
- revisión realizada;
- trazabilidad a los códigos del negocio;
- comprobación de integración cuando corresponda.

### 2.6 El MVP y el producto no comparten obligaciones

El MVP se optimiza para aprender con rapidez y respetar invariantes. El producto formal se
optimiza para operar, mantenerse y evolucionar. El código del MVP puede servir como
evidencia o ejemplo, pero no se copia automáticamente al producto.

---

## 3. Quién maneja qué

### Persona responsable del negocio

Maneja:

- decisiones de negocio;
- confirmación del vocabulario;
- elección de la invariante suprema;
- selección del siguiente paso visible durante el descubrimiento;
- resolución de contradicciones y vacíos;
- aceptación de lo observado en una validación;
- cambios de alcance.

No se delega a un agente:

- inventar una regla ausente;
- escoger entre dos afirmaciones contradictorias de la persona;
- autorizar costos, cuentas, publicación o acciones externas;
- declarar validado algo que ninguna persona validadora vio.

### Orquestador-integrador

Maneja:

- la hoja de ruta;
- el grafo de dependencias;
- la identificación de tareas paralelizables;
- la asignación de propietarios y límites de archivos;
- los contratos entre tareas;
- la secuencia de integración;
- las decisiones técnicas transversales;
- el registro de progreso;
- la verificación completa;
- la comunicación del estado real.

Es responsable de impedir:

- dos agentes editando la misma superficie;
- trabajo iniciado sobre una especificación no aprobada;
- estados declarados sin evidencia;
- integración de una tarea que no pasó revisión;
- cambios silenciosos de interfaz;
- que una decisión técnica se registre como si fuera una regla de negocio.

### Agente de descubrimiento

Maneja:

- lectura y síntesis de insumos;
- preparación de preguntas;
- documentación del dominio;
- trazabilidad entre códigos;
- detección y registro de vacíos;
- propuesta de frentes y pasos;
- actualización de la bitácora;
- preparación del módulo entregable.

No puede cerrar por su cuenta una pregunta que depende del negocio.

### Agente planificador

Maneja:

- transformar un módulo aprobado en un plan ejecutable;
- descomponer por resultados verificables, no solo por capas técnicas;
- declarar archivos, interfaces, pruebas y dependencias;
- identificar la ruta crítica;
- proponer grupos de ejecución paralela;
- comprobar cobertura entre códigos del módulo y tareas del plan.

No implementa mientras el plan tenga contradicciones o interfaces sin definir.

### Agente constructor

Maneja una sola tarea o dominio independiente:

- lee el contrato de la tarea y las fuentes autorizadas;
- modifica únicamente la superficie asignada;
- escribe y ejecuta sus pruebas;
- documenta las decisiones técnicas locales;
- entrega un resumen de archivos, pruebas y riesgos;
- no cambia una interfaz compartida sin volver al orquestador.

### Agente revisor de cumplimiento

Responde una pregunta: **¿lo construido cumple exactamente el módulo y el contrato de la
tarea?**

Revisa:

- cobertura de `RF`, `C`, `P`, `R` e `I` asignados;
- trabajo faltante;
- comportamiento agregado sin autorización;
- casos de verificación;
- límites de alcance.

No se concentra primero en estilo o elegancia. Primero determina si se construyó lo
correcto.

### Agente revisor técnico

Responde una pregunta distinta: **¿está bien construido?**

Revisa:

- claridad y mantenibilidad;
- pruebas y diseño de errores;
- seguridad y aislamiento;
- contratos e integraciones;
- duplicación y complejidad innecesaria;
- consistencia con el repositorio.

El constructor no aprueba su propio trabajo.

---

## 4. Los artefactos mínimos

Esta es una estructura conceptual inicial. Las rutas definitivas deben adaptarse a la
partición del repositorio donde se implemente.

```text
negocio/
  dominio.md
  especificacion.md
  vacios.md
  bitacora.md
  hoja-de-ruta-descubrimiento.md

entregable/
  README.md
  modulos/
    M01-<nombre>.md
  mapa-de-modulos.md

construccion/                     # En el repositorio del producto formal
  hoja-de-ruta.md
  decisiones/
  planes/
    AAAA-MM-DD-<resultado>.md
  tareas/
    T001-<nombre>.md
  progreso/
    <plan>-registro.md
  revisiones/
```

### `hoja-de-ruta-descubrimiento.md`

Muestra frentes y pasos del MVP. Es una hipótesis que se revisa después de validar cada
frente. No autoriza construir frentes dependientes simultáneamente.

### `mapa-de-modulos.md`

Resume los módulos entregados, sus dependencias, consumidores y nivel de evidencia. Permite
ver qué módulos del producto formal podrían implementarse en paralelo.

### `hoja-de-ruta.md`

Es el tablero canónico de la construcción formal. No contiene el detalle completo de cada
tarea; contiene el estado, dependencia, propietario y evidencia necesaria para entender el
conjunto.

### Plan de implementación

Explica la arquitectura y divide un resultado en tareas pequeñas, revisables y probables de
terminar. Cada tarea enlaza el módulo que le da autoridad.

### Contrato de tarea

Es la unidad que recibe un agente constructor. Debe poder leerse sin depender de toda la
conversación anterior.

### Registro de progreso

Conserva hechos de ejecución: tareas iniciadas o terminadas, revisiones, pruebas, cambios
integrados, decisiones del orquestador y bloqueos. No sustituye la hoja de ruta: la hoja de
ruta da la vista del sistema; el registro permite recuperar la ejecución exacta.

---

## 5. Formato de la hoja de ruta

La hoja de ruta debe comenzar con:

```markdown
# Hoja de ruta — <producto>

**Objetivo vigente:** <resultado observable>
**Fuente:** <módulos y versiones que gobiernan>
**Actualizada:** <fecha y responsable>
**Ruta crítica:** <T001 → T004 → T009>
**Líneas paralelas activas:** <A, B, C>
```

Tabla mínima:

```markdown
| ID | Resultado | Códigos | Depende de | Línea | Propietario | Estado | Evidencia de cierre |
|---|---|---|---|---|---|---|---|
| T001 | Aislar datos por organización | I1, C2 | — | base | agente-a | en revisión | prueba de aislamiento |
| T002 | Consultar catálogo | RF3, R4 | T001 | A | agente-b | listo | pruebas de consulta |
| T003 | Preparar datos demo | RF3 | T001 | B | agente-c | listo | escenario cargado |
```

### Estados permitidos

- **candidato:** apareció, pero todavía no tiene contrato suficiente.
- **listo:** tiene autoridad, dependencias resueltas, propietario y prueba de cierre.
- **en construcción:** su propietario está trabajando y no existe otro propietario activo.
- **bloqueado:** no puede avanzar; incluye causa, dueño del desbloqueo y fecha de urgencia.
- **en revisión:** implementación entregada, pendiente de una o ambas revisiones.
- **en integración:** aprobada de forma aislada, pendiente de verificarse con el conjunto.
- **terminado:** integrada y comprobada con evidencia reciente.
- **caído:** ya no se construirá; conserva la razón y la decisión que lo retiró.

No se usan estados ambiguos como “avanzado”, “casi” o “pendiente”.

### Reglas de actualización

- Cada cambio de estado registra fecha y evidencia.
- Una tarea bloqueada indica **qué sí puede construirse sin la respuesta**.
- Una tarea nueva se agrega sin borrar la historia anterior.
- Una tarea reordenada conserva el porqué.
- Una tarea `terminado` no se reabre en silencio: vuelve a `listo` con la causa.
- Si cambia un código del módulo, se revisan todas las tareas que lo citan.

---

## 6. Formato del contrato de una tarea

```markdown
# TNNN — <resultado verificable>

**Objetivo:** <una frase observable>
**Autoridad:** <módulo, versión y códigos exactos>
**Propietario:** <persona o agente>
**Depende de:** <IDs o “ninguna”>
**Puede ejecutarse en paralelo con:** <IDs y razón>

## Contexto suficiente

<Lo que el ejecutor necesita saber sin leer todo el proyecto.>

## Dentro del alcance

- <resultado autorizado>

## Fuera del alcance

- <lo que no debe tocarse>

## Superficie asignada

- Crear: `<ruta>`
- Modificar: `<ruta>`
- Leer: `<ruta>`
- No modificar: `<ruta o componente compartido>`

## Interfaces

**Consume:**
- `<nombre exacto, entrada y garantía>`

**Produce:**
- `<nombre exacto, salida y garantía>`

## Invariantes aplicables

- `I_`: <cómo se protege y cómo se prueba>

## Casos de verificación

- [ ] <caso literal o derivado del módulo> → <resultado esperado>

## Pasos de ejecución

- [ ] Escribir o ajustar una prueba que falle por la ausencia del comportamiento.
- [ ] Ejecutarla y registrar la falla esperada.
- [ ] Implementar el cambio mínimo.
- [ ] Ejecutar la prueba y registrar el resultado.
- [ ] Ejecutar las verificaciones de la superficie afectada.
- [ ] Preparar el paquete de revisión.

## Terminado cuando

- [ ] Cumple los códigos asignados y no agrega alcance.
- [ ] Las pruebas de la tarea pasan.
- [ ] No modifica superficies ajenas.
- [ ] Pasó revisión de cumplimiento.
- [ ] Pasó revisión técnica.
- [ ] Está listo para la prueba de integración indicada.

## Entrega esperada

- Archivos cambiados.
- Pruebas ejecutadas y resultados.
- Decisiones técnicas tomadas.
- Riesgos o supuestos residuales.
```

---

## 7. Prueba para autorizar paralelismo

Antes de lanzar dos o más tareas simultáneas, el orquestador llena esta matriz:

```markdown
| Par de tareas | ¿Comparten archivos? | ¿Comparten estado? | ¿Interfaz estable? | ¿Una espera a la otra? | Decisión |
|---|---:|---:|---:|---:|---|
| T002 / T003 | no | no | sí | no | paralelo |
| T002 / T004 | sí | sí | no | sí | secuencial: T002 → T004 |
```

### Una tarea está lista para ejecución paralela cuando

- [ ] Su autoridad y versión están identificadas.
- [ ] Todas sus dependencias están `terminado` o existe un contrato estable aprobado.
- [ ] Tiene un único propietario.
- [ ] Su superficie de archivos no se superpone con otra tarea activa.
- [ ] Sus entradas y salidas tienen nombres y tipos exactos.
- [ ] Tiene prueba de cierre independiente.
- [ ] Tiene prueba de integración prevista.
- [ ] Tiene un espacio de trabajo aislado.
- [ ] No contiene una decisión de negocio abierta.

Si una tarea no pasa la lista, puede seguir refinándose, pero no se despacha.

### Trabajo que normalmente sí puede ir en paralelo

- módulos sin dependencia entre ellos;
- adaptadores detrás de contratos ya aprobados;
- pruebas de un comportamiento ya especificado;
- documentación técnica de una interfaz estable;
- preparación de datos o fixtures aislados;
- auditorías sobre superficies diferentes;
- frontend y backend cuando el contrato está cerrado y ambos usan pruebas de contrato.

### Trabajo que normalmente no debe ir en paralelo

- selección de la invariante suprema;
- dos tareas que cambian el mismo modelo de datos;
- diseño e implementación simultánea de una interfaz todavía incierta;
- varios frentes de descubrimiento cuyo orden depende de lo que se aprenda;
- una migración y una función que desconoce todavía su esquema final;
- correcciones que probablemente comparten la misma causa raíz;
- cualquier trabajo cuyo éxito solo pueda comprobarse al final de todo el proyecto.

---

## 8. Ciclo operativo completo

### Etapa 1 — Descubrir

1. Leer insumos y preparar preguntas.
2. Confirmar dominio y recorrido mínimo.
3. Escribir la especificación con al menos una invariante.
4. Definir frentes por valor observable y dependencia.
5. Escoger un paso visible dentro del frente activo.
6. Construir, mostrar y registrar lo que apareció.
7. Validar y devolver las brechas a la especificación.
8. Entregar cada módulo que ya pueda pasar la prueba del sobre cerrado.

**Compuerta de salida:** el módulo es autocontenido, trazable, verificable y declara lo que
el MVP probó y lo que no.

### Etapa 2 — Planear la construcción formal

1. Leer el módulo y comprobar su versión.
2. Mapear archivos, componentes, contratos e integraciones.
3. Descomponer en tareas con resultados independientes.
4. Mapear cada código del módulo a una o más tareas.
5. Construir el grafo de dependencias.
6. Identificar la ruta crítica y los grupos paralelos.
7. Revisar el plan contra el módulo.

**Compuerta de salida:** ningún código queda sin tarea; ninguna tarea carece de fuente,
prueba o dependencia explícita.

### Etapa 3 — Preparar

1. Crear o verificar una línea de trabajo aislada por tarea o grupo independiente.
2. Comprobar la línea base de pruebas.
3. Crear el registro de progreso del plan.
4. Asignar propietarios y superficies.
5. Completar la matriz de paralelismo.

**Compuerta de salida:** todas las tareas despachadas están en estado `listo`.

### Etapa 4 — Construir

1. Cada constructor recibe solo el contexto que necesita.
2. Trabaja dentro de su superficie.
3. Comprueba primero que la prueba detecta la ausencia del comportamiento.
4. Implementa el cambio mínimo que satisface el contrato.
5. Ejecuta las verificaciones locales.
6. Entrega un paquete de revisión; no declara integrado su propio trabajo.

### Etapa 5 — Revisar

Para cada tarea:

1. Revisión de cumplimiento contra módulo y contrato.
2. Corrección de brechas de cumplimiento.
3. Revisión técnica sobre el resultado correcto.
4. Corrección de problemas técnicos.
5. Revisión acotada de las correcciones.

Una revisión que encuentra un cambio necesario en el negocio no lo resuelve: crea un vacío
y devuelve el asunto a la autoridad correspondiente.

### Etapa 6 — Integrar

1. Integrar en el orden del grafo, no en el orden de llegada.
2. Resolver conflictos comparando contra la autoridad, no escogiendo el cambio más reciente.
3. Ejecutar pruebas de contratos e integración.
4. Ejecutar la suite completa.
5. Comprobar invariantes y migraciones.
6. Actualizar hoja de ruta y registro con evidencia.

### Etapa 7 — Cerrar

1. Realizar una revisión del conjunto, no solo de cada tarea.
2. Confirmar cobertura de todos los códigos del módulo.
3. Documentar riesgos o supuestos que sobreviven.
4. Preparar la decisión humana correspondiente: integrar, abrir revisión externa, conservar
   la línea de trabajo o descartarla.
5. Marcar `terminado` únicamente después de la verificación final.

---

## 9. Paquete de revisión

Cada constructor entrega:

```markdown
## Tarea
TNNN — <nombre>

## Autoridad cubierta
<módulo, versión y códigos>

## Cambios
- `<archivo>`: <qué cambió y por qué>

## Pruebas
- `<comando>` → <resultado observado>

## Decisiones técnicas
- <decisión, razón y costo si fuera incorrecta>

## No se modificó
- <límites relevantes>

## Riesgos o preguntas
- <ninguno, o lista concreta>
```

El revisor recibe además el contrato y el cambio exacto. No debe depender del resumen del
constructor como única evidencia.

---

## 10. Cómo informar el estado

El reporte operativo debe ser corto y siempre tener el mismo orden:

1. **Objetivo vigente.**
2. **Dónde vamos.** Etapa y último resultado integrado.
3. **En construcción.** Tareas, propietarios y líneas activas.
4. **Qué puede empezar ahora.** Tareas `listo` y por qué son independientes.
5. **Bloqueos.** Causa, dueño, urgencia y qué puede avanzarse sin la respuesta.
6. **Ruta crítica.** La secuencia que determina el tiempo mínimo restante.
7. **Riesgos de deterioro.** Trabajo construido sin revisar, integrar, validar o entregar.
8. **Siguiente decisión.** Una sola acción o decisión necesaria.

Ejemplo:

```markdown
**Objetivo:** permitir reservas sin duplicidad.
**Dónde vamos:** contrato de reservas aprobado; T001 integrada.
**En construcción:** T002/API (agente-a) y T003/interfaz (agente-b).
**Puede empezar:** T005/datos demo; consume el contrato aprobado y no toca producción.
**Bloqueo:** T004 espera el horario de corte — dueña: Operaciones; urgente antes de integrar.
Sin ese dato sí puede construirse el registro de cancelación, pero no decidir la devolución.
**Ruta crítica:** T002 → T004 → T007.
**Se está deteriorando:** T006 lleva dos días construida sin revisión técnica.
**Siguiente:** revisar T006.
```

---

## 11. Comandos o capacidades que conviene incorporar

Los nombres son provisionales. Pueden implementarse como comandos, skills o scripts según el
entorno.

### `/hoja-de-ruta`

Lee especificación, bitácora, módulos, planes y registros. Informa:

- etapa actual;
- dependencias;
- ruta crítica;
- tareas listas;
- grupos paralelizables;
- bloqueos y deterioro;
- evidencia que falta para cerrar.

No cambia el orden sin registrar la razón.

### `/planear-construccion <módulo>`

Convierte un módulo entregable en:

- mapa de archivos y responsabilidades;
- plan de implementación;
- contratos de tareas;
- matriz de dependencias;
- propuesta de líneas paralelas;
- pruebas de integración.

### `/despachar`

Solo despacha tareas que pasan la prueba de paralelismo. Entrega a cada agente contexto
acotado, contrato, límites y resultado esperado.

### `/revisar-tarea <ID>`

Ejecuta primero cumplimiento y después calidad. Registra hallazgos por severidad y exige
evidencia para cerrarlos.

### `/integrar <ID>`

Verifica aprobaciones, integra en orden de dependencias, ejecuta pruebas completas y actualiza
la hoja de ruta.

### Evolución de `/donde-voy`

Debe conservar su diagnóstico del descubrimiento y, cuando exista construcción formal,
agregar:

- trabajo activo por línea;
- tareas listas para paralelo;
- ruta crítica;
- revisiones e integraciones envejecidas;
- módulo o plan cuya versión quedó desactualizada.

---

## 12. Ejemplo de partición correcta

Supongamos un módulo para reservas con:

- `I1`: un espacio nunca queda reservado dos veces para el mismo instante;
- `RF3`: reservar un espacio;
- `RF4`: cancelar una reserva;
- `R2`: cálculo del cupo;
- una integración externa para notificaciones.

Grafo inicial:

```text
T001 pertenencia y aislamiento
  └── T002 modelo y restricción de reservas
        ├── T003 API de reserva
        │     └── T006 interfaz de reserva
        ├── T004 cancelación y cupo
        │     └── T007 interfaz de cancelación
        └── T005 contrato de eventos
              └── T008 adaptador de notificaciones

T009 datos demo depende de T002
T010 pruebas de recorrido depende de T006, T007 y T009
```

Decisión de ejecución:

- T001 y T002 son secuenciales porque establecen pertenencia e invariante.
- Después de T002 pueden comenzar T003, T004, T005 y T009 si sus archivos y contratos no se
  superponen.
- T006 espera la interfaz producida por T003.
- T007 espera el comportamiento producido por T004.
- T008 espera el contrato T005, pero puede usar un servicio simulado.
- T010 es la compuerta que reúne las líneas y vuelve visible el comportamiento completo.

La ganancia de tiempo no viene de lanzar diez agentes el primer día. Viene de construir
primero una base pequeña y estable que abre cuatro líneas realmente independientes.

---

## 13. Antipatrones que este modelo evita

### Paralelizar antes de decidir

Síntoma: varios agentes construyen interpretaciones distintas de una regla abierta.

Respuesta: devolver la decisión a descubrimiento y mantener las tareas como `candidato`.

### Partir únicamente por capas técnicas

Síntoma: base de datos, API y pantallas avanzan durante semanas sin producir un recorrido
verificable.

Respuesta: cada grupo de tareas debe cerrar un resultado observable y una prueba de
integración.

### Compartir archivos entre agentes

Síntoma: conflictos frecuentes, cambios que desaparecen o revisiones imposibles de atribuir.

Respuesta: redefinir superficies, estabilizar una interfaz o ejecutar secuencialmente.

### Dar todo el contexto a todos

Síntoma: cada agente reinterpreta el proyecto completo, cambia alcance o toma decisiones que
no le pertenecen.

Respuesta: contrato autocontenido, fuentes exactas y límites explícitos.

### Confiar en “terminado” sin integración

Síntoma: todas las tareas pasan solas, pero el sistema completo falla.

Respuesta: estado `en integración`, pruebas contractuales, suite completa y revisión final.

### Dejar el progreso en el chat

Síntoma: tras una pausa se repiten tareas o nadie sabe cuál versión se revisó.

Respuesta: hoja de ruta y registro identificados por plan y respaldados por cambios verificables.

### Copiar el MVP al producto

Síntoma: decisiones provisionales de veinte minutos se convierten en arquitectura permanente.

Respuesta: el módulo entregable es la autoridad; el MVP solo aporta evidencia y ejemplos.

---

## 14. Adopción recomendada

### Paso 1 — Visibilidad, sin paralelismo todavía

- Crear las dos hojas de ruta.
- Normalizar estados.
- Registrar dependencias y ruta crítica.
- Hacer que `/donde-voy` reporte trabajo listo, bloqueado y deteriorado.

Esto permite comprobar si el mapa representa el trabajo real antes de automatizarlo.

### Paso 2 — Contratos y revisiones

- Crear la plantilla de tarea.
- Separar revisión de cumplimiento y revisión técnica.
- Exigir paquetes de evidencia.
- Incorporar un registro durable por plan.

### Paso 3 — Paralelismo controlado

- Ejecutar primero dos tareas pequeñas e independientes.
- Usar espacios de trabajo aislados.
- Medir conflictos, retrabajo y tiempo de integración.
- Ajustar la matriz de paralelismo con lo aprendido.

### Paso 4 — Automatización

- Generar el grafo y los reportes desde los artefactos.
- Comprobar solapamientos de archivos.
- Validar cobertura entre códigos y tareas.
- Ejecutar automáticamente pruebas y compuertas de integración.

### Paso 5 — Cosecha

Después de usar el modelo en un proyecto real:

- conservar lo que redujo esperas o retrabajo;
- eliminar ceremonias que no produjeron una decisión o evidencia;
- convertir fallas repetidas en chequeos automáticos;
- actualizar la línea base solo con prácticas ya probadas.

---

## 15. Definición de éxito de este modelo

La combinación funciona cuando:

- ninguna tarea se inicia sin saber qué decisión de negocio implementa;
- una persona nueva puede reconstruir el estado leyendo archivos;
- el sistema muestra qué puede comenzar sin esperar;
- dos agentes pueden trabajar a la vez sin tocar la misma superficie;
- los contratos permiten integrar sin renegociar nombres o tipos;
- cada cambio pasa revisión de cumplimiento y calidad;
- las invariantes se comprueban en el conjunto;
- el progreso paralelo reduce tiempo sin aumentar correcciones;
- lo aprendido construyendo vuelve a la especificación;
- el producto formal conserva la trazabilidad hasta la evidencia del descubrimiento.

La regla final es sencilla:

> Primero se estabiliza el conocimiento que todos necesitan. Después se paraliza el trabajo
> que ya no necesita tomar esa decisión. Finalmente se integra y se verifica como un solo
> sistema.
