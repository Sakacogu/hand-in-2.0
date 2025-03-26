const board = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const xColorPicker = document.getElementById('x-color-picker');
const oColorPicker = document.getElementById('o-color-picker');
const boardStyleSelect = document.getElementById('board-style-select');
const xSymbolInput = document.getElementById('x-symbol');
const oSymbolInput = document.getElementById('o-symbol');
const crazyButton = document.getElementById('crazy-button');

const initialStatusText = statusElement.textContent;

let currentPlayer = 'O';
const gameBoard = Array(9).fill(null);
const cells = [];
let gameOver = false;
let lastWinner = null;

const symbolColors = {
    'X': '#000000',
    'O': '#000000'
};

const customSymbols = {
    'X': xSymbolInput.value || 'X',
    'O': oSymbolInput.value || 'O'
};

const WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function createBoard() {
    for (let index = 0; index < 9; index++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.id = `cell-${index}`;
      cell.addEventListener('click', () => handleClick(index));
      board.appendChild(cell);
      cells.push(cell);
    }
}

function updateStatusMessage() {
  if (document.body.classList.contains('crazy')) {
    const wrongPlayer = currentPlayer === 'O' ? 'X' : 'O';
    statusElement.textContent = `Players turn: ${customSymbols[wrongPlayer]}`;
  } else {
    statusElement.textContent = `Players turn: ${customSymbols[currentPlayer]}`;
  }
}

updateStatusMessage();

function handleClick(index) {
    if (gameOver || gameBoard[index] !== null) return;
    
    gameBoard[index] = currentPlayer;
    cells[index].textContent = customSymbols[currentPlayer];
    cells[index].style.color = symbolColors[currentPlayer];
    
    const crazyMode = document.body.classList.contains('crazy');

    if (crazyMode) {
      const effectChance = Math.random();
      if (effectChance < 0.3) {
        cells[index].style.visibility = 'hidden';
      } else if (effectChance < 0.7) {
        const offsetX = Math.floor(Math.random() * 61) - 30; 
        const offsetY = Math.floor(Math.random() * 61) - 30;
        cells[index].style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      } else {
        cells[index].style.transform = '';
      }
    } else {
      cells[index].style.transform = '';
      cells[index].style.visibility = 'visible';
    }
    
    if (checkWinner()) {
      if (!crazyMode) {
        gameOver = true;
        statusElement.textContent = `Player ${customSymbols[currentPlayer]} wins!`;
        lastWinner = currentPlayer;
        return;
      } else {
        gameOver = true;
        const winner = currentPlayer === 'O' ? 'X' : 'O';
        statusElement.textContent = `Player ${customSymbols[winner]} wins!`;
        lastWinner = winner;
        return;
      }
    }

    if (!gameBoard.includes(null)) {
      gameOver = true;
      statusElement.textContent = crazyMode
        ? "It's a draw!"
        : "It's a draw!";
      lastWinner = null;
      return;
    }
    
    if (crazyMode) {
      const skipTurnProbability = 0.2;
      if (Math.random() < skipTurnProbability) {
        statusElement.textContent = `${customSymbols[currentPlayer]}!`;
        return;
      }
    }
    
    currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
    updateStatusMessage();
}

function checkWinner() {
    for (const pattern of WIN_PATTERNS) {
      const [a, b, c] = pattern;
      if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
        return true;
      }
    }
    return false;
}

function resetGame() {
    for (let i = 0; i < gameBoard.length; i++) {
      gameBoard[i] = null;
      cells[i].textContent = '';
      cells[i].style.color = '';
      cells[i].style.transform = '';
      cells[i].style.visibility = 'visible'; 
    }

    if (lastWinner === null) {
      currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
    }

    gameOver = false;
    lastWinner = null;
    updateStatusMessage();
}

createBoard();

if (xColorPicker) {
    xColorPicker.addEventListener('input', (e) => {
      symbolColors['X'] = e.target.value;
    });
}
if (oColorPicker) {
    oColorPicker.addEventListener('input', (e) => {
      symbolColors['O'] = e.target.value;
    });
}

if (xSymbolInput) {
    xSymbolInput.addEventListener('input', (e) => {
      customSymbols['X'] = e.target.value.trim() || 'X';
    });
}
if (oSymbolInput) {
    oSymbolInput.addEventListener('input', (e) => {
      customSymbols['O'] = e.target.value.trim() || 'O';
    });
}

if (boardStyleSelect) {
    boardStyleSelect.addEventListener('change', (e) => {
      const selectedStyle = e.target.value;
      board.classList.remove('classic', 'modern', 'fancy', 'dark', 'neon');
      board.classList.add(selectedStyle);
    });
}

resetButton.addEventListener('click', resetGame);

const headerH1 = document.querySelector('#gameArea header h1');

if (crazyButton) {
  crazyButton.addEventListener('click', () => {
    document.body.classList.toggle('crazy');
    if (document.body.classList.contains('crazy')) {
      crazyButton.textContent = 'Go Back';
      headerH1.textContent = 'ToeTacTic!>:)';
    } else {
      crazyButton.textContent = 'Go Crazy!';
      headerH1.textContent = 'TicTacToe!';
    }
    updateStatusMessage();
  });
}