const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const muteButton = document.getElementById('mute-button');

const bgMusic = document.getElementById('bg-music');
const clickSound = document.getElementById('click-sound');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let isMuted = false;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
  [0, 4, 8], [2, 4, 6]             // Diagonal
];

// Start background music on page load
window.onload = () => {
  bgMusic.volume = 0.3; // Set volume level
  bgMusic.play().catch(() => console.log("Auto-play blocked, user must interact first."));
};

// Handle mute/unmute
muteButton.addEventListener('click', () => {
  if (isMuted) {
    bgMusic.play();
    muteButton.textContent = '🔊 Mute';
  } else {
    bgMusic.pause();
    muteButton.textContent = '🔇 Unmute';
  }
  isMuted = !isMuted;
});

function handleCellClick(event) {
  const cell = event.target;
  const cellIndex = cell.getAttribute('data-index');

  if (board[cellIndex] !== '' || !gameActive) return;

  if (!isMuted) clickSound.play(); // Play click sound

  updateCell(cell, cellIndex);
  checkResult();
}

function updateCell(cell, index) {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken');
}

function checkResult() {
  const winner = checkWin();

  if (winner) {
    statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
    highlightWinningCells(winner);
    gameActive = false;
  } else if (board.includes('') === false) {
    statusText.textContent = "It's a Draw! 🤝";
    gameActive = false;
  } else {
    switchPlayer();
  }
}

function checkWin() {
  return winningConditions.find(condition => {
    const [a, b, c] = condition;
    return board[a] === currentPlayer &&
           board[a] === board[b] &&
           board[a] === board[c];
  });
}

function highlightWinningCells(winningCondition) {
  winningCondition.forEach(index => {
    cells[index].style.animation = "winEffect 0.6s ease-in-out infinite alternate";
  });
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player X's Turn`;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
    cell.style.animation = '';
  });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
