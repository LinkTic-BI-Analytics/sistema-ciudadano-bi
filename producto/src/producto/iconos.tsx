import {
  ArrowLeft, ArrowRight, Calendar, Check, Clock, Copy, FileText, FolderOpen,
  Info, Inbox, Lightbulb, ListChecks, MapPin, Megaphone, Mic, PenLine, Phone,
  PhoneCall, QrCode, Search, Send, ShieldCheck, Sun, Moon, TriangleAlert, Users, X,
  type LucideIcon, type LucideProps,
} from "lucide-react";

/**
 * Los iconos del producto, con un nombre del dominio y ya neutralizados.
 *
 * **El sistema de diseño lleva iconos desde el principio y no había ninguno.**
 * Las hojas del paquete dimensionan `svg` en doce sitios —`.pc-action svg`,
 * `.bo-empty > svg`, `.bo-search-field svg`, `.bo-label-tag svg`, `.bo-brand >
 * svg`, `.pc-event-title svg`…— con tamaños distintos y hasta con color propio:
 * el vacío de la consola le pone el dorado de marca. Todo eso estaba escrito
 * esperando un icono que nunca llegó, y `lucide-react` lleva instalado desde
 * entonces sin que un solo archivo lo importe.
 *
 * ## Por qué pasan por aquí y no se importan sueltos
 *
 * **Para que ninguno se quede sin `aria-hidden`.** Un icono al lado de un texto
 * es decoración, y si el lector de pantalla lo anuncia lee dos veces lo mismo.
 * Peor: los recorridos localizan botones por su nombre accesible
 * —`getByRole("button", { name: /hablo por mí/i })`— y un `<title>` metido por
 * el icono le cambia el nombre al botón. Forzarlo aquí es lo que hace que no se
 * pueda olvidar en una pantalla.
 *
 * **Y para que un icono nunca vaya solo.** Regla dura de este producto: el
 * icono acompaña a una palabra, nunca la sustituye. Un botón que solo lleva
 * icono no tiene nombre accesible y, en una consola con veinte controles, nadie
 * recuerda qué significaba el tercero.
 *
 * **No se pasa `size`.** El tamaño lo ponen las hojas del sistema de diseño, que
 * ya lo tienen decidido por sitio; CSS gana sobre el atributo que trae el
 * componente, así que basta con no estorbar.
 *
 * Importados uno por uno y nunca con `import *`: así el empaquetador se lleva
 * solo estos y no los mil y pico del paquete.
 */
function decorativo(Icono: LucideIcon) {
  return function IconoDecorativo(props: LucideProps) {
    return <Icono aria-hidden focusable="false" strokeWidth={1.75} {...props} />;
  };
}

// La bandeja y sus vistas de trabajo.
export const IconoBandeja = decorativo(Inbox);
export const IconoLugar = decorativo(MapPin);
export const IconoExpediente = decorativo(FolderOpen);
export const IconoUrgencia = decorativo(TriangleAlert);
export const IconoRevisar = decorativo(ListChecks);
export const IconoRemitir = decorativo(Send);

// Controles.
export const IconoBuscar = decorativo(Search);
export const IconoQuitar = decorativo(X);
export const IconoSiguiente = decorativo(ArrowRight);
export const IconoVolver = decorativo(ArrowLeft);
export const IconoCopiar = decorativo(Copy);
export const IconoHecho = decorativo(Check);

// Lo que se le pregunta a una persona, y lo que se le devuelve.
export const IconoIdea = decorativo(Lightbulb);
export const IconoGrupo = decorativo(Megaphone);
export const IconoQuienes = decorativo(Users);
export const IconoCuando = decorativo(Clock);
export const IconoMicrofono = decorativo(Mic);
export const IconoComprobante = decorativo(QrCode);

// Los tres modos de contar: escribir, hablar (`IconoMicrofono`) y «te llamamos».
export const IconoEscribir = decorativo(PenLine);
export const IconoLlamada = decorativo(PhoneCall);
// El 123. Va en la acción de la orientación de urgencia y en ningún otro sitio.
export const IconoTelefono = decorativo(Phone);

// Estados de pantalla.
export const IconoVacio = decorativo(FileText);
export const IconoAviso = decorativo(Info);
export const IconoAgenda = decorativo(Calendar);
/** Lo que la portada promete sobre el trato de lo que la persona cuenta. */
export const IconoSinCuenta = decorativo(ShieldCheck);

// El tema. El rótulo dice a dónde va, no dónde está, y el icono lo acompaña.
export const IconoClaro = decorativo(Sun);
export const IconoOscuro = decorativo(Moon);
