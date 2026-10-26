const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// A tua chave de API do NOWPayments guardada nas variáveis de ambiente do Render
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_BASE_URL = 'https://api.nowpayments.io/v1';

// 1. ROTA DE DEPÓSITO REAL (Gera Invoice)
app.post('/api/deposit', async (req, res) => {
  try {
    const { amount, username } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Montante inválido.' });
    }

    // Chamada à API da NOWPayments para criar fatura
    const response = await axios.post(`${NOWPAYMENTS_BASE_URL}/invoice`, {
      price_amount: amount,
      price_currency: 'usd',
      pay_currency: 'usdtbsc', // USDT na rede BNB Smart Chain (compatível com MetaMask)
      order_id: `deposito_${username}_${Date.now()}`,
      ipn_callback_url: 'https://chessbet-backend.onrender.com/api/ipn'
    }, {
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    return res.json({
      success: true,
      invoice_url: response.data.invoice_url
    });

  } catch (error) {
    console.error('Erro no Depósito:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data?.message || 'Falha ao gerar fatura real no NOWPayments.'
    });
  }
});

// 2. ROTA DE SAQUE REAL (Payout via Custody)
app.post('/api/withdraw', async (req, res) => {
  try {
    const { amount, destinationAddress, username } = req.body;

    if (!amount || amount <= 0 || !destinationAddress) {
      return res.status(400).json({ success: false, error: 'Dados de saque incompletos.' });
    }

    // Chamada à API de Payouts da NOWPayments
    const response = await axios.post(`${NOWPAYMENTS_BASE_URL}/payout`, {
      withdrawals: [
        {
          address: destinationAddress, // Carteira MetaMask (0x...)
          amount: amount,
          currency: 'usdtbsc',         // Envio de USDT pela rede BSC
          ipn_callback_url: 'https://chessbet-backend.onrender.com/api/ipn'
        }
      ]
    }, {
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    return res.json({
      success: true,
      message: 'Saque real processado com sucesso na blockchain!',
      data: response.data
    });

  } catch (error) {
    console.error('Erro no Saque:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data?.message || 'Erro ao comunicar com a API de Payouts.'
    });
  }
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ChessBet a rodar na porta ${PORT}`);
});
