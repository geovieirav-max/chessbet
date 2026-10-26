import crypto from 'crypto';

export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

try {
const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
const sigHeader = req.headers['x-nowpayments-sig'];

if (!ipnSecret || !sigHeader) {
return res.status(400).json({ error: 'Assinatura ou Secret em falta.' });
}

// Validação da assinatura IPN do NOWPayments
const sortedParams = sortObjectKeys(req.body);
const hmac = crypto.createHmac('sha512', ipnSecret);
hmac.update(JSON.stringify(sortedParams));
const signature = hmac.digest('hex');

if (signature !== sigHeader) {
console.warn('Tentativa de IPN com assinatura inválida.');
return res.status(400).json({ error: 'Assinatura inválida.' });
}

const paymentData = req.body;
const { payment_status, price_amount, order_id } = paymentData;
const ibanPessoal = process.env.MEU_IBAN_PESSOAL;

// Verificar se o pagamento foi concluído com sucesso na blockchain
if (payment_status === 'finished') {
const valorTotal = parseFloat(price_amount);
const comissaoPlataforma = valorTotal * 0.10; // 10% para ti
const saldoPartida = valorTotal * 0.90; // 90% para o prize pool do jogo

console.log(`[SUCESSO] Pagamento confirmado para a ordem: ${order_id}`);
console.log(`Valor Total: ${valorTotal}`);
console.log(`Comissão de 10% (${comissaoPlataforma}) direcionada para o registo do IBAN: ${ibanPessoal}`);
console.log(`Valor líquido para o jogo/pool: ${saldoPartida}`);

// TODO: Insere aqui a lógica para atualizar a base de dados do teu jogo (libertar o tabuleiro, creditar o utilizador, etc.)
}

return res.status(200).json({ status: 'ok' });
} catch (error) {
console.error('Erro ao processar IPN:', error);
return res.status(500).json({ error: 'Erro interno ao processar webhook.' });
}
}

// Função auxiliar exigida pelo NOWPayments para ordenar as chaves antes de verificar o HMAC
function sortObjectKeys(obj) {
return Object.keys(obj)
.sort()
.reduce((result, key) => {
result[key] = (obj[key] && typeof obj[key] === 'object') ? sortObjectKeys(obj[key]) : obj[key];
return result;
}, {});
}
