// Configuração do URL do Backend no Render
const BACKEND_URL = 'https://chessbet-backend.onrender.com';

// 1. Função de Depósito REAL (Abre a fatura do NOWPayments)
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
      alert('A redirecionar para o pagamento seguro via NOWPayments...');
      window.open(data.invoice_url, '_blank');
      try { closeModal('depositModal'); } catch(e) {}
    } else {
      alert('Erro no Depósito: ' + (data.error || 'Não foi possível gerar a fatura real.'));
    }
  } catch (error) {
    console.error('Erro de ligação ao servidor:', error);
    alert('Erro ao comunicar com o servidor do Render.');
  }
}

// 2. Função de Saque REAL (Sem simulações, comunica com o Payouts da NOWPayments)
async function handleWithdraw(event) {
  if (event) event.preventDefault();

  const amountInput = document.getElementById('withdrawAmount');
  const addressInput = document.getElementById('withdrawAddress');

  const amount = amountInput ? parseFloat(amountInput.value) : 0;
  const destinationAddress = addressInput ? addressInput.value.trim() : '';

  if (!amount || amount <= 0 || !destinationAddress) {
    alert('Por favor, preencha o montante e a carteira de destino (ex: carteira MetaMask 0x...).');
    return;
  }

  try {
    // Alerta informativo real enquanto o servidor processa a chamada
    alert('A processar o pedido de saque real... Aguarde a confirmação da rede.');

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

    // SÓ mostra sucesso se o backend confirmar que a API do NOWPayments aceitou a transação
    if (response.ok && data.success) {
      alert(`Sucesso! Saque de €${amount} processado para a carteira ${destinationAddress}.`);
      try { closeModal('withdrawModal'); } catch(e) {}
    } else {
      // Devolve o erro real (ex: saldo insuficiente no Custody, erro de rede, etc.)
      alert('Erro no Saque: ' + (data.error || 'Falha ao processar a transferência real.'));
    }
  } catch (error) {
    console.error('Erro de ligação ao servidor:', error);
    alert('Erro ao comunicar com o servidor do Render.');
  }
}

// 3. Associar as funções aos formulários e botões do portal
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
