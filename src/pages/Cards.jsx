import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Cards() {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(false)
  const userEmail = localStorage.getItem('userEmail') || 'cliente@geobank.com'

  const fetchCards = async () => {
    const { data: u } = await supabase.from('users').select('id').eq('email', userEmail).single()
    if (u) {
      const { data: acc } = await supabase.from('accounts').select('id').eq('user_id', u.id).single()
      if (acc) {
        setAccount(acc)
        const { data: userCards } = await supabase.from('cards').select('*').eq('account_id', acc.id)
        if (userCards) setCards(userCards)
      }
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const handleCreateVirtualCard = async () => {
    if (!account) return
    setLoading(true)

    const randomDigits = Math.floor(1000 + Math.random() * 9000)
    const newCard = {
      account_id: account.id,
      card_number: `•••• •••• •••• ${randomDigits}`,
      card_holder_name: 'CLIENTE GEOBANK',
      expiry_date: '12/30',
      cvv: String(Math.floor(100 + Math.random() * 900)),
      card_type: 'virtual'
    }

    const { error } = await supabase.from('cards').insert([newCard])
    if (!error) {
      fetchCards()
    } else {
      alert('Erro ao criar cartão.')
    }
    setLoading(false)
  }

  // FUNÇÃO PARA DELETAR O CARTÃO NO SUPABASE
  const handleDeleteCard = async (cardId) => {
    if (!confirm('Deseja realmente apagar este cartão?')) return

    const { error } = await supabase.from('cards').delete().eq('id', cardId)
    if (!error) {
      setCards(cards.filter(c => c.id !== cardId))
    } else {
      alert('Erro ao deletar cartão: ' + error.message)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/dashboard')} className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="text-lg font-bold text-zinc-900">Meus Cartões</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        {cards.map((card) => (
          <div key={card.id} className={`${card.card_type === 'virtual' ? 'bg-gradient-to-r from-red-600 to-[#ec0000]' : 'bg-zinc-900'} text-white p-6 rounded-3xl shadow-lg relative flex flex-col justify-between h-48`}>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full font-medium">{card.card_type}</span>
              
              {/* BOTÃO DE DELETAR CARTÃO */}
              <button onClick={() => handleDeleteCard(card.id)} className="text-white/80 hover:text-white bg-black/20 p-2 rounded-full transition-colors">
                <i className="fa-solid fa-trash-can text-sm"></i>
              </button>
            </div>
            
            <p className="text-xl font-mono tracking-widest my-2">{card.card_number}</p>
            
            <div className="flex justify-between items-end text-xs font-light">
              <div>
                <p className="opacity-60 uppercase text-[10px]">Titular</p>
                <p className="font-semibold">{card.card_holder_name}</p>
              </div>
              <div>
                <p className="opacity-60 uppercase text-[10px]">Validade</p>
                <p className="font-semibold">{card.expiry_date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleCreateVirtualCard} disabled={loading} className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-2xl py-3.5 font-medium border border-zinc-200 flex items-center justify-center gap-2">
        <i className="fa-solid fa-plus text-sm"></i> {loading ? 'Gerando...' : 'Gerar Cartão Virtual'}
      </button>
    </div>
  )
}