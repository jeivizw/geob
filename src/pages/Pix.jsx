import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Pix() {
  const navigate = useNavigate()
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [pixKey, setPixKey] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const userEmail = localStorage.getItem('userEmail') || 'cliente@geobank.com'

  useEffect(() => {
    const fetchAccount = async () => {
      const { data: u } = await supabase.from('users').select('id').eq('email', userEmail).single()
      if (u) {
        const { data: acc } = await supabase.from('accounts').select('*').eq('user_id', u.id).single()
        if (acc) {
          setAccount(acc)
          setBalance(parseFloat(acc.balance))
        }
      }
    }
    fetchAccount()
  }, [userEmail])

  const handleSendPix = async (e) => {
    e.preventDefault()
    const val = parseFloat(amount)
    if (isNaN(val) || val <= 0 || !account) return alert('Insira um valor válido.')
    if (val > balance) return alert('Saldo insuficiente.')

    setLoading(true)
    try {
      const newBalance = balance - val

      // 1. Debita da conta de origem
      await supabase.from('accounts').update({ balance: newBalance }).eq('id', account.id)

      // 2. Se a chave Pix pertencer a outra conta no banco, credita o saldo nela
      const { data: destAcc } = await supabase.from('accounts').select('*').eq('pix_key', pixKey).single()
      if (destAcc) {
        const destBalance = parseFloat(destAcc.balance) + val
        await supabase.from('accounts').update({ balance: destBalance }).eq('id', destAcc.id)
      }

      // 3. Registra transação
      await supabase.from('transactions').insert([{
        account_id: account.id,
        transaction_type: 'pix_send',
        amount: val,
        destination_pix_key: pixKey,
        description: `Pix enviado para ${pixKey}`
      }])

      setBalance(newBalance)
      alert(`Pix de R$ ${val.toFixed(2)} enviado com sucesso!`)
      setAmount('')
      setPixKey('')
    } catch (err) {
      alert('Erro ao processar Pix.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/dashboard')} className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="text-lg font-bold text-zinc-900">Área Pix</h2>
        <div className="w-10"></div>
      </div>

      <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 mb-6 text-center">
        <p className="text-xs font-semibold text-zinc-400 uppercase mb-1">Saldo para Pix</p>
        <p className="text-2xl font-bold text-zinc-900">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
      </div>

      <form onSubmit={handleSendPix} className="flex flex-col gap-4">
        <input type="text" required value={pixKey} onChange={(e) => setPixKey(e.target.value)} placeholder="Chave Pix do Destinatário" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 px-4 text-sm" />
        <input type="text" inputMode="decimal" required value={amount} onChange={(e) => setAmount(e.target.value.replace(',', '.'))} placeholder="Valor R$ (0.00)" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 px-4 text-sm" />
        <button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-2xl py-4 font-medium shadow-md flex items-center justify-center gap-2">
          {loading ? 'Enviando...' : 'Enviar Pix'}
        </button>
      </form>
    </div>
  )
}