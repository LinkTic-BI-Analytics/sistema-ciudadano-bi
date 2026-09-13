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
  nombre: "Depósitos Judiciales",
  frase: "La plata que se consigna por orden de un juez: quién la ordena, quién la firma y a quién le llega",
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
  // Salen de la §3 de la lectura documental y de la taxonomía del Acuerdo
  // PCSJA21-11731. Cuatro de los siete están deducidos, y se dice cuáles: un
  // usuario que no aparece en ningún documento es una hipótesis, no un usuario.
  {
    clave: "ingresa",
    nombre: "Quien ingresa",
    quienEs:
      "El secretario del despacho, casi siempre. Prepara la orden pero no la firma: " +
      "la norma exige que firmen dos.",
  },
  {
    clave: "autoriza",
    nombre: "Quien autoriza",
    quienEs:
      "El juez, o quien tenga la firma de la cuenta judicial. Autoriza con una clave " +
      "distinta de la de entrar.",
  },
  {
    clave: "concilia",
    nombre: "Quien concilia",
    quienEs:
      "Cuadra lo del juzgado contra lo del banco. Hoy lo hace a mano: el servicio entre " +
      "los dos sistemas no existe.",
  },
  {
    clave: "adminbanco",
    nombre: "Administración del banco",
    quienEs:
      "Crea usuarios, roles y dependencias, y autoriza los cambios. Treinta y nueve " +
      "pantallas pasan por aquí.",
  },
  {
    clave: "coactivo",
    nombre: "Ente coactivo",
    quienEs:
      "Cobra por vía coactiva. Aparece nombrado en la portada del documento y no se " +
      "describe en ninguna parte.",
    deducido: true,
  },
  {
    clave: "beneficiario",
    nombre: "El beneficiario",
    quienEs:
      "A quien le deben la plata. No figura como usuario en ningún documento, y es de " +
      "quien depende que todo esto sirva para algo.",
    deducido: true,
  },
];

// Las fronteras que el proyecto declara. Salen de `negocio/fronteras.md`, y
// el nivel de mock dice qué tanto se sabe de cada una: 1 solo el nombre, 2 los
// tipos de dato, 3 el contrato de verdad.
export type Frontera = {
  clave: string;
  nombre: string;
  gobernable: boolean;
  mock: 1 | 2 | 3;
};

export const fronteras: Frontera[] = [
  { clave: "cobis", nombre: "CORE COBIS", gobernable: true, mock: 1 },
  { clave: "as400", nombre: "Aplicativo IBMi / AS400", gobernable: true, mock: 1 },
  { clave: "siugj", nombre: "SIUGJ — Rama Judicial", gobernable: false, mock: 1 },
  { clave: "wso2", nombre: "Bus de servicio WSO2", gobernable: true, mock: 1 },
  { clave: "central", nombre: "Central de información", gobernable: false, mock: 1 },
  { clave: "ach", nombre: "ACH — Neurona", gobernable: false, mock: 1 },
  { clave: "pse", nombre: "PSE", gobernable: false, mock: 1 },
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
  // Los candidatos salen de la etapa 0a: `negocio/que-podemos-construir.md`.
  // **Esta lista es una hipótesis y hoy vale poco**: se escribió sin haber
  // construido ni mostrado nada, y sin haber hablado con una sola persona.
  {
    nombre: "Constituir y pagar un depósito",
    queHace:
      "Un despacho recibe plata a su orden y eso constituye un depósito. Después ordena " +
      "qué hacer con ella, y esa orden la ingresa uno y la firma otro.",
    estado: "pendiente",
    usan: [
      { rol: "ingresa", para: "Preparar la orden de pago sobre uno o varios títulos" },
      { rol: "autoriza", para: "Firmarla con su clave, o rechazarla" },
      { rol: "beneficiario", para: "Recibir la plata — hoy no se entera por aquí" },
    ],
    noEntra: [
      {
        que: "El tope de once títulos",
        porque: "el documento dice «mínimo uno y máximo once» y no dice por qué once",
        dato: true,
      },
      {
        que: "Qué pasa con una orden rechazada",
        porque: "hay pantalla de rechazo, pero nada dice cómo se entera quien la ingresó",
        dato: true,
      },
    ],
    escrito: { palabras: 23879, donde: "el ST-FT-001 §2, Transacciones" },
    fronteras: ["cobis", "as400", "ach", "wso2"],
    pantallas: [],
    espera: "Es el que arranca. Sale del frente 1.",
  },
  {
    nombre: "Consultar títulos",
    queHace:
      "Buscar un título por número, por proceso, por dependencia, por demandante, por " +
      "beneficiario. Nueve formas de buscar lo mismo.",
    estado: "pendiente",
    usan: [
      { rol: "ingresa", para: "Encontrar el título antes de ordenar algo sobre él" },
      { rol: "concilia", para: "Ver qué hay contra qué debería haber" },
    ],
    escrito: { palabras: 9104, donde: "el ST-FT-001 §3, Consultas" },
    fronteras: ["as400", "wso2"],
    pantallas: [],
    espera: "Le toca su turno: es una vista sobre lo que otro módulo crea.",
  },
  {
    nombre: "Administrar usuarios y dependencias",
    queHace:
      "Quién existe, qué rol tiene, a qué despachos está vinculado, y quién responde por " +
      "su firma electrónica.",
    estado: "pendiente",
    usan: [{ rol: "adminbanco", para: "Crear, vincular, desbloquear y cambiar de rol" }],
    noEntra: [
      {
        que: "La contingencia de la firma electrónica",
        porque:
          "hay cuatro remedios distintos para la misma clave; a quién se le concede y con " +
          "qué criterio no está escrito en ninguna parte",
        dato: true,
      },
    ],
    escrito: { palabras: 7518, donde: "el ST-FT-001 §4, Administración" },
    fronteras: ["cobis", "wso2"],
    pantallas: [],
    espera: "Le toca su turno.",
  },
  {
    nombre: "Conciliar con el juzgado",
    queHace:
      "Cuadrar lo que dice el juzgado contra lo que dice el banco, y avisar cuando no " +
      "cuadra.",
    estado: "pendiente",
    usan: [{ rol: "concilia", para: "Cuadrar y encontrar la diferencia" }],
    noEntra: [
      {
        que: "Todo el módulo",
        porque:
          "cómo se concilia hoy no está escrito en ninguno de los cuatro documentos. " +
          "Construirlo ahora sería inventarlo",
        dato: true,
      },
    ],
    escrito: { palabras: 6157, donde: "el ST-FT-001 §7 y el Anexo Técnico §5.2" },
    fronteras: ["siugj", "as400"],
    pantallas: [],
    espera: "Media hora mirando a alguien conciliar. Es la pregunta P2 de la lectura.",
  },
  {
    nombre: "Parametrización contable",
    queHace:
      "Configurar con qué cuentas, conceptos y perfiles se registra contablemente cada " +
      "operación, sin que haga falta desarrollo.",
    estado: "pendiente",
    usan: [{ rol: "adminbanco", para: "Cambiar la contabilidad sin pedir un desarrollo" }],
    noEntra: [
      {
        que: "Las dieciséis historias que lo especifican",
        porque:
          "están en Azure y no entre los insumos. En los documentos del cliente este " +
          "módulo aparece una sola vez, como una tarea del AS/400",
        dato: true,
      },
    ],
    escrito: { palabras: 0, donde: "ninguna parte" },
    fronteras: ["cobis", "as400"],
    pantallas: [],
    espera: "Las 16 historias de Azure. Con ellas pasa a ser el mejor documentado de todos.",
  },
];
