# 💳 GeoBank — Aplicação Web FinTech

O **GeoBank** é uma aplicação web completa de simulação bancária desenvolvida com React, Vite e Tailwind CSS, integrada ao banco de dados relacional **Supabase (PostgreSQL)**. O projeto conta com autenticação de usuários, gestão de saldo em tempo real, transferências Pix, criação e exclusão dinâmica de cartões virtuais e registro de logs de segurança.

---

## 🚀 Funcionalidades

* **Autenticação & Contas:**
  * Cadastro de novos usuários com validação de campos.
  * Trigger SQL para criação automática de conta bancária e saldo inicial ao se registrar.
  * Login com verificação e persistência de sessão via `localStorage`.

* **Dashboard Financeiro:**
  * Visualização de saldo atualizado em tempo real.
  * Simulação de depósitos e saques instantâneos com persistência no Supabase.
  * Menu lateral gaveta (*drawer menu*) com navegação fluida.
  * Verificação simulada de segurança via Geolocalização.

* **Área Pix:**
  * Envio de Pix com validação de saldo.
  * Transferência entre contas cadastradas na plataforma (débito/crédito automático).
  * Histórico e registro de transações no banco de dados.

* **Gestão de Cartões:**
  * Listagem de cartões físicos e virtuais.
  * Geração instantânea de novos cartões virtuais dinâmicos.
  * Exclusão permanente de cartões salvos no banco.

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia |
| :--- | :--- |
| **Frontend** | React, Vite, React Router DOM |
| **Estilização** | Tailwind CSS, FontAwesome |
| **Backend / DB** | Supabase (PostgreSQL) |
| **Cliente API** | `@supabase/supabase-js` |

---

## 📁 Estrutura do Projeto

```text
geobank/
├── src/
│   ├── lib/
│   │   └── supabase.js      # Inicialização do cliente Supabase
│   ├── pages/
│   │   ├── Login.jsx        # Tela de Autenticação
│   │   ├── Register.jsx     # Tela de Cadastro de Usuário
│   │   ├── Dashboard.jsx    # Painel Principal e Gestão de Saldo
│   │   ├── Pix.jsx          # Transferências Pix
│   │   └── Cards.jsx        # Gestão e Exclusão de Cartões
│   ├── App.jsx              # Rotas da Aplicação
│   └── main.jsx             # Ponto de Entrada React
├── .env                     # Variáveis de ambiente (não enviado ao Git)
├── .gitignore
├── package.json
└── README.md
