// Núcleo de autenticación de la extensión: cliente Supabase + login por código
// OTP (email) + resolución del usuario de la app. Sin DOM: reutilizable.
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";
import { chromeStorageAdapter } from "./storage.js";

let client = null;

export function getClient() {
  if (client) return client;
  const createClient = globalThis.supabase?.createClient;
  if (!createClient) {
    throw new Error("supabase-js no está cargado (vendor/supabase.js).");
  }
  client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: chromeStorageAdapter,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}

// Envía el código OTP por email. shouldCreateUser:false → solo usuarios ya
// existentes en Auth (evita crear cuentas sueltas).
export async function sendOtp(email) {
  const { error } = await getClient().auth.signInWithOtp({
    email: normalizeEmail(email),
    options: { shouldCreateUser: false },
  });
  if (error) throw error;
}

export async function verifyOtp(email, token) {
  const { data, error } = await getClient().auth.verifyOtp({
    email: normalizeEmail(email),
    token: String(token || "").trim(),
    type: "email",
  });
  if (error) throw error;
  return data;
}

export async function getSession() {
  const { data } = await getClient().auth.getSession();
  return data?.session ?? null;
}

export async function signOut() {
  await getClient().auth.signOut();
}

// Mapea la sesión de Auth al usuario de la app (tabla users, por email).
export async function resolveAppUser(session) {
  const email = session?.user?.email;
  if (!email) return null;
  const { data, error } = await getClient()
    .from("users")
    .select("user_id,user_name,email,role,team_name,status")
    .eq("email", email)
    .maybeSingle();
  if (error) {
    console.warn("resolveAppUser:", error);
    return null;
  }
  return data ?? null;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}
