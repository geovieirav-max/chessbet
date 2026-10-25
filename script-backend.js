// Configuração do Backend no Render
const BACKEND_URL = 'https://chessbet-backend.onrender.com';

// Função de Depósito Automatizada
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

if (response.ok && data.success) {
alert(`Sucesso! ${data.message}`);
try { closeModal('depositModal'); } catch(e) {}
} else {
alert('Erro: ' + (data.error || 'Não foi possível processar o depósito.'));
}
} catch (error) {
console.error('Erro de ligação ao backend:', error);
alert('Erro ao ligar ao servidor backend no Render.');
}
}

// Função de Saque Automatizada
async function handleWithdraw(event) {
if (event) event.preventDefault();

const amountInput = document.getElementById('withdrawAmount') || document.querySelector('input[type="number"]');
const addressInput = document.getElementById('withdrawAddress') || document.querySelector('input[type="text"]');

const amount = amountInput ? parseFloat(amountInput.value) : 0;
const destinationAddress = addressInput ? addressInput.value.trim() : 'carteira_padrao';

if (!amount || amount <= 0) {
alert('Por favor, insira um montante válido para saque.');
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
alert(data.message);
try { closeModal('withdrawModal'); } catch(e) {}
} else {
alert('Erro no saque: ' + (data.error || 'Falha ao processar o pedido.'));
}
} catch (error) {
console.error('Erro de ligação ao backend:', error);
alert('Erro ao comunicar com o servidor backend.');
}
}

// Interceção automática dos formulários de depósito e saque se existirem na página
document.addEventListener('DOMContentLoaded', () => {
const depositForm = document.querySelector('form[onsubmit*="deposit"], #depositModal form');
if (depositForm && !depositForm.hasAttribute('data-bound')) {
depositForm.setAttribute('data-bound', 'true');
depositForm.addEventListener('submit', handleDeposit);
}

const withdrawForm = document.querySelector('form[onsubmit*="withdraw"], #withdrawModal form');
if (withdrawForm && !withdrawForm.hasAttribute('data-bound')) {
withdrawForm.setAttribute('data-bound', 'true');
withdrawForm.addEventListener('submit', handleWithdraw);
}
});
