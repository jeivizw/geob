import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Login tradicional via tabela/email
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single()

      if (error || !data) {
        alert('E-mail ou senha incorretos.')
        setLoading(false)
        return
      }

      // Salva o e-mail do usuário logado na sessão
      localStorage.setItem('userEmail', data.email)
      navigate('/dashboard')
    } catch (err) {
      alert('Erro ao conectar ao banco de dados.')
    } finally {
      setLoading(false)
    }
  }

  // Login social com Google (OAuth 2.0)
  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })

      if (error) {
        alert(`Erro ao conectar com Google: ${error.message}`)
      }
    } catch (err) {
      alert('Erro ao iniciar o login com o Google.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-zinc-100 p-8">
      <div className="flex flex-col items-center mb-8 mt-4">
        <svg style={{ width: '48px', height: '48px' }} className="text-[#ec0000] mb-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 2c-3.1 3-5.5 6.2-5.5 10 0 .5.1 1 .2 1.5-1.2-1.2-1.7-2.9-1.7-4.5C4 11 2.5 13.5 2.5 16c0 3.6 3 6.5 6.8 6.5 4.3 0 7.2-3.8 7.2-7.5 0-4-3-8-3-13z" />
        </svg>
        <div className="text-3xl tracking-tight text-zinc-900">
          <span className="font-normal text-zinc-400">geo</span><span className="font-bold">bank.</span>
        </div>
        <p className="text-zinc-500 text-sm mt-2">Acesse sua conta para continuar</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">E-mail</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 px-4 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#ec0000]"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Senha</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 px-4 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#ec0000]"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#ec0000] hover:bg-[#cc0000] text-white rounded-2xl py-4 font-medium transition-colors shadow-md mt-2 disabled:opacity-50">
          {loading ? 'Acessando...' : 'Entrar na conta'}
        </button>
      </form>

      {/* Divisador de opções de login */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="border-t border-zinc-200 w-full"></div>
        <span className="bg-white px-3 text-xs text-zinc-400 font-medium absolute">ou</span>
      </div>

      {/* Botão de Login Social com Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 rounded-2xl py-3 px-4 font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Entrar com Google
      </button>

      <div className="mt-6 text-center border-t border-zinc-100 pt-4">
        <p className="text-xs text-zinc-500">Ainda não tem conta no GeoBank?</p>
        <button onClick={() => navigate('/register')} className="text-xs font-bold text-[#ec0000] hover:underline mt-1">
          Criar uma conta gratuitamente
        </button>
      </div>
    </div>
  )
}