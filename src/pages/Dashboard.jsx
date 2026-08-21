import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [balance, setBalance] = useState(0)
  const [account, setAccount] = useState(null)
  const [userName, setUserName] = useState('')
  const [amountInput, setAmountInput] = useState('')
  const [userEmail] = useState(localStorage.getItem('userEmail') || 'cliente@geobank.com')

  // Carrega dados do usuário, conta e saldo do Supabase
  const loadAccountData = async () => {
    const { data: userData } = await supabase
      .from('users')
      .select('id, name')
      .eq('email', userEmail)
      .single()

    if (userData) {
      setUserName(userData.name)
      const { data: accData } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userData.id)
        .single()

      if (accData) {
        setAccount(accData)
        setBalance(parseFloat(accData.balance))
      }
    }
  }

  useEffect(() => {
    loadAccountData()
  }, [])

  const processTransaction = async (type) => {
    const amount = parseFloat(amountInput)
    if (isNaN(amount) || amount <= 0 || !account) return alert('Insira um valor válido.')

    let newBalance = balance
    if (type === 'deposit') newBalance += amount
    else if (type === 'withdraw') {
      if (balance >= amount) newBalance -= amount
      else return alert('Saldo insuficiente.')
    }

    await supabase.from('accounts').update({ balance: newBalance }).eq('id', account.id)
    await supabase.from('transactions').insert([{
      account_id: account.id,
      transaction_type: type,
      amount: amount,
      description: type === 'deposit' ? 'Depósito via App' : 'Saque via App'
    }])

    setBalance(newBalance)
    setAmountInput('')
  }

  const handleLogout = () => {
    localStorage.removeItem('userEmail')
    navigate('/login')
  }

  return (
    <>
      {isMenuOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsMenuOpen(false)}></div>}

      <div className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 shadow-2xl flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
          <span className="font-bold text-zinc-800">Menu</span>
          <button onClick={() => setIsMenuOpen(false)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-800">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        
        <div className="p-4 flex-1 flex flex-col gap-2">
          <button onClick={() => { setIsMenuOpen(false); navigate('/pix') }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 text-zinc-700 font-medium">
            <i className="fa-brands fa-pix text-teal-500 w-5"></i> Área Pix
          </button>
          <button onClick={() => { setIsMenuOpen(false); navigate('/cards') }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 text-zinc-700 font-medium">
            <i className="fa-regular fa-credit-card text-indigo-500 w-5"></i> Meus Cartões
          </button>
        </div>

        <div className="p-4 border-t border-zinc-100">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 text-rose-600 font-medium w-full text-left">
            <i className="fa-solid fa-arrow-right-from-bracket w-5"></i> Sair da conta
          </button>
        </div>
      </div>

      <main className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-zinc-100">
        <header className="p-8 pb-4 flex justify-between items-center">
          <div className="text-xl tracking-tight text-zinc-900"><span className="font-normal text-zinc-400">geo</span><span className="font-bold">bank.</span></div>
          <button onClick={() => setIsMenuOpen(true)} className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-600">
            <i className="fa-solid fa-bars"></i>
          </button>
        </header>

        {/* MENSAGEM DE SAUDAÇÃO COM NOME */}
        <section className="px-8 pt-2 pb-4">
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">
            Olá, {userName ? userName.split(' ')[0] : 'Cliente'}! 👋
          </h1>
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mt-3 mb-1">Saldo Disponível</p>
          <h2 className="text-5xl font-light tracking-tighter text-zinc-900">
            <span className="text-2xl text-zinc-400 font-medium mr-1">R$</span>
            {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </section>

        <section className="px-8 py-8 bg-zinc-50 border-y border-zinc-100">
          <input type="text" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} placeholder="0.00" className="w-full bg-white border border-zinc-200 rounded-2xl py-4 px-4 text-lg font-medium text-zinc-800 mb-4" />
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => processTransaction('deposit')} className="bg-[#ec0000] text-white rounded-2xl py-3.5 font-medium">Depositar</button>
            <button onClick={() => processTransaction('withdraw')} className="bg-white text-zinc-900 border border-zinc-200 rounded-2xl py-3.5 font-medium">Sacar</button>
          </div>
        </section>
      </main>
    </>
  )
}