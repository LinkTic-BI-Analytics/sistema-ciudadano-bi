# Cuarta prueba de dev-req: participación ciudadana y BI territorial

Fecha: 12 de septiembre de 2026.

Proyecto: **4- Participación Ciudadana Colombia — Captura, Priorización y BI Territorial**.

[Abrir proyecto y especificación](https://idle-asset-trustee-websites.trycloudflare.com/4-participacion-ciudadana-colombia-captura-priorizacion-y-bi/conocimiento).

## Dictamen

La carga y las cuatro incorporaciones terminaron sin los errores de servidor observados en la prueba anterior. El proyecto conserva mejor el contexto, permite declarar que el producto todavía no existe y recoge las respuestas complementarias como contenido revisable. Es un avance verificable.

Todavía no es una especificación lista para construir de principio a fin. La propia salida advierte «Todavía no se puede entregar» y muestra 20 decisiones pendientes. Parte del conocimiento permanece en «Entendido, sin codificar todavía»; hace falta convertirlo en requisitos individuales, criterios verificables y relaciones explícitas. También se observó un defecto de presentación de tablas que dificulta usar el documento final.

Esta evaluación corresponde a interacción con la aplicación y revisión de su salida visible. No es una auditoría de código, una prueba de campo con ciudadanos ni una aprobación institucional del alcance.

## Información cargada

Se cargaron y analizaron completos los cuatro documentos, con la autorización existente de Miguel Gomez para OpenRouter. No se incorporaron los informes de errores de dev-req como si fueran requerimientos del producto ciudadano.

| Fuente | Palabras | Incorporación seleccionada |
|---|---:|---:|
| especificacion_datos_y_bi_v1.md | 2.872 | 43 de 47 propuestas |
| especificacion_nucleo_participacion_v2.md | 1.998 | 35 de 46 propuestas |
| definicion_producto_participacion_v1.md | 3.225 | 19 de 34 propuestas |
| investigacion_planeacion_ciudadana_colombia_v2.md | 13.819 | 11 de 40 propuestas |

Total documental: 21.914 palabras. Las selecciones no equivalen a un conteo de requerimientos únicos: incluyen actores, módulos, reglas, preguntas y otros tipos de contenido.

Se revisaron las propuestas antes de incorporarlas. Se evitaron módulos y actores duplicados, sustituciones del alcance de BI por formulaciones anteriores y algunas interpretaciones incorrectas. En particular, se corrigió la conversión de exclusiones de la primera entrega en prohibiciones permanentes, la reducción de todo aporte a una participación individual y la prohibición universal de cualquier ranking. La sincronización offline y la votación no se declararon entregadas ni obligatorias para la primera versión.

## Recorrido realizado

Se recorrieron los diez módulos: Captura, Revisión, BI Institucional, Gestión, Eventos y facilitación, Convocatoria y divulgación, Discusión, Priorización, Contexto documental y Administración.

Se complementaron propósito, comportamiento esperado, fallos e invariantes. Se utilizó «Esto todavía no existe» donde las preguntas presuponían una operación o un último día de uso. Los ejemplos se registraron como casos sintéticos y propuestas de alcance, sin inventar evidencia de uso real. Se añadieron requisitos y reglas mediante las preguntas de diagnóstico cuando el contenido narrativo no los generaba.

En BI se reforzaron mapa, indicadores y listado con filtros coherentes, conteo por identificadores distintos, ubicación no resuelta, calidad del dato y trazabilidad al expediente. Se añadió el caso sintético de 10 aportes: 8 con ubicación resuelta y 2 pendientes, que deben permanecer en el total, con cobertura de ubicación de 80 %. También se indicó que una necesidad asociada a dos municipios no debe contarse dos veces en el total nacional.

La interfaz final muestra diez módulos y once actores. Advierte cinco módulos sin actor asociado y ninguna integración anotada. Tener actores globales o mencionar una dependencia en una explicación no asegura que exista la relación estructurada correspondiente.

## Correcciones que sí se pudieron comprobar

1. Las cuatro incorporaciones seleccionadas finalizaron sin error visible de servidor.
2. Se conservó la organización en diez módulos sin aceptar todas las duplicaciones sugeridas por documentos posteriores.
3. La entrevista ofrece una salida apropiada para un producto nuevo: «Esto todavía no existe».
4. Las respuestas principales quedan disponibles como contenido revisable y aparecen en la salida bajo «Entendido, sin codificar todavía».
5. La aplicación señala decisiones pendientes antes de presentar la especificación como entregable definitivo.

## Hallazgos pendientes y criterios para corregirlos

### 1. El conocimiento no se transforma suficientemente en requisitos ejecutables

La salida global contiene RF1 a RF11, pero la incorporación documental y la entrevista no trasladan de forma completa la desagregación de las fuentes. Fue necesario añadir requisitos mediante preguntas de diagnóstico. Varios requisitos resultantes reúnen más de una capacidad y conservan identificadores y prioridades dentro del texto.

**Corrección esperada:** extraer requisitos individuales con identificador de origen, módulo, actor, prioridad propuesta, entrada, comportamiento, salida, reglas y criterios de aceptación. Mantener la revisión humana antes de confirmarlos. Si varios identificadores de origen se condensan en una ficha, hacer explícita la cobertura y lo que falta.

**Aceptación:** DAT-01, GEO-01, NEC-01, TAX-01, CAL-01, BI-01, BI-02, BI-03, PRI-01, TRA-01, RES-01, SEG-01 e IA-01 deben poder rastrearse por separado desde la fuente hasta la especificación. No basta con que aparezcan citados dentro de una explicación larga. IA-01 debe conservar su condición propuesta de ampliación P1, sin convertirla en requisito indispensable para capturar.

### 2. Las barras verticales desordenan las tablas de requisitos

Al introducir texto como «BI-01 | P0 | Propuesta: ...», la tabla visible separó el contenido en celdas adicionales y mostró barras invertidas. Ocurrió también en requisitos de otros módulos. Se observó en la presentación; no se atribuye aquí la causa a un componente específico ni se verificó el archivo descargado.

**Corrección esperada:** preservar caracteres del contenido sin convertirlos en delimitadores de la tabla.

**Aceptación:** un requisito con barras verticales, saltos de línea y signos de puntuación mantiene el mismo número de columnas y el texto completo en vista leída, copia y descarga. Verificar los tres canales por separado.

### 3. La vista de análisis puede mostrar el resultado anterior

Durante el recorrido, después de finalizar una lectura, quedó visible el recibo o resultado del análisis anterior. Navegar de nuevo a Documentos o recargar permitió acceder al análisis nuevo sin volver a solicitarlo.

**Corrección esperada:** identificar siempre documento y análisis mostrados, actualizar la vista al finalizar y evitar que un resultado antiguo parezca corresponder al documento recién procesado.

**Aceptación:** analizar dos documentos consecutivos; al terminar cada uno, la previsualización y sus cantidades corresponden a esa fuente, sin recarga manual ni repetición del análisis.

### 4. Faltan relaciones y una lectura global coherente del avance

La salida conserva dependencias como texto sin convertirlas siempre en relaciones. La navegación muestra cinco módulos sin actor. El cierre de preguntas de una entrevista puede coexistir con decisiones globales pendientes y secciones sin llenar. Los indicadores de cobertura no equivalen a porcentaje de preparación para construcción.

**Corrección esperada:** distinguir captura de contexto, estructuración, validación y aprobación. Mostrar preguntas locales y decisiones globales como estados diferentes. Permitir vincular actores, requisitos, reglas, dependencias y aceptación desde el conocimiento ya capturado.

**Aceptación:** cada módulo activo de la primera entrega tiene actor asociado, entradas y salidas, dependencias verificables y criterio de aceptación. Cada vacío indica qué falta y qué parte bloquea. Una capacidad posterior no debe inflar artificialmente las obligaciones del piloto.

### 5. Quedan decisiones reales que no deben inventarse para subir la cobertura

La aplicación indica 20 decisiones pendientes; ejemplos visibles: responsable de necesidades que atraviesan departamentos, efectos de desagrupar un expediente sobre prioridad y respuestas, tratamiento de retiros por seguridad y cambios del catálogo territorial. La salida global informa diez secciones sin llenar; BI informa una y los otros nueve módulos dos cada uno. Estas cantidades son indicadores de la aplicación, no una medición independiente de calidad.

**Corrección esperada:** registrar alternativas, recomendación, responsable de decisión, impacto y estado. Separar decisiones institucionales de decisiones de diseño que el equipo puede proponer. La herramienta debe permitir preparar un alcance construible condicionado, sin presentar las propuestas como acuerdos oficiales.

**Aceptación:** ningún requisito bloqueado se presenta como confirmado; cada pendiente tiene consecuencia explícita para la primera entrega y un camino de resolución.

## Prueba de fidelidad al producto que queremos construir

La siguiente evaluación debe comprobar resultados, además de verificar que hay documentos y módulos:

| Situación sintética | Resultado que debe exigir la especificación |
|---|---|
| Un territorio no envía aportes | Mostrar ausencia de información o cobertura, sin concluir ausencia de necesidades. |
| Una comunidad pequeña reporta una afectación grave | Mantener su expediente visible y permitir examen motivado; no enterrarlo por volumen de participaciones urbanas. |
| Dos municipios comparten una necesidad | Una necesidad única a escala nacional, con relaciones territoriales trazables. |
| Un aporte no tiene ubicación precisa | Conservarlo, señalar lo desconocido y evitar asignar coordenadas inventadas. |
| Un evento registra asistentes y aportes | Contar ambas magnitudes por separado; no convertir asistentes en apoyos. |
| Se revisa una agrupación sugerida por IA | Conservar originales, responsable y cambios; permitir corregir o desagrupar. |
| Cambian filtros en BI | Mapa, indicadores y listado representan el mismo universo permitido y corte de datos. |
| Se muestra información de una población muy pequeña | Aplicar protección contra identificación sin borrar su necesidad de la revisión institucional. |
| Se responde a una propuesta | Vincular respuesta y decisión al aporte, sin prometer ejecución ni presupuesto no aprobado. |

Los casos anteriores son criterios propuestos, no pruebas ya ejecutadas sobre una plataforma ciudadana construida.

## Conclusión para continuar

El proyecto 4 quedó creado, cargado y complementado módulo por módulo. dev-req ayuda más a conservar y discutir el contexto que en la prueba anterior. La siguiente corrección debe centrarse en convertir ese contexto en unidades verificables y conectadas, preservar las tablas y explicar los bloqueos. Para construir, las cuatro fuentes siguen siendo necesarias junto al borrador generado; todavía no conviene tratar ese borrador como contrato completo de alcance.
