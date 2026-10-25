// ChessBet Global - Sistema Completo de Xadrez e Torneios
document.addEventListener("DOMContentLoaded", () => {
// Injetar estilos CSS modernos diretamente para o sistema de xadrez
const style = document.createElement('style');
style.innerHTML = `
.chessbet-container { font-family: system-ui, sans-serif; background-color: #020617; color: #f8fafc; min-height: 100vh; padding: 20px; display: flex; flex-direction: column; align-items: center; }
.chess-card { background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
.chess-board-grid { display: grid; grid-template-columns: repeat(8, 1fr); width: 380px; height: 380px; border: 3px solid #1e293b; border-radius: 8px; overflow: hidden; }
.chess-square { display: flex; align-items: center; justify-content: center; font-size: 38px; cursor: pointer; user-select: none; transition: background 0.2s; }
.square-light { background-color: #334155; color: #f8fafc; }
.square-dark { background-color: #1e293b; color: #94a3b8; }
.chess-btn { background-color: #10b981; color: #020617; font-weight: bold; padding: 10px 16px; border-radius: 10px; border: none; cursor: pointer; transition: background 0.2s; }
.chess-btn:hover { background-color: #059669; }
.chess-input { background-color: #020617; border: 1px solid #1e293b; color: white; padding: 8px 12px; border-radius: 8px; outline: none; }
.chess-input:focus { border-color: #10b981; }
`;
document.head.appendChild(style);

// Renderizar interface principal se existir um contentor dedicado
const appContainer = document.getElementById('chessbet-app') || document.body;

const wrapper = document.createElement('div');
wrapper.className = 'chessbet-container';
wrapper.innerHTML = `
<header style="width: 100%; max-width: 900px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 16px;">
<div>
<h1 style="font-size: 24px; font-weight: bold; color: #10b981; margin: 0;">ChessBet Global</h1>
<p style="font-size: 13px; color: #94a3b8; margin: 4px 0 0 0;">Plataforma de Xadrez, Torneios & Prémios Automáticos</p>
</div>
<div class="chess-card" style="padding: 8px 16px; display: flex; gap: 12px; align-items: center;">
<span style="font-size: 14px; font-weight: 600;">Geovane Andrade</span>
<span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold;">ELO: 1350</span>
</div>
</header>

<div style="display: grid; grid-template-columns: 1fr 340px; gap: 24px; width: 100%; max-width: 900px;">
<!-- Secção do Tabuleiro -->
<div class="chess-card" style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
<div style="display: flex; justify-between; width: 100%; align-items: center;">
<span style="font-size: 13px; color: #10b981; font-weight: 600;" id="game-status">Vez das Brancas</span>
<span style="font-size: 12px; color: #94a3b8;">Análise do Portal: <strong style="color: #10b981;" id="eval-score">85 pts</strong></span>
</div>

<div id="chessboard" class="chess-board-grid"></div>

<button class="chess-btn" id="new-game-btn" style="width: 100%;">Nova Partida / Reiniciar</button>
</div>

<!-- Secção lateral: Torneios & Chat -->
<div style="display: flex; flex-direction: column; gap: 20px;">
<div class="chess-card">
<h3 style="font-size: 14px; font-weight: bold; color: #f59e0b; margin-top: 0; margin-bottom: 12px;">🏆 Torneios Ativos (Top 3)</h3>
<div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
<div style="display: flex; justify-between; background: #020617; padding: 8px; border-radius: 6px; border: 1px solid #1e293b;">
<span>1. MestreXadrez</span>
<strong style="color: #10b981;">50 USDT</strong>
</div>
<div style="display: flex; justify-between; background: #020617; padding: 8px; border-radius: 6px; border: 1px solid #1e293b;">
<span>2. Geovane Andrade</span>
<strong style="color: #10b981;">30 USDT</strong>
</div>
<div style="display: flex; justify-between; background: #020617; padding: 8px; border-radius: 6px; border: 1px solid #1e293b;">
<span>3. Strategista</span>
<strong style="color: #10b981;">20 USDT</strong>
</div>
</div>
</div>

<div class="chess-card" style="flex: 1; display: flex; flex-direction: column;">
<h3 style="font-size: 14px; font-weight: bold; color: #f8fafc; margin-top: 0; margin-bottom: 12px;">💬 Chat da Partida</h3>
<div id="chat-messages" style="flex: 1; background: #020617; border: 1px solid #1e293b; border-radius: 8px; height: 120px; overflow-y: auto; padding: 8px; font-size: 11px; margin-bottom: 8px; color: #94a3b8;">
<div><strong style="color: #10b981;">Sistema:</strong> Partida iniciada com sucesso. Boa sorte!</div>
</div>
<div style="display: flex; gap: 6px;">
<input type="text" id="chat-input" class="chess-input" style="flex: 1; font-size: 12px;" placeholder="Escrever mensagem...">
<button class="chess-btn" id="send-chat" style="padding: 8px 12px; font-size: 12px;">Enviar</button>
</div>
</div>
</div>
</div>
`;

if (!document.getElementById('chessbet-app')) {
appContainer.appendChild(wrapper);
}

// Lógica simples de renderização visual do tabuleiro de xadrez
const boardElement = document.getElementById('chessboard');
const initialBoard = [
['♜','♞','♝','♛','♚','♝','♞','♜'],
['♟','♟','♟','♟','♟','♟','♟','♟'],
['','','','','','','',''],
['','','','','','','',''],
['','','','','','','',''],
['','','','','','','',''],
['♙','♙','♙','♙','♙','♙','♙','♙'],
['♖','♘','♗','♕','♔','♗','♘','♖']
];

function renderBoard() {
boardElement.innerHTML = '';
initialBoard.forEach((row, rIdx) => {
row.forEach((piece, cIdx) => {
const square = document.createElement('div');
const isDark = (rIdx + cIdx) % 2 === 1;
square.className = `chess-square ${isDark ? 'square-dark' : 'square-light'}`;
square.innerText = piece;
boardElement.appendChild(square);
});
});
}
renderBoard();

// Evento do botão de reiniciar
document.getElementById('new-game-btn').addEventListener('click', () => {
alert('Partida reiniciada com sucesso! Pronto para novos lances.');
});

// Evento do Chat
document.getElementById('send-chat').addEventListener('click', () => {
const input = document.getElementById('chat-input');
if(!input.value.trim()) return;
const chatBox = document.getElementById('chat-messages');
chatBox.innerHTML += `<div><strong style="color: #f59e0b;">Geovane:</strong> ${input.value}</div>`;
input.value = '';
chatBox.scrollTop = chatBox.scrollHeight;
});
});
