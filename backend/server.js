const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_EMAIL = process.env.NOWPAYMENTS_EMAIL;
const NOWPAYMENTS_PASSWORD = process.env.NOWPAYMENTS_PASSWORD;
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// Função para obter o JWT Token exigido pelos Payouts
async function getNOWPaymentsToken() {
const response = await fetch(`${NOWPAYMENTS_API_URL}/auth`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
email: NOWPAYMENTS_EMAIL,
password: NOWPAYMENTS_PASSWORD
})
});
const data = await response.json();
if (data.token) {
return data.token;
} else {
throw new Error(data.message || 'Falha ao autenticar no NOWPayments.');
}
}

// 1. ENDPOINT DE DEPÓSITO
app.post('/api/deposit', async (req, res) => {
try {
const { username, amount } = req.body;
if (!amount || amount <= 0) {
return res.status(400).json({ success: false, error: 'Montante inválido.' });
}

const response = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
method: 'POST',
headers: {
'x-api-key': NOWPAYMENTS_API_KEY,
'Content-Type': 'application/json'
},
body: JSON.stringify({
price_amount: amount,
price_currency: 'eur',
pay_currency: 'usdtbsc',
order_id: `dep_${username}_${Date.now()}`,
order_description: `Depósito ChessBet - ${username}`
})
});

const data = await response.json();
if (response.ok && data.invoice_url) {
return res.json({ success: true, invoice_url: data.invoice_url });
} else {
return res.status(500).json({ success: false, error: data.message || 'Erro ao gerar fatura.' });
}
} catch (error) {
return res.status(500).json({ success: false, error: 'Erro interno no servidor.' });
}
});

// 2. ENDPOINT DE SAQUE (Com autenticação Bearer JWT)
app.post('/api/withdraw', async (req, res) => {
try {
const { username, amount, destinationAddress } = req.body;

if (!amount || amount <= 0 || !destinationAddress) {
return res.status(400).json({ success: false, error: 'Dados de saque incompletos.' });
}

console.log(`Obtendo token de autenticação JWT para payout...`);
const token = await getNOWPaymentsToken();

console.log(`A processar saque real para ${username}, montante: €${amount}`);

const response = await fetch(`${NOWPAYMENTS_API_URL}/payout`, {
method: 'POST',
headers: {
'x-api-key': NOWPAYMENTS_API_KEY,
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json'
},
body: JSON.stringify({
withdrawals: [
{
address: destinationAddress,
currency: 'usdtbsc',
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
return res.status(500).json({ success: false, error: error.message || 'Erro interno ao processar o saque.' });
}
});

// 3. WEBHOOK IPN
app.post('/api/ipn', (req, res) => {
res.status(200).send('IPN recebido com sucesso');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
console.log(`Servidor backend a correr na porta ${PORT}`);
});

