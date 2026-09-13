# El ejemplo

Un negocio completo y terminado, para comparar contra el tuyo.

**Es de solo lectura y no es tu negocio.** Nunca lo cites desde `negocio/`: cuando lo
borres, ese enlace muere. `/descubrir` te ofrece borrarlo la primera vez.

## Qué negocio es

Las reservas de los espacios comunes de un conjunto residencial de 240 apartamentos —salón
social, cancha, dos zonas de BBQ y el parqueadero de visitantes—. Lo opera la
administradora desde la portería; lo usan los residentes desde el celular.

## Por qué este y no otro

Lo entiende cualquiera en diez segundos y no habla de plata. Pero sobre todo tiene las tres
clases de invariante que hay que aprender a escribir:

**La suprema, que no se puede reparar.** Un espacio nunca queda reservado dos veces para el
mismo instante. Cuando falla, dos familias llegan el mismo sábado con el grado del hijo y
una se tiene que ir. No hay compensación posible — y por eso decide el orden de
construcción.

**La que nadie escribe si no se la preguntan.** Cancelar una reserva y asignarle el cupo al
primero de la lista de espera son **un solo acto**. Separados, el cupo queda libre unos
segundos y se lo lleva alguien que no estaba esperando; quien esperó tres semanas ve que se
lo quitaron. Ningún analista escribe esto en una entrevista.

**La que revela un dato oculto.** El cupo mensual es del **apartamento**, no de la persona.
De ahí sale que la unidad de pertenencia se construya antes que la primera reserva: si el
MVP arranca amarrando reservas a personas, dos residentes del 502 sacan cada uno su cupo y
agregarlo después es exactamente como se produce el problema que la invariante
debía impedir.

## Qué mirar en cada archivo

| Archivo | Míralo por |
|---|---|
| [lectura-documental.md](lectura-documental.md) | **Cómo un reglamento dice una cosa y la práctica hace otra** — y cómo eso se convierte en quince preguntas. Mira la §0 —orienta sin decidir, y su hito 3 se cayó en la entrevista— y la §3, donde el usuario que no se escribió como persona costó tres frentes |
| [dominio.md](dominio.md) | Las tres palabras prohibidas, y la columna "ciclo de vida" de las entidades |
| [especificacion.md](especificacion.md) | Cómo se escribe una regla con su porqué, y la §9 con casos calculados a mano |
| [vacios.md](vacios.md) | **Treinta y cuatro decisiones que ninguna entrevista habría destapado**, cada una con la forma de pregunta que la produjo |
| [bitacora.md](bitacora.md) | Dos frentes cerrados, con «lo que estaba roto y salió al usarlo» |
| [modulo-reservas.md](modulo-reservas.md) | **El entregable.** Es el archivo que vas a querer copiar |
| [agentes/](agentes/) | Dos personas con preguntas distintas sobre la misma pantalla |
