import { supabase } from '../lib/supabase';

// ========================
// INSCRIPTION
// ========================
export async function signUp({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
  if (error) throw error;
  return data;
}

// ========================
// CONNEXION
// ========================
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// ========================
// DÉCONNEXION
// ========================
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ========================
// SESSION COURANTE
// ========================
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// ========================
// MOT DE PASSE OUBLIÉ
// ========================
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

// ========================
// LISTENER AUTH STATE
// ========================
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => callback(session)
  );
  return subscription;
}
