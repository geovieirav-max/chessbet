const BACKEND_URL = 'https://chessbet-backend.onrender.com';

// Função de Depósito REAL (Abre o Checkout do NOWPayments)
async function handleDeposit(event) {
if (event) event.preventDefault();

const amountInput = document.getElementById('depositAmount');
const amount = amountInput ? parseFloat(amountInput.value) : 0;

if (!amount || amount <= 0) {
alert('Por favor, insira um valor válido para depósito.');
return;
}

try {
const response = await fetch(`${BACKEND_URL}/api/deposit`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
username: typeof currentUser !== 'undefined' ? currentUser : 'Geovane',
amount: amount
})
});

const data = await response.json();

if (response.ok && data.success && data.invoice_url) {
alert('A redirecionar para a página de pagamento seguro do NOWPayments...');
// ABRIR A PÁGINA REAL DE PAGAMENTO DO NOWPAYMENTS
window.open(data.invoice_url, '_blank');
try { closeModal('depositModal'); } catch(e) {}
} else {
alert('Erro no NOWPayments: ' + (data.error || 'Não foi possível gerar a fatura real.'));
}
} catch (error) {
console.error('Erro de ligação:', error);
alert('Erro ao comunicar com o servidor do Render.');
}
}

// Função de Saque REAL (Chama a API de Payouts)
async function handleWithdraw(event) {
if (event) event.preventDefault();

const amountInput = document.getElementById('withdrawAmount');
const addressInput = document.getElementById('withdrawAddress');

const amount = amountInput ? parseFloat(amountInput.value) : 0;
const destinationAddress = addressInput ? addressInput.value.trim() : '';

if (!amount || amount <= 0 || !destinationAddress) {
alert('Por favor, preencha o montante e a carteira de destino (ex: USDT TRC20).');
return;
}

try {
const response = await fetch(`${BACKEND_URL}/api/withdraw`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
username: typeof currentUser !== 'undefined' ? currentUser : 'Geovane',
amount: amount,
destinationAddress: destinationAddress
})
});

const data = await response.json();

if (response.ok && data.success) {
alert(`Sucesso! Saque de €${amount} enviado para a carteira ${destinationAddress}`);
try { closeModal('withdrawModal'); } catch(e) {}
} else {
alert('Erro no Payout: ' + (data.error || 'Falha ao processar o saque real.'));
}
} catch (error) {
console.error('Erro de ligação:', error);
alert('Erro ao comunicar com o servidor.');
}
}

// Ligar as funções aos botões do portal
document.addEventListener('DOMContentLoaded', () => {
const depositForm = document.querySelector('#depositModal form');
if (depositForm) {
depositForm.onsubmit = handleDeposit;
}

const withdrawForm = document.querySelector('#withdrawModal form');
if (withdrawForm) {
withdrawForm.onsubmit = handleWithdraw;
}
});

