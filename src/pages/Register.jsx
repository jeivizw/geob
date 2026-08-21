import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', cpf: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleRegister = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) return alert('As senhas não coincidem!')

    setLoading(true)
    try {
      const { error } = await supabase.from('users').insert([{
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        password_hash: formData.password
      }])

      if (error) {
        alert('Erro ao criar conta: ' + error.message)
      } else {
        localStorage.setItem('userEmail', formData.email)
        alert('Conta criada com sucesso!')
        navigate('/dashboard')
      }
    } catch (err) {
      alert('Ocorreu um erro no servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-zinc-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/login')} className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-100">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Nova Conta</span>
        <div className="w-10"></div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Abra sua conta GeoBank</h2>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <input type="text" name="name" required placeholder="Nome Completo" value={formData.name} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-sm" />
        <input type="text" name="cpf" required placeholder="CPF (000.000.000-00)" value={formData.cpf} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-sm" />
        <input type="email" name="email" required placeholder="E-mail" value={formData.email} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-sm" />
        <input type="password" name="password" required placeholder="Senha" value={formData.password} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-sm" />
        <input type="password" name="confirmPassword" required placeholder="Confirmar Senha" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-sm" />

        <button type="submit" disabled={loading} className="w-full bg-[#ec0000] hover:bg-[#cc0000] text-white rounded-xl py-3.5 font-medium shadow-md mt-2 disabled:opacity-50">
          {loading ? 'Criando...' : 'Criar Minha Conta'}
        </button>
      </form>
    </div>
  )
}