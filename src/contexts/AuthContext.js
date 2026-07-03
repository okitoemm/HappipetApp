import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, getSitterByUserId, updateProfile } from '../services/api';
import { getCurrentSession, onAuthStateChange, signIn, signOut, signUp } from '../services/auth';
import { registerForPushNotifications } from '../services/pushNotifications';

const AuthContext = createContext(null);

// Derive a display name from email: "jean.dupont@gmail.com" → "Jean"
function nameFromEmail(email) {
  if (!email) return '';
  const local = email.split('@')[0];          // "jean.dupont"
  const first = local.split(/[._\-+]/)[0];   // "jean"
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

async function loadProfile(userId, userEmail) {
  try {
    const p = await getProfile(userId);
    // Auto-init full_name if missing
    if (!p.full_name) {
      const derived = nameFromEmail(userEmail);
      if (derived) {
        const updated = await updateProfile(userId, { full_name: derived });
        return updated;
      }
    }
    return p;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [sitterProfile, setSitterProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAll = async (userId, userEmail) => {
    const [p, sp] = await Promise.all([
      loadProfile(userId, userEmail),
      getSitterByUserId(userId).catch(() => null),
    ]);
    setProfile(p);
    setSitterProfile(sp);
    return p;
  };

  useEffect(() => {
    // Récupérer la session au démarrage
    getCurrentSession().then(async (s) => {
      setSession(s);
      if (s?.user) {
        await loadAll(s.user.id, s.user.email);
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    // Écouter les changements d'auth
    const subscription = onAuthStateChange(async (newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        await loadAll(newSession.user.id, newSession.user.email);
        registerForPushNotifications(newSession.user.id).catch(() => {});
      } else {
        setProfile(null);
        setSitterProfile(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    profile,
    sitterProfile,
    isSitter: !!sitterProfile,
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
      setSitterProfile(null);
    },

    refreshProfile: async () => {
      if (session?.user) {
        const p = await loadProfile(session.user.id, session.user.email);
        setProfile(p);
      }
    },

    refreshSitterProfile: async () => {
      if (session?.user) {
        const sp = await getSitterByUserId(session.user.id).catch(() => null);
        setSitterProfile(sp);
      }
    },
  }), [session, profile, sitterProfile, loading]);

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
