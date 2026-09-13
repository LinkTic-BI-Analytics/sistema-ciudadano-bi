// Lo que este proyecto declara sobre sí mismo.
//
// La FORMA de este archivo es del harness y no se cambia: es lo que hace que
// todos los proyectos que usen el harness se vean igual en la vista de módulos,
// y que alguien que llega de otro proyecto sepa leerla sin que se la expliquen.
//
// El CONTENIDO es de este negocio y se actualiza **al cerrar cada paso**, no al
// cerrar el frente. Un módulo construido que no aparece aquí deja el mapa
// mintiendo.
//
// **Sin códigos.** Quien mira esta pantalla no sabe qué es R3 ni Q7. Lo que
// falta se dice en las palabras del negocio; el código vive en la bitácora.

export type Estado = "construido" | "a medias" | "pendiente";

export const proyecto = {
  nombre: "<el negocio>",
  frase: "<de qué se trata, en una línea y en las palabras del negocio>",
  // Se dice siempre y no se suaviza: quien mira esto tiene que saber qué está mirando.
  advertencia:
    "Esto es un instrumento para descubrir, no el producto. Se construyó para tirarse: " +
    "lo que queda al final es el documento con el que un equipo lo construye bien.",
};

// Quién usa esto. Va antes que los módulos a propósito: **la prioridad es el
// usuario**, y un módulo que no sabe decir quién lo usa es un módulo que se
// especificó desde la función y no desde la persona.
//
// `deducido` marca al que no aparece en ningún documento del negocio. Un
// usuario deducido es una hipótesis, no un usuario, y se dice cuál lo es.
export type Rol = {
  clave: string;
  nombre: string;
  quienEs: string;
  deducido?: boolean;
};

export const roles: Rol[] = [
  // Salen de la §3 de la lectura documental y de la entrevista. Un rol que no
  // aparece en ningún documento va con `deducido: true`, y se dice cuál lo es:
  // un usuario deducido es una hipótesis, no un usuario.
];

export type Frontera = {
  clave: string;
  nombre: string;
  gobernable: boolean;
  mock: 1 | 2 | 3;
};

export const fronteras: Frontera[] = [
  // Salen de la etapa 0a, con `plantillas/fronteras.md`. Cada una responde tres
  // preguntas antes de construir nada, y su nivel de mock se muestra en la
  // pantalla: alguien valida distinto un dato inventado que uno contractual.
];

export type Modulo = {
  nombre: string;
  queHace: string;
  estado: Estado;
  // Lo concreto que alguien puede hacer hoy, en las palabras del negocio.
  // Es la respuesta explícita a "¿qué llevo?".
  yaSePuede?: string[];
  // Lo que no está y por qué. `dato` distingue lo que espera una decisión de
  // alguien —y por lo tanto tiene dueño— de lo que simplemente no le tocaba.
  noEntra?: { que: string; porque: string; dato?: boolean }[];
  // Los casos de verificación que el frente declaró cerrar. Se cuentan de las
  // casillas de la bitácora, que es donde se marcan.
  comprobado?: { cerrados: number; total: number };
  // Quién lo miró sin haberlo construido. Vacío significa nadie, y eso se dice.
  mirado?: string;
  // Quién lo usa y para qué. Es lo primero que alguien pregunta de un módulo
  // que no construyó, y lo que dice si vale la pena mirarlo.
  usan?: { rol: string; para: string }[];
  // Cuánto dicen los documentos sobre esto, y dónde. Sale de `densidad.sh`:
  // se cuenta, no se estima.
  escrito?: { palabras: number; donde: string };
  // Qué fronteras toca. De aquí sale la mitad de "¿alcanza para la pantalla?":
  // se puede dibujar una pantalla sin contrato, no se puede conectar.
  fronteras?: string[];
  pantallas: { nombre: string; href: string }[];
  espera?: string;
};

export type Proyecto = typeof proyecto;

export const modulos: Modulo[] = [
  // Los candidatos salen de la etapa 0a: `negocio/que-podemos-construir.md`, y
  // se actualizan **al cerrar cada paso**, no al cerrar el frente. Un módulo
  // construido que no aparece aquí deja el mapa mintiendo.
];
