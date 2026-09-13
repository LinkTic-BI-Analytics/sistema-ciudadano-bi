// La forma de `construccion/.estado.json`.
//
// **Este archivo es del harness y no lo escribe nadie a mano.** Lo produce
// `scripts/construccion.sh` leyendo la hoja de ruta, los contratos, los vacíos,
// los módulos, el ledger de Superpowers y los worktrees de git.
//
// Los tipos están aquí y no en el guion por una razón práctica: si el guion
// cambia la forma y la vista no se entera, TypeScript lo dice en el build en vez
// de que la pantalla salga vacía en silencio.

export type Estado =
  | "candidato" | "listo" | "en construcción" | "bloqueado"
  | "en revisión" | "en integración" | "terminado" | "caído";

export type Tarea = {
  id: string;
  resultado: string;
  codigos: string[];
  depende_de: string[];
  linea: string;
  propietario: string;
  estado: Estado;
  evidencia: string;
};

export type Agente = {
  ruta: string;
  rama?: string;
  ultimo_commit: string | null;
  dias_sin_commit: number | null;
};

export type Deterioro = {
  id: string;
  estado: string;
  dias: number | null;
  por_que: string;
};

export type Contradiccion = { id: string; estado?: string; falta: string[] };

export type Par = {
  par: [string, string];
  comparten: string[];
  una_espera_a_la_otra: boolean;
  decision: "paralelo" | "secuencial";
};

export type EstadoConstruccion = {
  generado: string;
  tareas: Tarea[];
  por_estado: Record<Estado, string[]>;
  ruta_critica: string[];
  lineas_activas: string[];
  ciclos: string[][];
  dependencias_huerfanas: string[];
  deberia_estar_listo: string[];
  dice_listo_pero_no: Contradiccion[];
  listas_sin_contrato: Contradiccion[];
  paralelismo: { pares: Par[]; sin_superficie_declarada: string[] };
  bloqueos: { id: string; resultado: string; linea: string }[];
  deterioro: Deterioro[];
  cobertura: {
    comprobable: boolean;
    por_que: string | null;
    codigos_sin_tarea: string[];
    tareas_sin_autoridad: string[];
  };
  modulos: Record<string, { sobre_cerrado: { marcadas: number; totales: number } }>;
  vacios: { archivo: string | null; abiertas: number };
  agentes: Agente[];
  planes_de_superpowers: Record<
    string,
    { tareas_completas: string[]; ultima_ronda_de_arreglo: string | null }
  >;
  defectos_del_tablero: string[];
};
