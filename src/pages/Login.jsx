import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

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

      <div className="mt-6 text-center border-t border-zinc-100 pt-4">
        <p className="text-xs text-zinc-500">Ainda não tem conta no GeoBank?</p>
        <button onClick={() => navigate('/register')} className="text-xs font-bold text-[#ec0000] hover:underline mt-1">
          Criar uma conta gratuitamente
        </button>
      </div>
    </div>
  )
}