import { useState, useEffect } from 'react'

function App() {
  const [balance, setBalance] = useState(1250.00);
  const [amountInput, setAmountInput] = useState('');
  const [geoStatus, setGeoStatus] = useState('pending');
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const savedBalance = localStorage.getItem('geoBankBalance_v2');
    if (savedBalance !== null) {
      setBalance(parseFloat(savedBalance));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('geoBankBalance_v2', balance);
  }, [balance]);

  const handleFastAmount = (value) => {
    const currentVal = parseFloat(amountInput.toString().replace(',', '.')) || 0;
    const newVal = currentVal + value;
    setAmountInput(String(newVal));
  };

  const processTransaction = (type) => {
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor, insira um valor válido maior que zero.');
      return;
    }

    if (type === 'deposit') {
      setBalance((prev) => prev + amount);
    } else if (type === 'withdraw') {
      if (balance >= amount) {
        setBalance((prev) => prev - amount);
      } else {
        alert('Saldo insuficiente para realizar este saque.');
        return;
      }
    }
    setAmountInput('');
  };

  const resetAccount = () => {
    setBalance(0);
  };

  const getLocation = () => {
    setGeoStatus('loading');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoData({
            lat: position.coords.latitude.toFixed(4),
            lon: position.coords.longitude.toFixed(4)
          });
          setGeoStatus('success');
        },
        (error) => {
          let msg = "Erro desconhecido.";
          if (error.code === error.PERMISSION_DENIED) msg = "Permissão negada.";
          if (error.code === error.POSITION_UNAVAILABLE) msg = "Sinal indisponível.";
          if (error.code === error.TIMEOUT) msg = "Tempo esgotado.";
          setGeoData(msg);
          setGeoStatus('error');
        }
      );
    } else {
      setGeoData("Não suportado");
      setGeoStatus('error');
    }
  };

  return (
    <>
      <main className="w-full bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-zinc-100 relative">
        <header className="p-8 pb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg style={{ width: '24px', height: '24px' }} className="w-6 h-6 text-[#ec0000]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 2c-3.1 3-5.5 6.2-5.5 10 0 .5.1 1 .2 1.5-1.2-1.2-1.7-2.9-1.7-4.5C4 11 2.5 13.5 2.5 16c0 3.6 3 6.5 6.8 6.5 4.3 0 7.2-3.8 7.2-7.5 0-4-3-8-3-13z" />
            </svg>
            <div className="text-xl tracking-tight text-zinc-900">
              <span className="font-normal text-zinc-400">geo</span><span className="font-bold">bank.</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer">
            <i className="fa-solid fa-bars"></i>
          </div>
        </header>

        <section className="px-8 py-4">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">Saldo Disponível</p>
          <h2 className="text-5xl font-light tracking-tighter text-zinc-900">
            <span className="text-2xl text-zinc-400 font-medium mr-1">R$</span>
            {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </section>

        <section className="px-8 py-8 bg-zinc-50 border-y border-zinc-100">
          <div className="relative mb-5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium pointer-events-none select-none">
              R$
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={amountInput}
              onChange={(e) => {
                const val = e.target.value.replace(',', '.');
                if (/^\d*\.?\d*$/.test(val)) {
                  setAmountInput(val);
                }
              }}
              placeholder="0.00"
              className="w-full bg-white border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-lg font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#ec0000] focus:border-transparent transition-all shadow-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            <button onClick={() => handleFastAmount(50)} className="whitespace-nowrap px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-medium text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-all shadow-sm">+ R$ 50</button>
            <button onClick={() => handleFastAmount(100)} className="whitespace-nowrap px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-medium text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-all shadow-sm">+ R$ 100</button>
            <button onClick={() => handleFastAmount(200)} className="whitespace-nowrap px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-medium text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-all shadow-sm">+ R$ 200</button>
            <button onClick={() => handleFastAmount(500)} className="whitespace-nowrap px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-medium text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-all shadow-sm">+ R$ 500</button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button onClick={() => processTransaction('deposit')} className="bg-[#ec0000] hover:bg-[#cc0000] text-white rounded-2xl py-3.5 font-medium transition-colors shadow-md">
              Depositar
            </button>
            <button onClick={() => processTransaction('withdraw')} className="bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-2xl py-3.5 font-medium transition-colors shadow-sm">
              Sacar
            </button>
          </div>
        </section>

        <section className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-800 tracking-wide">Status de Segurança</h3>
            <i className="fa-solid fa-shield-halved text-zinc-300"></i>
          </div>

          <div className={`border rounded-2xl p-5 mb-4 text-center transition-all duration-300 ${geoStatus === 'success' ? 'bg-teal-50 border-teal-100' :
              geoStatus === 'error' ? 'bg-rose-50 border-rose-100' :
                'bg-zinc-50 border-zinc-100'
            }`}>

            {geoStatus === 'pending' && <p className="text-sm text-zinc-500">Localização pendente.</p>}

            {geoStatus === 'loading' && <p className="text-sm text-zinc-500"><i className="fa-solid fa-spinner fa-spin text-zinc-400 mb-2 block text-xl"></i> Verificando...</p>}

            {geoStatus === 'success' && geoData && (
              <>
                <div className="text-teal-800 font-medium text-sm mb-1"><i className="fa-solid fa-check-circle mr-1"></i> Dispositivo Seguro</div>
                <div className="text-xs text-teal-600/80 mb-2 font-mono">Lat: {geoData.lat} | Lon: {geoData.lon}</div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${geoData.lat},${geoData.lon}`} target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 uppercase tracking-wider">
                  Abrir Mapa <i className="fa-solid fa-arrow-up-right-from-square ml-1"></i>
                </a>
              </>
            )}

            {geoStatus === 'error' && (
              <>
                <div className="text-rose-700 font-medium text-sm"><i className="fa-solid fa-triangle-exclamation mr-1"></i> Falha na verificação</div>
                <div className="text-xs text-rose-500 mt-1">{geoData}</div>
              </>
            )}
          </div>

          <button onClick={getLocation} className="w-full py-3 text-sm font-medium text-zinc-400 hover:text-zinc-800 transition-colors flex items-center justify-center gap-2">
            <i className="fa-solid fa-location-crosshairs"></i> Autenticar Dispositivo
          </button>
        </section>
      </main>

      <button onClick={resetAccount} className="mt-8 text-xs text-zinc-400 hover:text-zinc-600 underline transition-colors w-full text-center">
        Zerar conta (Modo Teste)
      </button>
    </>
  )
}

export default App