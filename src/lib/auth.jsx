// Owner sign-in with Supabase Auth. "Signed in" is not enough: the account must also be in
// public.admin_profiles. This is only for showing the right screen; the database enforces
// the real rules with Row Level Security, so hiding a page is never the protection.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { HAS_BACKEND, explain, supabase } from '@/lib/backend'

const AuthContext = createContext(null)

async function checkAdmin(session) {
  if (!session) return false
  const { data, error } = await supabase.from('admin_profiles').select('user_id').eq('user_id', session.user.id).maybeSingle()
  return !error && Boolean(data)
}

export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: HAS_BACKEND ? 'loading' : 'signed-out', session: null, isAdmin: false })

  useEffect(() => {
    if (!HAS_BACKEND) return undefined
    let active = true
    const apply = async (session) => {
      const isAdmin = await checkAdmin(session)
      if (active) setState({ status: session ? 'signed-in' : 'signed-out', session, isAdmin })
    }
    supabase.auth.getSession().then(({ data }) => apply(data.session))
    // Do not await Supabase calls inside this callback (it can deadlock); defer instead.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => apply(session), 0)
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw new Error(error.status === 400 ? 'Wrong email or password.' : explain(error, 'Could not sign in.'))
    }
  }, [])

  // Customer passwordless sign-in (email code / magic link). Never grants owner access:
  // owner rights come only from public.admin_profiles, enforced by Row Level Security.
  const sendCode = useCallback(async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/account` },
    })
    if (error) throw new Error(explain(error, 'Could not send the code. Please try again.'))
  }, [])

  const verifyCode = useCallback(async (email, token) => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    if (error) throw new Error('That code is wrong or has expired. Request a new one.')
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const value = useMemo(() => ({ ...state, signIn, sendCode, verifyCode, signOut }), [state, signIn, sendCode, verifyCode, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
