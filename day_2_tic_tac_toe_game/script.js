const cells = Array.from(document.querySelectorAll(".cell"));
const turnText = document.getElementById("turnText");
const scoreText = document.getElementById("scoreText");
const restartBtn = document.getElementById("restartBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");

let board = Array(9).fill("");
let current = "X";
let gameOver = false;

let score = { X: 0, O: 0, D: 0 };

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function setTurnText() {
  turnText.textContent = gameOver ? "Game Over" : `Turn: ${current}`;
}

function setScoreText() {
  scoreText.textContent = `Score — X: ${score.X} | O: ${score.O} | Draws: ${score.D}`;
}

function checkWinner() {
  for (const line of WIN_LINES) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

function isDraw() {
  return board.every(v => v !== "");
}

function disableBoard() {
  cells.forEach(btn => btn.disabled = true);
}

function enableBoard() {
  cells.forEach(btn => btn.disabled = false);
}

function highlightWin(line) {
  line.forEach(i => cells[i].classList.add("win"));
}

function clearHighlights() {
  cells.forEach(btn => btn.classList.remove("win"));
}

function endGame(message) {
  gameOver = true;
  turnText.textContent = message;
  disableBoard();
}

function playAt(i) {
  if (gameOver) return;
  if (board[i]) return;

  board[i] = current;
  cells[i].textContent = current;

  const result = checkWinner();
  if (result) {
    highlightWin(result.line);
    score[result.winner] += 1;
    setScoreText();
    endGame(`Winner: ${result.winner}`);
    return;
  }

  if (isDraw()) {
    score.D += 1;
    setScoreText();
    endGame("Draw!");
    return;
  }

  current = current === "X" ? "O" : "X";
  setTurnText();
}

function restartRound() {
  board = Array(9).fill("");
  current = "X";
  gameOver = false;
  cells.forEach(btn => btn.textContent = "");
  clearHighlights();
  enableBoard();
  setTurnText();
}

function resetScore() {
  score = { X: 0, O: 0, D: 0 };
  setScoreText();
  restartRound();
}

cells.forEach(btn => {
  btn.addEventListener("click", () => playAt(Number(btn.dataset.i)));
});

// Keyboard: 1–9 -> cells 0–8 (top-left to bottom-right)
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key >= "1" && key <= "9") {
    const idx = Number(key) - 1;
    playAt(idx);
  }
});

restartBtn.addEventListener("click", restartRound);
resetScoreBtn.addEventListener("click", resetScore);

setTurnText();
setScoreText();
