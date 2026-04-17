import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltam as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY",
  );
}

// Log connection info in development to help debug common configuration issues
if (import.meta.env.DEV) {
  console.log("Supabase initialized with URL:", supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth state listener to handle session consistency and clean up invalid tokens
supabase.auth.onAuthStateChange((event, session) => {
  if (import.meta.env.DEV) {
    console.log(`Supabase Auth Event: ${event}`);
  }

  // If a refresh fails or a user is signed out, ensure local storage is clean
  if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
    // Optional: Additional logic for sign-out/token failure
  }
});

