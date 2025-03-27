const board = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const xColorPicker = document.getElementById('x-color-picker');
const oColorPicker = document.getElementById('o-color-picker');
const boardStyleSelect = document.getElementById('board-style-select');
const xSymbolInput = document.getElementById('x-symbol');
const oSymbolInput = document.getElementById('o-symbol');
const crazyButton = document.getElementById('crazy-button');
const headerH1 = document.querySelector('#gameArea header h1');

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let currentPlayer = 'O';
let gameStarted = false;
let gameOver = false;
let lastWinner = null;
const cells = [];
const gameBoard = Array(9).fill(null);
const winCount = { 'X': 0, 'O': 0 };

const symbolColors = {
  'X': '#000000',
  'O': '#000000'
};

const customSymbols = {
  'X': xSymbolInput.value || 'X',
  'O': oSymbolInput.value || 'O'
};

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
  const crazyMode = document.body.classList.contains('crazy');
  if (crazyMode) {
      const wrongPlayer = currentPlayer === 'O' ? 'X' : 'O';
      statusElement.textContent = `Players turn: ${customSymbols[wrongPlayer]}`;
  } else {
      statusElement.textContent = `Players turn: ${customSymbols[currentPlayer]}`;
  }
}

function handleClick(index) {
  if (gameOver || gameBoard[index] !== null) return;
    
  if (!document.body.classList.contains('crazy') && !gameStarted) {
      gameStarted = true;
      xSymbolInput.disabled = true;
      oSymbolInput.disabled = true;
  }
    
  gameBoard[index] = currentPlayer;
  cells[index].textContent = customSymbols[currentPlayer];
  cells[index].style.color = symbolColors[currentPlayer];
    
  const crazyMode = document.body.classList.contains('crazy');

  if (crazyMode) {
      cells[index].style.transform = '';
      cells[index].style.visibility = 'visible';
        
      const disappearChance = 0.2;
      const offsetChance = 0.3;
        
      const randomValue = Math.random();
        
      if (randomValue < disappearChance) {
          cells[index].style.visibility = 'hidden';
      } else if (randomValue < disappearChance + offsetChance) {
          const offsetX = Math.floor(Math.random() * 61) - 30; 
          const offsetY = Math.floor(Math.random() * 61) - 30;
          cells[index].style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
  } else {
      cells[index].style.transform = '';
      cells[index].style.visibility = 'visible';
  }
    
  if (checkWinner()) {
      gameOver = true;
      if (!crazyMode) {
          statusElement.textContent = `Player ${customSymbols[currentPlayer]} wins!`;
          lastWinner = currentPlayer;
          updateWinCounter(currentPlayer);
      } else {
          const winner = currentPlayer === 'O' ? 'X' : 'O';
          statusElement.textContent = `Player ${customSymbols[winner]} wins!`;
          lastWinner = winner;
          updateWinCounter(winner);
      }
      return;
  }

  if (!gameBoard.includes(null)) {
      gameOver = true;
      statusElement.textContent = "It's a draw!";
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
            const crazyMode = document.body.classList.contains('crazy');
            
            const winColor = crazyMode ? 'red' : 'lightgreen';
            
            cells[a].style.backgroundColor = winColor;
            cells[b].style.backgroundColor = winColor;
            cells[c].style.backgroundColor = winColor;
            
            if (crazyMode) {
                cells[a].style.visibility = 'visible';
                cells[b].style.visibility = 'visible';
                cells[c].style.visibility = 'visible';
            }
            
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
      cells[i].style.backgroundColor = '';
  }

  gameStarted = false;
    
  if (!document.body.classList.contains('crazy')) {
      xSymbolInput.disabled = false;
      oSymbolInput.disabled = false;
      customSymbols['X'] = xSymbolInput.value.trim() || 'X';
      customSymbols['O'] = oSymbolInput.value.trim() || 'O';
  }
    
  if (lastWinner === null) {
      currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
  }

  gameOver = false;
  lastWinner = null;
  updateStatusMessage();
}

function updateWinCounter(winner) {
  winCount[winner]++;
  const xWinsElem = document.getElementById('x-wins');
  const oWinsElem = document.getElementById('o-wins');
  if (xWinsElem && oWinsElem) {
      xWinsElem.textContent = winCount['X'];
      oWinsElem.textContent = winCount['O'];
  } else {
      console.error('Win counter elements not found!');
  }
}

function repositionWinCounter() {
  const winCounter = document.getElementById('win-counter');
  const gameArea = document.getElementById('gameArea');
  const header = gameArea.querySelector('header');
  const boardStyleContainer = document.getElementById('board-style-container');

  if (window.innerWidth < 768) {
      if (header.nextElementSibling !== winCounter) {
          gameArea.insertBefore(winCounter, header.nextElementSibling);
      }
  } else {
      if (!boardStyleContainer.contains(winCounter)) {
          boardStyleContainer.appendChild(winCounter);
      }
  }
}

createBoard();
updateStatusMessage();
xSymbolInput.disabled = false;
oSymbolInput.disabled = false;

resetButton.addEventListener('click', resetGame);

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
      if (!gameStarted || document.body.classList.contains('crazy')) {
          updateStatusMessage();
      }
  });
}

if (oSymbolInput) {
  oSymbolInput.addEventListener('input', (e) => {
      customSymbols['O'] = e.target.value.trim() || 'O';
      if (!gameStarted || document.body.classList.contains('crazy')) {
          updateStatusMessage();
      }
  });
}

if (boardStyleSelect) {
  boardStyleSelect.addEventListener('change', (e) => {
      const selectedStyle = e.target.value;
      board.classList.remove('classic', 'modern', 'fancy', 'dark', 'neon');
      board.classList.add(selectedStyle);
  });
}

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
      resetGame();
      updateStatusMessage();
  });
}

window.addEventListener('resize', repositionWinCounter);
window.addEventListener('load', repositionWinCounter);