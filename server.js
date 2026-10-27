const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Chave da NOWPayments fornecida
const NOWPAYMENTS_API_KEY = '52SQVDN-TH6M3TV-GP6XXDK-5P5NN9G';

// Rota para criar fatura de depósito real
app.post('/api/criar-pagamento', async (req, res) => {
    try {
        const { amount, userEmail } = req.body;
        
        const response = await axios.post('https://api.nowpayments.io/v1/payment', {
            price_amount: amount,
            price_currency: 'eur', // Moeda base da plataforma (€)
            pay_currency: 'usdttrc20', // Criptomoeda padrão para pagamento (USDT na rede TRC20)
            order_id: `chessbet_${Date.now()}`,
            order_description: `Depósito na conta ChessBet Global de ${userEmail || 'Utilizador'}`,
            success_url: 'https://chessbet-ten.vercel.app/',
            cancel_url: 'https://chessbet-ten.vercel.app/'
        }, {
            headers: {
                'x-api-key': NOWPAYMENTS_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        res.json({ 
            success: true, 
            payment_url: response.data.invoice_url || response.data.payment_url,
            payment_id: response.data.payment_id 
        });
    } catch (error) {
        console.error('Erro NOWPayments:', error.response?.data || error.message);
        res.status(500).json({ success: false, error: 'Erro ao comunicar com a NOWPayments.' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor ChessBet a correr na porta ${PORT}`));
