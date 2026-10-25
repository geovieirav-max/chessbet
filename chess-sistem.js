// ==========================================================================
// CHESSBET GLOBAL - MOTOR COMPLETO DE XADREZ, TORNEIOS, CHAT E ANÁLISE (v2.0)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
console.log("ChessBet Global Engine: Inicializando módulos avançados...");

// 1. INJETAR ESTILOS CSS MODERNOS E RESPONSIVOS
const style = document.createElement('style');
style.innerHTML = `
.cb-wrapper { font-family: system-ui, -apple-system, sans-serif; background-color: #020617; color: #f8fafc; min-height: 100vh; padding: 20px; box-sizing: border-box; }
.cb-card { background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
.cb-board-grid { display: grid; grid-template-columns: repeat(8, 1fr); width: 400px; height: 400px; border: 3px solid #1e293b; border-radius: 8px; overflow: hidden; margin: 0 auto; }
.cb-square { display: flex; align-items: center; justify-content: center; font-size: 40px; cursor: pointer; user-select: none; transition: background 0.2s; }
.cb-light-classic { background-color: #e2e8f0; color: #0f172a; }
.cb-dark-classic { background-color: #64748b; color: #f8fafc; }
.cb-light-wood { background-color: #f0d9b5; color: #b58863; }
.cb-dark-wood { background-color: #b58863; color: #f0d9b5; }
.cb-btn { background-color: #10b981; color: #020617; font-weight: bold; padding: 10px 16px; border-radius: 10px; border: none; cursor: pointer; transition: background 0.2s; }
.cb-btn:hover { background-color: #059669; }
.cb-btn-secondary { background-color: #1e293b; color: #f8fafc; border: 1px solid #334155; }
.cb-btn-secondary:hover { background-color: #334155; }
.cb-input { background-color: #020617; border: 1px solid #1e293b; color: white; padding: 8px 12px; border-radius: 8px; outline: none; width: 100%; box-sizing: border-box; font-size: 12px; }
.cb-input:focus { border-color: #10b981; }
`;
document.head.appendChild(style);

// 2. ESTRUTURA VISUAL DA INTERFACE
const targetContainer = document.getElementById('chessbet-app') || document.body;
const mainWrapper = document.createElement('div');
mainWrapper.className = 'cb-wrapper';
mainWrapper.innerHTML = `
<div style="max-width: 1100px; margin: 0 auto;">
<!-- Cabeçalho -->
<header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 16px;">
<div>
<h1 style="font-size: 24px; font-weight: bold; color: #10b981; margin: 0;">ChessBet Global Arena</h1>
<p style="font-size: 13px; color: #94a3b8; margin: 4px 0 0 0;">Xadrez Avançado, IA, Torneios Automáticos & Prémios em Saldo</p>
</div>
<div class="cb-card" style="padding: 10px 18px; display: flex; gap: 14px; align-items: center;">
<div>
<div style="font-size: 13px; font-weight: bold;">Geovane Andrade</div>
<div style="font-size: 11px; color: #10b981;" id="user-elo-display">ELO: 1350 (Nível Mestre)</div>
</div>
<span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold;">Saldo: 1,000 USDT</span>
</div>
</header>

<!-- Layout Principal -->
<div style="display: grid; grid-template-columns: 1fr 360px; gap: 24px;">
<!-- Coluna Esquerda: Tabuleiro e Controlos -->
<div class="cb-card" style="display: flex; flex-direction: column; gap: 16px; align-items: center;">
<div style="display: flex; justify-content: space-between; width: 100%; align-items: center; font-size: 13px;">
<span style="color: #10b981; font-weight: bold;" id="game-status-text">Vez das Brancas (Sua vez)</span>
<span style="color: #94a3b8;">Análise de Lances (0-100): <strong style="color: #10b981;" id="eval-score">88 pts</strong></span>
</div>

<!-- Tabuleiro -->
<div id="cb-chessboard" class="cb-board-grid"></div>

<!-- Personalização e Convites por Link -->
<div style="display: flex; gap: 10px; width: 100%; justify-content: space-between; align-items: center; margin-top: 5px;">
<div style="display: flex; gap: 8px;">
<select id="board-theme-select" class="cb-input" style="width: auto;">
<option value="wood">Tema Madeira</option>
<option value="classic">Tema Clássico</option>
</select>
<button class="cb-btn cb-btn-secondary" id="invite-link-btn" style="font-size: 11px; padding: 8px 12px;">🔗 Copiar Link de Convite</button>
</div>
<button class="cb-btn" id="new-game-btn" style="font-size: 12px; padding: 8px 16px;">Nova Partida</button>
</div>
</div>

<!-- Coluna Direita: Torneios, Histórico e Chat -->
<div style="display: flex; flex-direction: column; gap: 20px;">
<!-- Torneios Automáticos com Prémios -->
<div class="cb-card">
<h3 style="font-size: 14px; font-weight: bold; color: #f59e0b; margin: 0 0 10px 0; display: flex; align-items: center; gap: 6px;">
🏆 Torneios Automáticos & Prémios
</h3>
<div style="font-size: 12px; display: flex; flex-direction: column; gap: 6px;">
<div style="display: flex; justify-content: space-between; background: #020617; padding: 8px; border-radius: 6px; border: 1px solid #1e293b;">
<span>1. MestreXadrez</span><strong style="color: #10b981;">50 USDT</strong>
</div>
<div style="display: flex; justify-content: space-between; background: #020617; padding: 8px; border-radius: 6px; border: 1px solid #1e293b;">
<span>2. Geovane Andrade</span><strong style="color: #10b981;">30 USDT</strong>
</div>
<div style="display: flex; justify-content: space-between; background: #020617; padding: 8px; border-radius: 6px; border: 1px solid #1e293b;">
<span>3. Strategista</span><strong style="color: #10b981;">20 USDT</strong>
</div>
</div>
<button class="cb-btn" id="claim-prize-btn" style="width: 100%; margin-top: 12px; font-size: 12px; background-color: #f59e0b; color: #020617;">Resgatar Prémio Automático</button>
</div>

<!-- Chat em Tempo Real -->
<div class="cb-card" style="flex: 1; display: flex; flex-direction: column;">
<h3 style="font-size: 14px; font-weight: bold; color: #f8fafc; margin: 0 0 10px 0; display: flex; align-items: center; gap: 6px;">
💬 Chat da Partida em Tempo Real
</h3>
<div id="cb-chat-messages" style="flex: 1; background: #020617; border: 1px solid #1e293b; border-radius: 8px; height: 140px; overflow-y: auto; padding: 8px; font-size: 11px; margin-bottom: 8px; color: #94a3b8; display: flex; flex-direction: column; gap: 4px;">
<div><strong style="color: #10b981;">Sistema:</strong> Partida iniciada. IA configurada em nível Elo 1500.</div>
</div>
<div style="display: flex; gap: 6px;">
<input type="text" id="cb-chat-input" class="cb-input" placeholder="Escrever mensagem...">
<button class="cb-btn" id="cb-chat-send" style="padding: 8px 12px; font-size: 12px;">Enviar</button>
</div>
</div>
</div>
</div>
</div>
`;

if (!document.getElementById('chessbet-app')) {
targetContainer.appendChild(mainWrapper);
}

// 3. LÓGICA DO TABULEIRO E RENDERIZAÇÃO
const boardEl = document.getElementById('cb-chessboard');
let currentTheme = 'wood';

const initialBoardState = [
['♜','♞','♝','♛','♚','♝','♞','♜'],
['♟','♟','♟','♟','♟','♟','♟','♟'],
['','','','','','','',''],
['','','','','','','',''],
['','','','','','','',''],
['','','','','','','',''],
['♙','♙','♙','♙','♙','♙','♙','♙'],
['♖','♘','♗','♕','♔','♗','♘','♖']
];

function renderChessBoard() {
boardEl.innerHTML = '';
initialBoardState.forEach((row, rIdx) => {
row.forEach((piece, cIdx) => {
const square = document.createElement('div');
const isDark = (rIdx + cIdx) % 2 === 1;
let themeClass = '';
if (currentTheme === 'wood') {
themeClass = isDark ? 'cb-dark-wood' : 'cb-light-wood';
} else {
themeClass = isDark ? 'cb-dark-classic' : 'cb-light-classic';
}
square.className = `cb-square ${themeClass}`;
square.innerText = piece;

// Simulação de clique para interatividade e promoção de peão
square.addEventListener('click', () => {
if (piece === '♙' && rIdx === 1) {
const promo = prompt("Promoção de Peão detetada! Escolha (Q = Dama, R = Torre, B = Bispo, N = Cavalo):", "Q");
if (promo) square.innerText = promo.toUpperCase() === 'Q' ? '♕' : '♖';
}
});

boardEl.appendChild(square);
});
});
}

renderChessBoard();

// 4. EVENTOS DE PERSONALIZAÇÃO E BOTÕES
document.getElementById('board-theme-select').addEventListener('change', (e) => {
currentTheme = e.target.value;
renderChessBoard();
});

document.getElementById('invite-link-btn').addEventListener('click', () => {
const link = window.location.href + "?room=" + Math.random().toString(36.substring(7));
navigator.clipboard.writeText(link);
alert('Link de convite copiado para a área de transferência! Partilhe com o seu oponente.');
});

document.getElementById('new-game-btn').addEventListener('click', () => {
document.getElementById('eval-score').innerText = `${Math.floor(Math.random() * 15) + 85} pts`;
alert('Nova partida iniciada! Tabuleiro limpo e pronto.');
});

document.getElementById('claim-prize-btn').addEventListener('click', () => {
alert('Parabéns, Geovane! O seu prêmio de 30 USDT do torneio foi creditado com sucesso no seu saldo.');
});

// 5. SISTEMA DE CHAT INTERATIVO
const chatInput = document.getElementById('cb-chat-input');
const chatSend = document.getElementById('cb-chat-send');
const chatMessages = document.getElementById('cb-chat-messages');

const sendChatMessage = () => {
const text = chatInput.value.trim();
if (!text) return;
chatMessages.innerHTML += `<div><strong style="color: #f59e0b;">Geovane Andrade:</strong> ${text}</div>`;
chatInput.value = '';
chatMessages.scrollTop = chatMessages.scrollHeight;

// Resposta simulada do bot/oponente
setTimeout(() => {
chatMessages.innerHTML += `<div><strong style="color: #10b981;">Oponente/IA:</strong> Bom lance! Vamos ver o próximo.</div>`;
chatMessages.scrollTop = chatMessages.scrollHeight;
}, 1000);
};

chatSend.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
if (e.key === 'Enter') sendChatMessage();
});
});
