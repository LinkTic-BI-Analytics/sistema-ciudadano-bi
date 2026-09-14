import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// El cliente de servidor. Usa la llave `secret`, que **nunca** va en código que
// llegue al navegador — por eso su variable no lleva el prefijo `NEXT_PUBLIC_`
// (`AGENTS.md` §11, ADR 0006).
//
// No se cachea en un módulo compartido a propósito: un cliente con llave secreta
// reutilizado entre peticiones es cómo se filtra una sesión a la petición de al
// lado.
export function clienteServidor(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secreta = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secreta) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY. " +
      "Cópialas de `supabase status` a producto/.env.local.",
    );
  }
  return createClient(url, secreta, { auth: { persistSession: false } });
}
