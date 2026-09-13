# Participación Colombia · Sistema 0.5

Base de tokens compartida para las dos caras: experiencia ciudadana 0.4 y nuevo perfil interno. Las propuestas navegables se muestran en la conversación.

## Archivos principales

- `participacion.tokens.json`: 319 tokens; incluye los 252 de ciudadanía sin cambiar sus valores y añade 67 para trabajo interno.
- `generar_tokens.py`: resuelve aliases y genera CSS, tema shadcn y contraste.
- `participacion.css`: variables compartidas generadas.
- `backoffice.css`: estilos del perfil interno, bajo `.pc-backoffice`.
- `backoffice-especificacion.md`: arquitectura, componentes, transiciones y límites de la muestra interna.
- `aportes-ejemplo.json`: ocho aportes ficticios; no contiene contactos reales.
- `eventos-ejemplo.json`: cinco convocatorias ficticias compartidas como referencia.
- `validacion-backoffice.md`: pruebas y observaciones del perfil interno.
- `contraste.md`: 41 pares de colores comprobados.

Para ciudadanía se conservan `componentes.css`, `marco.css`, `estructura.css`, `direccion-visual.md`, `estructura-producto.md` y `validacion-ciudadania-v04.md`. `referencia-institucional.md` conserva la investigación previa y sus límites. `shadcn-theme.css` conecta el tema con la base de color.

## Integración

Generar variables desde esta carpeta:

```sh
python3 generar_tokens.py
```

**Ciudadanía:** cargar `participacion.css`, `componentes.css`, `marco.css` y `estructura.css`; usar `.pc-ui`.

**Equipo interno:** cargar `participacion.css` y `backoffice.css`; usar `.pc-backoffice`.

```html
<div class="pc-backoffice">
  <button type="button" class="bo-button" data-variant="primary">Guardar actuación</button>
  <button type="button" class="bo-button" data-variant="secondary">Volver</button>
</div>
```

No se sobrescriben los tamaños públicos para volverlos compactos. Los componentes internos tienen aliases propios que apuntan a las mismas decisiones semánticas cuando corresponde. Esto permite evolucionar densidad y composición sin bifurcar la identidad.

El puente shadcn es una referencia de tema; adaptar las variantes del proyecto a cada perfil. El paquete no instala React, shadcn ni Lucide. Proveer Geist para la interfaz y Newsreader para los titulares ciudadanos; hay sustituciones en los tokens.

## Alcance

La demostración utiliza datos ficticios y estado en memoria. No tiene autenticación, backend, IA, publicación ni envío de comunicaciones. Los cambios desaparecen al recargar. El paquete contiene estilos, tokens y especificaciones; no es una aplicación desplegada.

La marca, funciones institucionales y permisos finales requieren concreción con el cliente. Esta versión diseña sus referencias visuales y de interacción.
