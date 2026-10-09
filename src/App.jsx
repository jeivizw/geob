import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Pix from './pages/Pix'
import Cards from './pages/Cards'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Busca a sessão atual do Supabase ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        saveUserData(session.user)
      }
      setLoading(false)
    })

    // 2. Escuta alterações no estado de autenticação (Login / Logout / Callback OAuth)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        saveUserData(session.user)
      } else if (_event === 'SIGNED_OUT') {
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
        localStorage.removeItem('userAvatar')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Função auxiliar para armazenar dados do usuário no localStorage
  const saveUserData = (user) => {
    const email = user.email || ''
    const name = user.user_metadata?.full_name || user.email || 'Usuário'
    const avatar = user.user_metadata?.avatar_url || ''

    localStorage.setItem('userEmail', email)
    localStorage.setItem('userName', name)
    localStorage.setItem('userAvatar', avatar)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ec0000]"></div>
      </div>
    )
  }

  const isAuthenticated = session || localStorage.getItem('userEmail')

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        
        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/pix"
          element={isAuthenticated ? <Pix /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/cards"
          element={isAuthenticated ? <Cards /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  )
}

export default App