# 5- Participación Ciudadana Colombia — Captura, Priorización y BI Territorial

Corte del 2026-09-13

## Qué es esto

El levantamiento de requerimientos de este sistema, tal como estaba el día del corte. Es el punto de partida para diseñar y construir: no es un contrato, no es una aprobación de nadie, y ninguna de sus pruebas se ha ejecutado contra un sistema real.

## Qué hay dentro

| Archivo | Qué trae |
|---|---|
| `especificacion.md` | El sistema entero: objetivo, requerimientos, reglas y límites. |
| `actores.md` | Quién usa esto, qué hace cada rol y **qué no puede hacer**. |
| `integraciones.md` | Con qué habla, con qué nivel de certeza y qué falta preguntar. |
| `acuerdos.md` | Lo que vale igual en todos los módulos. |
| `vacios.md` | Lo decidido, lo que falta decidir y los datos que hay que ir a buscar. |
| `modulos/` | Un documento por módulo, con sus reglas, límites y casos. |

## En qué estado está

|  |  |
|---|---|
| **Módulos** | 10 |
| **Requerimientos, reglas y límites** | 27 |
| **Quiénes lo usan** | 11 |
| **Integraciones** | 0 |
| **Decisiones sin tomar** | 12 |
| **Afirmaciones sin confirmar** | 0 |
| **¿Se puede entregar?** | no — 12 decisiones pendientes. Con datos faltantes se puede entregar; con decisiones que nadie ha tomado, no. |

## Qué NO demuestra este paquete

- **Que alguien lo haya acordado.** Lo marcado «propuesta nuestra, sin acordar» lo escribimos nosotros; hace falta que lo acuerde quien pueda acordarlo.
- **Que las pruebas pasen.** Los casos son escenarios escritos antes de construir, no resultados de ejecución.
- **Que esté completo.** Lo que falta está escrito como lo que falta: las marcas `➤` y las secciones de vacíos son la lista, no un descuido.
- **Que una integración funcione.** El nivel de cada una dice cuánto se sabe de ella, y nivel 1 significa que solo se sabe el nombre.