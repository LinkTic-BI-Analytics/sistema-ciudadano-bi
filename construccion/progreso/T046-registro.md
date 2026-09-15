# Registro — T046 · La portada, con convocatoria y agenda

**Autoridad:** `M06` convocatoria y divulgación · `RF10` · caso `AGE-01`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-14 | 6 pruebas de las reglas del módulo | `pruebas/agenda.test.ts` |
| 2026-09-14 | 6 recorridos de la portada, en los dos anchos | `pruebas/e2e/portada.spec.ts` |
| 2026-09-14 | Dos tablas nuevas, con sus restricciones | `supabase/schemas/14_convocatoria.sql` |

## Lo que pedía el requerimiento, textual

> *«Sección pública permanente Participa → Convocatorias y agenda, accesible sin cuenta, con
> **próximos encuentros en portada**»*

Y el caso `AGE-01`: *«un ciudadano encuentra un encuentro virtual sobre agua desde portada y
aporta sin inscribirse»*. Por eso contar **no depende de ningún encuentro** y el botón principal
lleva directo a `/participar`: el módulo dice que una convocatoria «puede recibir aportes por
internet sin reunión».

Hasta hoy la portada era el andamio de prueba —*«el proyecto base levanta»*—.

## Lo que el modelo hace imposible

**Una convocatoria cerrada no dice que recibe.** Es la frase literal del requerimiento —*«no
promete recepción en convocatoria cerrada»*— y es la que más daño hace al romperse: alguien
cuenta su problema a un buzón que nadie va a abrir. `recibe_aportes` no es «está publicada»: una
publicada cuya ventana ya cerró **no recibe**, y entonces la portada quita el botón y lo dice.

**Cancelar no borra.** *«Cancelación mantiene ficha informativa y retira acceso a asistir»*: el
encuentro cancelado sigue en la lista, con su motivo, y con el recordatorio de que igual se puede
contar por internet. Quitarlo de la agenda es la forma más rápida de que alguien se presente en
la puerta de un salón cerrado.

**Reprogramar conserva la ficha y muestra el cambio.** El mismo identificador —el módulo pide que
se conserven la URL, los aportes y la inscripción— y la fecha anterior guardada, porque sin ella
el cambio es invisible para quien ya se había organizado.

**La base rechaza lo demás**: cancelar o reprogramar sin motivo, un presencial sin lugar, un
virtual sin sala, un borrador con fecha de publicación. Todas se ven fallar en las pruebas.

## Lo que la portada dice y no promete

Tres frases que el módulo obliga, puestas donde se confundirían: la participación es voluntaria y
**el número de aportes no representa a la población**; que quede registrado **no es un compromiso
de obra**; y **esto no es un canal de emergencias**. Más una cuarta que separa dos cosas que la
gente mezcla: **se puede aportar sin asistir y asistir sin aportar** — entrar a un encuentro no
registra ninguna necesidad.

La hora sale siempre con su zona horaria. «A las 9» no dice nada sin decir dónde son las 9, y
quien se conecta desde otro huso llega tarde.

## Sobre el sistema de diseño

No inventé nada: la portada ya estaba diseñada. `.pc-hero`, `.pc-steps`, `.pc-event-row` con su
`data-status=cancelled`, `.pc-main[data-layout=home]`. Lo único que intenté inventar —`.pc-link`—
lo atrapó `clases_inventadas.py` en el primer intento; la buena era `.pc-text-action`.

## Una dependencia escondida que se hizo explícita

Los recorridos de la portada necesitan convocatoria y encuentros, y dependían de que alguien
hubiera corrido el sembrado a mano: **habrían pasado en esta máquina y fallado en cualquier
otra**, que es la peor forma de fallar. Ahora la siembra corre con la limpieza, y es idempotente.

## Lo que queda abierto

**No hay vista interna para publicar.** El módulo la pide —bandeja, editor, previsualización e
historial, con permiso asignado— y hoy la convocatoria se siembra por guion. Es lo siguiente de
`M06`, y va después de `T032`, porque publicar exige actor autorizado y eso sigue bloqueado por
`P4`.

**No hay ficha de convocatoria ni de encuentro, ni agenda filtrable.** La portada muestra los
próximos; el listado completo y los filtros por fecha, tema, territorio y modalidad son el resto
de la primera entrega del módulo.

**Nada de QR, campañas ni tarjeta «Yo aporté»** (`QR-01/05`, `CAM-01/02`, `REC-01`). Están en el
módulo y no se tocaron.
