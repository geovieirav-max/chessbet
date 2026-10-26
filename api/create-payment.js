export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

try {
const { price_amount, price_currency, pay_currency, order_id } = req.body;
const apiKey = process.env.NOWPAYMENTS_API_KEY;

if (!apiKey) {
return res.status(500).json({ error: 'NOWPAYMENTS_API_KEY não configurada.' });
}

// Pedido à API do NOWPayments para criar o pagamento
const response = await fetch('https://api.nowpayments.io/v1/payment', {
method: 'POST',
headers: {
'x-api-key': apiKey,
'Content-Type': 'application/json',
},
body: JSON.stringify({
price_amount: price_amount || 10.0, // Valor da aposta/jogo
price_currency: price_currency || 'usd', // Moeda base (ex: USD)
pay_currency: pay_currency || 'btc', // Criptomoeda escolhida pelo utilizador (ex: BTC, USDT, ETH)
order_id: order_id || `chess_match_${Date.now()}`,
order_description: 'ChessBet Global - Aposta de Partida',
ipn_callback_url: `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api/ipn-callback`,
}),
});

const data = await response.json();

if (!response.ok) {
return res.status(response.status).json({ error: data.message || 'Erro ao criar pagamento no NOWPayments' });
}

return res.status(200).json(data);
} catch (error) {
console.error('Erro no create-payment:', error);
return res.status(500).json({ error: 'Erro interno no servidor.' });
}
}
