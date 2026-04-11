import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile } from '../services/api';
import { getCurrentSession, onAuthStateChange, signIn, signOut, signUp } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session au démarrage
    getCurrentSession().then((s) => {
      setSession(s);
      if (s?.user) {
        getProfile(s.user.id).then(setProfile).catch(() => {});
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    // Écouter les changements d'auth
    const subscription = onAuthStateChange(async (newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        try {
          const p = await getProfile(newSession.user.id);
          setProfile(p);
        } catch { /* profile pas encore créé */ }
      } else {
        setProfile(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    profile,
    loading,
    isLoggedIn: !!session?.user,

    signIn: async ({ email, password }) => {
      const data = await signIn({ email, password });
      return data;
    },

    signUp: async ({ email, password, fullName }) => {
      const data = await signUp({ email, password, fullName });
      return data;
    },

    signOut: async () => {
      await signOut();
      setSession(null);
      setProfile(null);
    },

    refreshProfile: async () => {
      if (session?.user) {
        const p = await getProfile(session.user.id);
        setProfile(p);
      }
    },
  }), [session, profile, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
