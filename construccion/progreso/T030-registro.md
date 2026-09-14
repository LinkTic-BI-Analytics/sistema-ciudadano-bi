# Registro — T030 · Los cinco eventos de gestión

**Contrato:** `construccion/tareas/T030-los-cinco-eventos.md`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-13 | Prueba escrita antes, **vista fallar** | `ERR_MODULE_NOT_FOUND: …/actuacion.ts` |
| 2026-09-13 | Implementado. Falló 6 de 7: `permission denied for table actuacion` | ver abajo |
| 2026-09-13 | Corregido el orden del esquema. 7 de 7, y 50 en todo el producto | `npm test` |

## El defecto que apareció, y por qué el arreglo no fue renombrar

Al correr las pruebas: **`permission denied for table actuacion`**. La causa no se parecía al
síntoma — los permisos vivían en `09_acceso.sql` y la tabla nace en `11_gestion.sql`. Un
`grant on all tables` solo alcanza a las tablas que existen cuando corre.

Renombrarlo a `99_acceso.sql` lo arregla hoy. **Lo que no arregla es la próxima vez**, porque
el archivo enumeraba las tablas a mano y enumerar es exactamente cómo se olvida una. Dos
cambios más:

- El archivo **recorre** las tablas de los dos esquemas en vez de listarlas.
- Un chequeo nuevo, `scripts/lib/acceso_cerrado.py`, que falla si alguna nace sin el acceso a
  nivel de fila encendido. **Visto fallar** apagándoselo a `aporte`.

Lo peligroso no era el error que vimos: una tabla que nace **sin** el interruptor no da ningún
error, y todo funciona — hasta que alguien la lee desde el navegador.

## Decisiones del orquestador

| Qué chocaba | Qué se decidió | Contra qué autoridad |
|---|---|---|
| ¿Guardar el estado de atención en una columna del expediente? | **No. Se deriva de las actuaciones** | Un campo almacenado se desincroniza de sus hechos, y entonces el tablero afirma algo que la historia contradice. `RES-01` pide cinco eventos distintos, no un estado |
| ¿Un estado «vencido» cuando pasa mucho tiempo? | **No existe** | `Q20` está abierta: no hay plazo acordado. El paquete es explícito — *«no inventar incumplimiento de plazo si no existe plazo definido»*. Se muestra la antigüedad; el juicio no |
| ¿Un estado «resuelto»? | **Tampoco** | `RES-01`: *no confundir respuesta con resolución*. Este módulo no sabe si el problema se solucionó, y el estado más avanzado que conoce es «respondido» |

## Hallazgos aparcados

Ninguno.
