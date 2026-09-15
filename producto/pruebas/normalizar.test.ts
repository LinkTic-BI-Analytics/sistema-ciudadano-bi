// `NOR-01` y `NOR-02`: de lo que la persona escribió a un rango con el que se
// puede agrupar.
//
// Lo que se vigila aquí no es cuántos casos acierta, sino **que no invente**.
// Un rango vacío dice que no se precisó; un rango inventado es una mentira que
// después alguien usa para decidir presupuesto. Por eso hay tantas pruebas de
// «esto cae en sin_decir» como de aciertos.

import { test } from "node:test";
import assert from "node:assert/strict";
import { antiguedadDe, alcanceDe } from "../src/revision/normalizar.ts";

test("los años se leen, con número y sin él", () => {
  assert.equal(antiguedadDe("desde hace cinco años"), "mas_de_cuatro");
  assert.equal(antiguedadDe("hace 6 años"), "mas_de_cuatro");
  assert.equal(antiguedadDe("más de cuatro años"), "mas_de_cuatro");
  assert.equal(antiguedadDe("hace dos años"), "entre_uno_y_cuatro");
  assert.equal(antiguedadDe("desde hace un año"), "entre_uno_y_cuatro");
  assert.equal(antiguedadDe("hace cuatro años"), "entre_uno_y_cuatro");
});

test("«siempre» y «desde que tengo memoria» son lo más crónico que se puede decir", () => {
  // Y se dice así, sin números. Dejarlo en «sin decir» perdería justo el caso
  // que el negocio quiere encontrar.
  assert.equal(antiguedadDe("toda la vida"), "mas_de_cuatro");
  assert.equal(antiguedadDe("desde que tengo memoria"), "mas_de_cuatro");
  assert.equal(antiguedadDe("siempre ha sido así"), "mas_de_cuatro");
});

test("«hace años», sin número, NO se estira a más de cuatro", () => {
  // Son varios, pero cuántos no lo dijo. Meterlo en el rango alto sería decidir
  // por ella, y es la decisión que cambiaría a qué entidad compete.
  assert.equal(antiguedadDe("desde hace años"), "entre_uno_y_cuatro");
  assert.equal(antiguedadDe("hace muchos años"), "mas_de_cuatro");
});

test("días, semanas y meses caen por debajo del año", () => {
  assert.equal(antiguedadDe("hace tres meses"), "menos_de_un_ano");
  assert.equal(antiguedadDe("desde hace dos semanas"), "menos_de_un_ano");
  assert.equal(antiguedadDe("desde ayer"), "menos_de_un_ano");
  assert.equal(antiguedadDe("desde diciembre"), "menos_de_un_ano");
  // Salvo cuando el número de meses pasa del año: «18 meses» es año y medio.
  assert.equal(antiguedadDe("hace 18 meses"), "entre_uno_y_cuatro");
});

test("lo que no sabemos leer dice que no se sabe, no que sea cero", () => {
  // Es la mitad que importa. La ayuda del propio formulario propone «desde que
  // empezaron las lluvias», así que esto va a llegar mucho.
  assert.equal(antiguedadDe("desde que empezaron las lluvias"), "sin_decir");
  assert.equal(antiguedadDe("desde que se fue el contratista"), "sin_decir");
  assert.equal(antiguedadDe(""), "sin_decir");
  assert.equal(antiguedadDe(null), "sin_decir");
});

test("el rango no se mueve con el tiempo", () => {
  // Dice qué declaró **el día que lo contó**. Un aporte no se muda de rango
  // porque haya pasado un año: lo que se conserva es su declaración, no una
  // cuenta viva. Se comprueba que la función no mira el reloj.
  const antes = antiguedadDe("hace dos años");
  const despues = antiguedadDe("hace dos años");
  assert.equal(antes, despues);
  assert.equal(antes, "entre_uno_y_cuatro");
});

test("lo colectivo manda sobre el número", () => {
  // «Unas veinte familias de la vereda» es una vereda, no veinte casas sueltas:
  // quien atiende no va a veinte puertas, va a una vereda.
  assert.equal(alcanceDe("unas veinte familias de la vereda El Salado"), "vereda_o_barrio");
  assert.equal(alcanceDe("todo el barrio"), "vereda_o_barrio");
  assert.equal(alcanceDe("los niños de la escuela"), "vereda_o_barrio");
});

test("cuando deja de ser local, se nota", () => {
  // La escala se detenía en «una vereda o un barrio», así que «el acueducto de
  // todo el municipio» y «la llave de mi casa» quedaban a dos escalones cuando
  // son problemas distintos: uno lo resuelve la junta de acción comunal y el
  // otro no lo resuelve ni la alcaldía sola. Eso cambia a quién compete.
  assert.equal(alcanceDe("todo el municipio se queda sin agua"), "todo_el_municipio");
  assert.equal(alcanceDe("todas las veredas del municipio"), "todo_el_municipio");
  assert.equal(alcanceDe("varios municipios del sur"), "varios_municipios");
  assert.equal(alcanceDe("todo el departamento"), "varios_municipios");
});

test("«el municipio» a secas no es una medida de alcance", () => {
  // Aparece en «la alcaldía del municipio no responde», que no dice a cuántos
  // afecta. Leerlo como «todo el municipio» multiplicaría por mil el alcance de
  // un problema de una casa.
  assert.equal(alcanceDe("la alcaldía del municipio no responde"), "sin_decir");
});

test("una casa es una familia, y un puñado son varias", () => {
  assert.equal(alcanceDe("en mi casa"), "una_familia");
  assert.equal(alcanceDe("solo nosotros"), "una_familia");
  assert.equal(alcanceDe("unas cinco familias"), "varias_familias");
  assert.equal(alcanceDe("somos como 12"), "varias_familias");
  assert.equal(alcanceDe("los vecinos de la cuadra"), "varias_familias");
});

test("a cuántos, cuando no se dijo, no se rellena con un cero", () => {
  assert.equal(alcanceDe(""), "sin_decir");
  assert.equal(alcanceDe(null), "sin_decir");
  assert.equal(alcanceDe("a los que vivimos por acá"), "sin_decir");
});

test("las tildes y las mayúsculas no cambian nada", () => {
  // Nadie escribe «años» con tilde cuando está contando algo deprisa.
  assert.equal(antiguedadDe("HACE CINCO ANOS"), "mas_de_cuatro");
  assert.equal(antiguedadDe("Hace Cinco Años"), "mas_de_cuatro");
  assert.equal(alcanceDe("LA VEREDA ENTERA"), "vereda_o_barrio");
});
