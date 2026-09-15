# Qué es esta carpeta y qué autoridad tiene

Requisitos **escritos en este repositorio**, a partir de decisiones de Miguel Gómez tomadas
durante la construcción. No llegaron de fuera.

Se distinguen de las otras dos carpetas de negocio:

| Carpeta | Qué es | Quién la escribió |
|---|---|---|
| `fuentes-2026-09-11/` | Documentos recibidos. **No se editan** | el equipo, antes de este repositorio |
| `especificacion-v0-2026-09-13/` | La especificación congelada ese día | el equipo, por encargo |
| `requisitos/` | Ampliaciones decididas mientras se construía | **aquí**, con la decisión citada |

Cada documento dice **de qué decisión salió y de qué fecha**, porque un requisito sin origen es
indistinguible de una idea que tuvo quien lo estaba codificando.

Su lugar en la cadena de autoridad (`decisiones/0011`) es el mismo que el de la especificación:
por debajo de una decisión explícita de negocio y por encima del plan y del código. Un requisito
de aquí **no puede contradecir** la especificación congelada; si hiciera falta, eso sería una
decisión aparte y se escribe como tal.
