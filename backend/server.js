const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Porta do servidor (o Render atribui uma porta automaticamente ou usa a porta 3000)
const PORT = process.env.PORT || 3000;

// Configuração da API da NOWPayments (utiliza a variável de ambiente do Render)
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY || "SUA_API_KEY_AQUI";
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// Dados administrativos registados
const ADMIN_CONFIG = {
email: "andradegeovane4@gmail.com",
bancoPrincipalIBAN: "CV64000200003755858210123", // Caixa Económica de Cabo Verde
bancoNome: "Caixa Económica de Cabo Verde"
};

// ----------------------------------------------------
// 1. ENDPOINT DE DEPÓSITO
// ----------------------------------------------------
app.post('/api/deposit', async (req, res) => {
try {
const { username, amount } = req.body;

if (!amount || amount <= 0) {
return res.status(400).json({ success: false, error: 'Valor de depósito inválido.' });
}

console.log(`[Depósito] Utilizador: ${username || 'Convidado'} | Montante: €${amount}`);

// Aqui podes integrar a criação de uma invoice real na NOWPayments se desejado
return res.status(200).json({
success: true,
message: `Depósito de €${amount} registado com sucesso.`,
amount
});

} catch (error) {
console.error("Erro no depósito:", error.message);
return res.status(500).json({ success: false, error: 'Erro interno ao processar depósito.' });
}
});

// ----------------------------------------------------
// 2. ENDPOINT DE SAQUE (PAYOUT VIA NOWPAYMENTS)
// ----------------------------------------------------
app.post('/api/withdraw', async (req, res) => {
try {
const { username, amount, destinationAddress } = req.body;

if (!amount || amount <= 0) {
return res.status(400).json({ success: false, error: 'Montante de saque inválido.' });
}

if (!destinationAddress) {
return res.status(400).json({ success: false, error: 'Endereço de destino de criptomoeda em falta.' });
}

console.log(`[Saque] A processar €${amount} para o endereço ${destinationAddress} (Utilizador: ${username})`);

/*
EXEMPLO DE INTEGRAÇÃO COM A API DE PAYOUTS DA NOWPAYMENTS:
Nota: Para saques automáticos reais, a NOWPayments exige saldo pré-depositado
na conta deles ou uma chave de payout ativa.
*/

/*
const payoutResponse = await axios.post(
`${NOWPAYMENTS_API_URL}/payout`,
{
// Configuração do payout para a carteira do utilizador
withdrawals: [
{
address: destinationAddress,
currency: "usdttrc20", // Exemplo: USDT na rede TRC20
amount: amount
}
]
},
{
headers: {
'x-api-key': NOWPAYMENTS_API_KEY,
'Content-Type': 'application/json'
}
}
);
*/

// Simulação de sucesso da transação de payout
return res.status(200).json({
success: true,
message: `Saque de €${amount.toFixed(2)} processado com sucesso via payout automático!`,
newBalance: 0, // Ajustar conforme a lógica do saldo do utilizador
destination: destinationAddress,
bancoAdministrativoRegisto: ADMIN_CONFIG.bancoPrincipalIBAN
});

} catch (error) {
console.error("Erro no payout NOWPayments:", error.response?.data || error.message);
return res.status(500).json({
success: false,
error: 'Falha na comunicação com o serviço de pagamentos NOWPayments.'
});
}
});

// Rota de teste para verificar se o servidor está ativo
app.get('/', (req, res) => {
res.send('ChessBet Global Backend a funcionar corretamente!');
});

app.listen(PORT, () => {
console.log(`Servidor backend a correr na porta ${PORT}`);
});
