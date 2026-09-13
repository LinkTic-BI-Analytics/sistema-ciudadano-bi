# Lectura documental — Participación Ciudadana Colombia

**Leído el 2026-09-13** · 24 documentos en `negocio/fuentes-2026-09-11/`, 3.696 líneas.

## 0 · Por dónde va esto

Hay un cuerpo documental grande y coherente sobre un servicio para que cualquier persona en
Colombia cuente qué necesita mejorar en su comunidad, y para que los equipos públicos
conviertan esos relatos en necesidades territoriales trazables.

**Lo primero que hay que saber es que todo el paquete PROPONE. Ninguno describe un sistema
que opere.** No hay reglamento de algo en marcha, ni manual de un sistema en producción, ni
registro de cómo funciona hoy una herramienta. Todo lo que dice es una intención, incluido lo
que suena decidido — los modelos de datos, las listas de requisitos con código, las tablas de
indicadores. Eso no lo hace falso; lo hace **no comprobado**.

**Y sí hay sustituto, que es lo único con peso de evidencia aquí.** La participación en la
planeación nacional ya existe y está regulada: la **Ley 152 de 1994** organiza el
procedimiento, el **Sistema Nacional de Planeación** articula el Consejo Nacional de
Planeación y los Consejos Territoriales, y la discusión del proyecto de plan pasa por ellos
produciendo recomendaciones y observaciones. Lo que se propone construir **no reemplaza ese
mecanismo**: se conecta con él o queda al lado, y en ninguno de los 24 documentos está dicho
cuál de las dos cosas.

Esa es la pregunta más grande que dejó la lectura, y no es técnica.

Este archivo **no decide nada**. Es orientación para llegar con una idea de la forma del
problema en vez de con una hoja en blanco. Si alguien del negocio dice otra cosa, manda la
persona.

---

## 1 · Qué se leyó

Todo lo escribió el mismo equipo entre el 11 y el 13 de septiembre de 2026, por encargo de
Miguel Gómez. **Ninguno tiene acuerdo institucional**, y varios lo dicen en su propia primera
página.

| Documento | Qué es | Autoridad |
|---|---|---|
| `investigacion_planeacion_ciudadana_colombia_v2.md` (717 líneas) | La investigación sobre cómo funciona hoy la planeación participativa, con el marco legal y sus fuentes citadas | **La más alta del paquete.** Es lo único que describe algo que existe |
| `especificacion_nucleo_participacion_v2.md` | Las 20 necesidades `N01`–`N20`, cada una con motivo y prueba sintética | Propone |
| `especificacion_datos_y_bi_v1.md` | Unidades de información, datos mínimos, 13 requisitos construibles, contrato de indicadores y la prueba de punta a punta | Propone |
| `definicion_producto_participacion_v1.md` | Superficies, modelo mínimo de información, tareas de IA | Propone |
| `especificacion_participacion_eventos_e_internet_v1.md` | Encuentros virtuales y participación web sin reunión | Propone |
| `requisitos_visibilidad_agrupacion_y_campanas_v1.md` | Visibilidad de lo poco frecuente, agrupación y campañas | Propone |
| `requisitos_qr_atribucion_y_contexto_evento_v1.md` | QR, atribución y el triple contexto de evento | Propone |
| `requisito_reconocimiento_social_participacion_v1.md` | La tarjeta «Yo aporté» | Propone |
| `requisito_valoracion_senales_y_pesos_v1.md` | Valoración de señales y pesos | Propone |
| `vision_del_proyecto_...md` | La visión. Es el origen de `negocio/vision.md` | Propone |
| 5 × `evaluacion_dev_req_*.md`, 2 × `feedback_*` | Evaluaciones del propio proceso de especificación, no del negocio | Meta |
| 3 × `cierre_*` y `revision_acuerdos_*` | Cierres de brechas y confirmaciones por proyecto | Propone |

**No se pudo leer:** nada. Los 24 son markdown legible.

**Lo que la especificación derivada citaba y no había llegado:** los seis primeros de esta
tabla, más las fuentes `N01`–`N20`. Eran **44 referencias colgando**, y por eso ningún módulo
podía pasar la prueba del sobre cerrado. Ya están adentro.

---

## 2 · Cómo dice el negocio que funciona

**Lo que existe hoy** (de la investigación, que es lo único que describe):

1. La Ley 152 de 1994 organiza el procedimiento del plan de desarrollo.
2. El Ejecutivo formula, con coordinación del DNP.
3. El Sistema Nacional de Planeación articula el Consejo Nacional de Planeación y los
   Consejos Territoriales de Planeación.
4. La discusión del proyecto pasa por el CNP, los CTP y las corporaciones públicas, que
   producen recomendaciones, observaciones y cambios.

**Lo que se propone construir**, en las palabras de los documentos:

1. Una convocatoria publica propósito, decisión abierta, entidad que responde, cortes y
   efecto de participar **antes de recibir aportes**.
2. Una persona expresa una necesidad cotidiana por web, en un evento presencial o en un
   encuentro virtual facilitado. No se le exige conocer ministerios, ejes del plan ni códigos
   de proyecto.
3. La persona **confirma que quedó bien expresada**; la síntesis no sustituye su relato.
4. Un revisor aclara ubicación, clasifica y agrupa aportes en **expedientes de necesidad
   situada**, sin fusionar por palabras compartidas.
5. El BI muestra el mapa de lo conocido **y el mapa de lo que todavía no se conoce**, con las
   mismas reglas de conteo en mapa, lista y exportación.
6. Se prioriza **qué examinar**, con motivo y responsable. No se asigna presupuesto.
7. Se remite al nivel competente, se decide, se responde, y la persona consulta su comprobante.

El propio paquete dice qué **no** hace: no asigna presupuesto automáticamente, no es voto
vinculante, no produce estimaciones representativas nacionales, no predice necesidades no
reportadas, y no acredita sincronización sin conexión.

---

## 3 · Quién va a usar esto

Once roles nombrados. **Diez de los once están «sin confirmar»** en el propio paquete, y de
ninguno se sabe todavía con qué pregunta llega a la pantalla — eso es lo que falta y es lo
que hace útil a un revisor.

| Rol | Con qué llega, según los documentos | Qué le duele hoy (deducido, hay que preguntarlo) |
|---|---|---|
| **Ciudadano** | *«Cuéntanos qué necesita mejorar en tu comunidad»*. Sin lenguaje técnico, sin proyecto formulado | Que participar no sirva de nada y nadie le devuelva respuesta |
| **Facilitador** | Registra aportes asistidos en mesa, con procedencia, sin exigir cámara ni propuesta técnica | Que la relatoría no alcance a recoger lo que se habló, y que se pierda el disenso |
| **Revisor** | *«¿Esto que llegó es una necesidad nueva o es la misma de otro aporte?»* | Leer miles de relatos sin herramienta, y que una etiqueta común tape problemas distintos |
| **Analista** | *«¿Dónde duele, con qué frecuencia, y qué no estamos escuchando?»* | Números que no reconcilian entre el mapa, la lista y lo exportado |
| **Comunicaciones** | *«¿Dónde hay que convocar más?»* | Medir clics en vez de escucha. **Y no puede descargar contactos ni relatos privados** |
| **Responsable institucional** | *«¿Qué está pendiente y de quién?»* | Cerrar por silencio, o que le atribuyan una obra que ya existía |
| **Entidad competente** | Atiende y decide según mandato. **Es un organismo, no una cuenta compartida** | Recibir cosas que no son de su competencia |
| **Responsable de proceso** | Configura fases y publica contenidos | Publicar una promesa que nadie puede cumplir |
| **Administración** | Permisos, catálogos, auditoría | **Permiso técnico ≠ autoridad para decidir** |
| **Control social** | Consulta evidencia pública protegida | Que la transparencia exponga a quien participó |
| **Moderación** | Revisa abuso y datos sensibles, **conservando crítica y disenso legítimos** | Que una etiqueta automática censure una crítica válida |

**Candidatos a persona validadora**, para cuando llegue `/validar`: alguien del Chocó o
Caquetá con conexión intermitente y baja alfabetización digital; un facilitador que ha
llevado mesas presenciales; y un revisor que hoy lee peticiones a mano. **No se inventan
aquí**: la vida se la pone el analista.

---

## 4 · El vocabulario que ya existe

| Palabra | Qué significa en estos documentos |
|---|---|
| **Aporte** | Lo que una persona o un grupo expresa. Con identificador, relato original, versión, canal, fecha y convocatoria |
| **Necesidad situada** | Problema localizado, con afectación y cambio esperado. Su **expediente** conserva historia estable y puede reunir varios aportes |
| **Expediente** | El registro de trabajo y seguimiento de una necesidad situada |
| **Punto de dolor** | Qué ocurre y qué dificulta en la vida cotidiana. Atributo de la necesidad, **no un punto exacto en un mapa** |
| **Proceso participativo** | El contenedor. **Define fases y reglas** |
| **Convocatoria** | Una fase del proceso, con propósito, alcance, fechas y canales |
| **Alternativa** | Opción de respuesta comparable, **distinta del problema expresado** |
| **Apoyo** | Respaldo explícito bajo reglas publicadas. **Asistir no crea apoyos** |
| **Corte** | Una foto versionada e inmutable de los datos, con filtros, catálogo y diccionario |
| **Cobertura** | Municipios con al menos un aporte ubicado sobre los del alcance. **No mide representación de habitantes** |

**Palabras que los documentos prohíben usar como sinónimos:** aporte / persona / asistencia /
apoyo / necesidad / decisión. Y en gestión: recepción / respuesta / solución / financiación /
ejecución.

---

## 5 · Las cosas que aparecen

`definicion_producto_participacion_v1.md` §9 las nombra en orden, y **el orden es la
jerarquía**:

```
proceso participativo          ← define fases y reglas
  └── convocatoria             ← una fase. Su cierre limita acciones de esa fase
        └── evento
              └── mesa
                    └── aporte ← lleva canal, fecha y convocatoria
                          ↕
                    expediente de necesidad situada
                          ↕
                    alternativa · decisión · respuesta
```

**El hallazgo que importa para el modelo de datos:** *«el cierre de una convocatoria limita
acciones de esa fase, pero no elimina la consulta de comprobantes y decisiones»*, y *«una
misma necesidad puede continuar en otro ciclo sin fingir que se recibió por primera vez»*.

Si el expediente **sobrevive a la convocatoria**, la convocatoria no puede ser su unidad de
pertenencia. El aporte sí pertenece a una convocatoria; el expediente pertenece al **proceso**.
Eso es lo más cerca que llega el paquete de contestar la `Q9`, y no llega a contestarla: nadie
pregunta en ningún documento si un proceso puede ver los datos de otro.

Aparte, y explícitamente separados: **participantes y contactos**, que *«se mantienen separados
del contenido público»*.

---

## 6 · Reglas explícitas encontradas

El paquete trae **tres familias de códigos** que la especificación derivada citaba sin traer:

| Familia | Dónde | Qué es |
|---|---|---|
| `N01`–`N20` | `especificacion_nucleo_participacion_v2.md` | Veinte necesidades, **cada una con su motivo y su prueba sintética** |
| `DAT-01` · `GEO-01` · `NEC-01` · `TAX-01` · `CAL-01` · `BI-01/02/03` · `PRI-01` · `TRA-01` · `RES-01` · `SEG-01` · `IA-01` | `especificacion_datos_y_bi_v1.md` §5 | Trece requisitos construibles, **cada uno con criterio de aceptación** |
| Ocho indicadores | `especificacion_datos_y_bi_v1.md` §7 | Cada uno con definición **y advertencia obligatoria** |

Las que más pesan sobre cómo se construye:

| Lo que dice | Dónde | ¿Se cumple? |
|---|---|---|
| *«Un reintento técnico no crea otro aporte… similitud textual no basta para borrar aportes»* | `DAT-01` | Sin construir |
| *«No presentar el centro de un municipio como coordenada exacta de una necesidad»* | `GEO-01` | Sin construir |
| *«Los registros sin municipio no desaparecen: se cuentan en el total de aportes y en "sin ubicación municipal resuelta", pero no en el total de municipios con registros ubicados»* | `CAL-01` | Sin construir |
| *«Un total nacional se calcula sobre esos IDs, no sumando subtotales que se solapan»* | §7 | Sin construir |
| *«Si el alcance no está definido, no calcular porcentaje»* | Cobertura territorial | **Aplica hoy: el alcance no está definido** |
| *«Umbrales públicos por definir: hasta entonces no habilitar publicación detallada»* | `SEG-01` | **Aplica hoy** |
| *«Captura, revisión y BI deben funcionar manualmente si la IA falla»* | `IA-01` | Sin construir |
| *«El equipo que construya debe poder relacionar cada N01–N20 con módulo, actor, datos, estado, regla y prueba»* | Definición de resultado aceptable | **[?] No se cumple todavía.** Es la compuerta que el propio paquete se puso |

**Y una prueba de punta a punta de ocho pasos** (`especificacion_datos_y_bi_v1.md` §8) que
define cuándo pasa el piloto — con la advertencia de que *«el piloto pasa cuando estas
operaciones se comprueban en una implementación, no cuando el documento o el tablero tienen
secciones llenas»*.

---

## 7 · Contradicciones

**No se resuelven aquí.** Cuál manda es decisión del negocio.

| Una dice | La otra dice | Dónde |
|---|---|---|
| El BI institucional es **parte del núcleo inicial**: *«no se pospone como un adorno posterior a la captura»* | El grafo de dependencias pone el BI en la ola 3, después de captura y revisión | `especificacion_datos_y_bi_v1.md` §2 contra `entregable/mapa-de-modulos.md` |
| *«La primera entrega conecta convocatoria, captura, confirmación, revisión y respuesta»* | El núcleo mínimo que propusimos aplaza convocatoria a un registro sembrado | núcleo v2 contra `mapa-de-modulos.md` |
| Los encuentros virtuales **entran** en la primera entrega (actualización del 13 de septiembre) | La misma especificación excluye *«deliberación avanzada»* | núcleo v2, encabezado contra alcance |
| *«Un mes no es un plazo nacional confirmado»* | Varios documentos hablan de «piloto» sin decir de qué tamaño | núcleo v2 |

---

## 8 · Lo que los documentos no dicen

Lo que sigue **no aparece en ninguno de los 24**. Se buscó, no se dedujo.

- **Identidad y autenticación.** Cero menciones de inicio de sesión, contraseña, proveedor de
  identidad, Carpeta Ciudadana Digital o federación. Lo único que existe es *«código de
  consulta protegido»*, mencionado una vez y sin definir. **Los nueve roles internos entran
  con algo que nadie escribió.**
- **Si esto se conecta con el Sistema Nacional de Planeación o queda al lado.** El marco legal
  está investigado; la relación del producto con él, no.
- **Quién es la entidad operadora.** Los propios documentos lo listan como decisión abierta, y
  advierten: *«no se rellenan atribuyendo mandato al DNP por inferencia»*.
- **Qué territorios entran al piloto.** Sin eso no hay denominador de cobertura.
- **Si un proceso participativo puede ver los datos de otro.** Nadie lo pregunta, y es la
  condición de aislamiento de todo el esquema.
- **Números:** pesos de puntuación, cuotas presupuestales, umbrales de cobertura, metas de
  adopción, plazos de respuesta, carga y volumen. El paquete dice explícitamente que **no los
  inventa**, y eso es una virtud, no un hueco por descuido.

---

## 9 · Preguntas para la entrevista

Las cuatro primeras son las que más cambian lo que se construye.

1. **¿Esto se conecta con el Sistema Nacional de Planeación —el CNP y los Consejos
   Territoriales— o queda al lado?** Ya existe un mecanismo legal de participación en el plan,
   con la Ley 152 de 1994. Si lo que se construye alimenta a los CTP, ellos son un actor del
   sistema y hoy no están en la lista de once roles. Si queda al lado, hay que poder explicar
   a la ciudadanía en qué se diferencia de lo que ya podía hacer.

2. **¿Un proceso participativo puede ver los datos de otro?** Es la `Q9` dicha en las palabras
   del negocio. Los documentos ponen el «proceso» como contenedor y dejan que un expediente
   siga en otro ciclo, pero nunca dicen si son compartimentos. **De esa respuesta sale una
   columna en todas las tablas.**

3. **¿Cómo entra cada quien?** Para la persona, qué recibe y qué pasa si lo pierde. Para los
   nueve roles internos, con qué credencial. No está en ningún documento.

4. **¿Qué pasa el día que alguien pida que borren lo que contó, y ya está en un expediente en
   gestión?** Se decidió borrado lógico, pero la Ley 1581 de 2012 da derecho a supresión y una
   fila marcada sigue estando ahí.

Y estas cinco, que salieron de leer:

5. **¿El BI va en el núcleo inicial o después?** Los documentos dicen que no es un adorno
   posterior; el orden de construcción que propusimos lo pone en la tercera ola. Una de las dos
   está mal.
6. **¿Qué tamaño tiene el piloto?** Cuántos municipios, cuántos encuentros, cuánta gente.
7. **¿Quién responde cuando el aporte no es de nadie?** El paquete registra «conflicto de
   competencia y responsable de resolverlo», pero no dice quién es.
8. **¿Alguna vez esto salió mal?** En cualquier ejercicio de participación anterior: algo que se
   prometió y no se pudo, información que se perdió, alguien que quedó expuesto. **Las
   invariantes salen de aquí, no de preguntar por invariantes.**
9. **¿Qué le preguntaría usted a alguien que va a construir esto, y que no le preguntamos?**
