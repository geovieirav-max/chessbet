const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Chave da API obtida nas variáveis de ambiente do Render
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// 1. ENDPOINT DE DEPÓSITO (Cria fatura real no NOWPayments)
app.post('/api/deposit', async (req, res) => {
try {
const { username, amount } = req.body;

if (!amount || amount <= 0) {
return res.status(400).json({ success: false, error: 'Montante inválido.' });
}

console.log(`A criar fatura real no NOWPayments para o utilizador ${username}, montante: €${amount}`);

// Chamada à API de faturas do NOWPayments (sem ipn_url direto no body)
const response = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
method: 'POST',
headers: {
'x-api-key': NOWPAYMENTS_API_KEY,
'Content-Type': 'application/json'
},
body: JSON.stringify({
price_amount: amount,
price_currency: 'eur',
pay_currency: 'usdttrc20',
order_id: `dep_${username}_${Date.now()}`,
order_description: `Depósito ChessBet - ${username}`
})
});

const data = await response.json();
console.log('Resposta do NOWPayments (Invoice):', data);

if (response.ok && data.invoice_url) {
return res.json({
success: true,
message: 'Fatura criada com sucesso!',
invoice_url: data.invoice_url
});
} else {
return res.status(500).json({
success: false,
error: data.message || 'Erro ao gerar fatura real no NOWPayments.'
});
}

} catch (error) {
console.error('Erro no servidor /api/deposit:', error);
return res.status(500).json({ success: false, error: 'Erro interno no servidor.' });
}
});

// 2. ENDPOINT DE SAQUE / PAYOUT (Envia fundos reais do NOWPayments para a carteira)
app.post('/api/withdraw', async (req, res) => {
try {
const { username, amount, destinationAddress } = req.body;

if (!amount || amount <= 0 || !destinationAddress) {
return res.status(400).json({ success: false, error: 'Dados de saque incompletos.' });
}

console.log(`A processar saque real para ${username}, montante: €${amount}, destino: ${destinationAddress}`);

const response = await fetch(`${NOWPAYMENTS_API_URL}/payout`, {
method: 'POST',
headers: {
'x-api-key': NOWPAYMENTS_API_KEY,
'Content-Type': 'application/json'
},
body: JSON.stringify({
withdrawals: [
{
address: destinationAddress,
currency: 'usdttrc20',
amount: amount
}
]
})
});

const data = await response.json();
console.log('Resposta do NOWPayments (Payout):', data);

if (response.ok) {
return res.json({
success: true,
message: `Saque de €${amount} processado com sucesso para a carteira ${destinationAddress}!`
});
} else {
return res.status(500).json({ success: false, error: data.message || 'Falha ao processar o payout no NOWPayments.' });
}

} catch (error) {
console.error('Erro no servidor /api/withdraw:', error);
return res.status(500).json({ success: false, error: 'Erro interno ao processar o saque.' });
}
});

// 3. ENDPOINT WEBHOOK IPN (Para recetores globais)
app.post('/api/ipn', (req, res) => {
console.log('Notificação IPN recebida do NOWPayments:', req.body);
res.status(200).send('IPN recebido com sucesso');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
console.log(`Servidor backend a correr na porta ${PORT}`);
});
