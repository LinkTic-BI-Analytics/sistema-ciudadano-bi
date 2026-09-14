# T025 — La síntesis, que la persona corrige y confirma

**Objetivo:** que quien cuenta algo pueda ver **lo que entendimos** y corregirlo antes de que
nadie lo revise.
**Autoridad:** `RF2` · `N03` · `V14` de `negocio/vacios.md`
**Propietario:** orquestador · **Depende de:** T024 · **Bloqueada por:** ninguna

## Contexto suficiente

Es la mitad de la promesa: *«podrás revisar lo que entendimos»*. Y `V14` es tajante sobre
quién manda — **la persona tiene la última palabra sobre la síntesis atribuida a ella**. El
facilitador puede pedir aclaración; no imponer una interpretación.

`N03` le da forma: *«mostrar relato y síntesis corregible; separar problema, resultado esperado
y solución sugerida»*.

**Y aquí no hay IA.** `IA-01` la deja como ampliación y exige que todo funcione sin ella. El
camino manual no es un apaño: es **preguntarle a la persona**, después de que contó libremente,
por esas tres partes. Eso respeta lo que la visión pide — *«una solución sugerida es bienvenida,
pero no debería ser requisito para que un problema sea escuchado»*.

**Las dos clases de corrección se distinguen** (`V14`): *«esto fue mal interpretado»* y *«ahora
quiero cambiar mi posición»* son las dos válidas y tienen efectos distintos sobre el registro
histórico. Cuáles exactamente sigue abierto (`Q15`) — aquí se **guarda la distinción**, no se
usa todavía.

## Dentro del alcance

- Tres campos opcionales después del relato: problema, resultado esperado, solución sugerida.
- Guardarlos como una síntesis versionada, con su clase.
- Que la persona la confirme, y que eso mueva `estado_confirmacion` y nada más.
- Corregir una síntesis ya confirmada crea una **versión nueva**, nunca sobreescribe.

## Fuera del alcance

- Cualquier propuesta automática. `IA-01` es ampliación y **proponer sin poder corregir es
  decidir**.
- Transcripción de voz.
- La corrección desde el backoffice, que es otro actor con otra regla (`V14`).

## Superficie asignada

- Crear: `producto/src/captura/sintesis.ts`
- Crear: `producto/src/app/participar/sintesis.tsx`
- Modificar: `producto/src/app/participar/formulario.tsx`
- Modificar: `producto/src/app/participar/acciones.ts`
- Crear: `producto/pruebas/sintesis.test.ts`
- Modificar: `producto/pruebas/e2e/participar.spec.ts`
- No modificar: `producto/src/comprobante/`, `producto/src/revision/`

## Interfaces

**Produce:**
- `proponerSintesis({ aporteId, problema, resultadoEsperado, solucionSugerida, autor })`
- `confirmarSintesis({ aporteId, autor })`
- `corregirSintesis({ aporteId, texto, clase, autor, motivo? })` con
  `clase: "mal_interpretado" | "cambio_de_posicion"`

## Invariantes aplicables

- `N03`: la síntesis **nunca sustituye el original**. El relato queda intacto, siempre.
- `V14`: confirmar la síntesis **no** confirma los hechos. Mueve `estado_confirmacion` y no
  toca `estado_revision`.

## Casos de verificación

- [ ] Guardar una síntesis crea la versión 1, sin confirmar
- [ ] El relato original **no cambia** al guardar una síntesis
- [ ] Confirmarla mueve `estado_confirmacion` y **no** mueve `estado_revision`
- [ ] Corregir una confirmada crea la versión 2 y **conserva la 1**
- [ ] Las dos clases de corrección se guardan distinguidas
- [ ] Una clase inventada se rechaza
- [ ] En la pantalla: los tres campos son opcionales y se puede enviar sin ninguno

## Terminado cuando

- [ ] Los siete casos pasan, vistos fallar antes.
- [ ] `validar.sh` devuelve 0.
