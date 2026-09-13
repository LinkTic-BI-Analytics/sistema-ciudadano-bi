# DIVIPOLA — el catálogo territorial

**Versión: junio 2026**, actualizada al 30 de junio de 2026. Es la que dice el título de las
tres hojas, y está en el archivo `VERSION`.

Decidido el 2026-09-13 (`negocio/vacios.md` V10). Se regenera con `./scripts/divipola.sh`.

## De dónde salió, y por qué de ahí

**Del geoportal del DANE**, `geoportal.dane.gov.co/descargas/divipola/`. No de datos.gov.co:
allí la copia de los municipios está atribuida a **una gobernación departamental** y tiene
corte a **diciembre de 2024**. El DANE publica junio de 2026 — dieciocho meses más nueva y de
quien la produce. Para un catálogo del que dependen todos los agregados territoriales, la
procedencia no es un detalle.

Los `.xlsx` se conservan **tal como se bajaron**. Los `.csv` se generan al lado; ninguno de los
cinco se edita a mano.

## Qué trae

| Archivo | Filas | Código |
|---|---:|---|
| `departamentos.csv` | 33 | 2 dígitos — los 32 departamentos más Bogotá D.C., que se codifica como uno para fines estadísticos |
| `municipios.csv` | 1.122 | 5 dígitos = departamento + 3 |
| `centrospoblados.csv` | 8.560 | 8 dígitos = municipio + 3 |

Los 1.122 se reparten en **1.103 municipios, 1 isla** (San Andrés) **y 18 áreas no
municipalizadas**. Los centros poblados, en **1.104 cabeceras municipales** (`CM`) y **7.456
centros poblados** (`CP`).

Comprobado contra sí mismo: cero referencias rotas, cero duplicados, cero códigos mal
formados, y todo municipio tiene al menos un centro poblado.

## Lo que hay que saber antes de usarlo para agrupar

### 1 · No llega al barrio, y el hueco es urbano

Esto es `Q4`, y ahora tiene números:

| | centros poblados |
|---|---:|
| Barranquilla | **1** |
| Bogotá D.C. | 11 — y son corregimientos rurales: Nazareth, Pasquilla, San Juan |
| Medellín | 28 — el casco urbano es **uno**; el resto son Palmitas, Santa Elena, Altavista |
| Cali | 53 |

**El nivel sub-municipal de DIVIPOLA es rural**: corregimientos, caseríos, inspecciones de
policía. **El área urbana de una ciudad es un solo punto.** Una necesidad en un barrio de
Barranquilla y otra en el barrio de al lado son **indistinguibles** en este catálogo.

Y eso es exactamente lo que la visión dice que no puede pasar: *«esto también puede ocurrir
dentro de una ciudad o de una misma comunidad»*.

Mientras `Q4` no se decida, manda `I2`: **la ubicación sub-municipal queda «por aclarar» y no
se infiere.** Poner el centro del municipio como si fuera el lugar del problema es justo lo
que `GEO-01` prohíbe.

### 2 · Cambia, y un código viejo puede significar otra cosa

En 1997 los centros poblados pasaron de 2 dígitos a 3. Los deslindes siguen: las notas al pie
de las hojas de junio de 2026 mencionan una propuesta del IGAC entre Norte de Santander y
Boyacá, y una verificación de normatividad en Sotará Paispamba.

Por eso **la versión va guardada en cada registro**, no en una tabla aparte (`AGENTS.md` §9,
`Q5`). Es lo que hace cumplible `R2`: *un corte exportado no se reescribe*.

### 3 · Una coordenada no es el lugar del problema

Las tres hojas traen latitud y longitud. **Son del municipio o del centro poblado, no de la
necesidad.** `GEO-01`: *«no presentar el centro de un municipio como coordenada exacta de una
necesidad»*.
