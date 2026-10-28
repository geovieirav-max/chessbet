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
        
        // 1. VALIDAÇÃO LOCAL: Verifica se o valor é válido e maior que zero
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Saldo insuficiente ou valor inválido' 
            });
        }
        
        // CORRIGIDO: Endpoint oficial correto da API da NOWPayments
        const response = await axios.post('https://api.nowpayments.io/v1/payment', {
            price_amount: parsedAmount,
            price_currency: 'eur', // Moeda base da plataforma (€)
            pay_currency: 'usdttrc20', // Criptomoeda padrão para pagamento (USDT na rede TRC20)
            order_id: `chessbet_${Date.now()}`,
            order_description: `Depósito na conta ChessBet Global de ${userEmail || 'Utilizador'}`,
            success_url: 'https://chessbet-ten.vercel.app/', // Atualizado para o teu link real da Vercel
            cancel_url: 'https://chessbet-ten.vercel.app/'  // Atualizado para o teu link real da Vercel
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
        
        // 2. CAPTURA INTELIGENTE: Se a NOWPayments rejeitar o valor por regras deles (ex: abaixo do mínimo da cripto)
        const apiErrorMessage = error.response?.data?.message || '';
        if (apiErrorMessage.includes('amount') || error.response?.status === 400) {
            return res.status(400).json({ 
                success: false, 
                error: 'Saldo insuficiente ou valor inválido' 
            });
        }

        // Erros reais de conexão ou queda do servidor externo
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao conectar ao servidor de pagamento.' 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor ChessBet a correr na porta ${PORT}`));
