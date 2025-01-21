const grid = document.getElementById("grid");
const status = document.getElementById("status");
const resetButton = document.getElementById("reset");

const rows = 6;
const cols = 7;
let currentPlayer = "green"; // Player 1: green, Player 2: yellow
let board = Array(rows).fill(null).map(() => Array(cols).fill(null));

// Create the game grid
function createGrid() {
  grid.innerHTML = ""; // Clear grid on reset
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      grid.appendChild(cell);
    }
  }
}

// Drop a piece in the selected column
function dropPiece(col) {
  for (let row = rows - 1; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = currentPlayer;
      const cell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );
      cell.classList.add(currentPlayer, "taken");
      return row;
    }
  }
  return null;
}

// Check for a win
function checkWin(row, col) {
  function checkDirection(direction) {
    let count = 1;
    let r = row + direction[0];
    let c = col + direction[1];
    while (
      r >= 0 &&
      r < rows &&
      c >= 0 &&
      c < cols &&
      board[r][c] === currentPlayer
    ) {
      count++;
      r += direction[0];
      c += direction[1];
    }
    return count;
  }

  const directions = [
    [[-1, 0], [1, 0]], // Vertical
    [[0, -1], [0, 1]], // Horizontal
    [[-1, -1], [1, 1]], // Diagonal (/)
    [[-1, 1], [1, -1]], // Diagonal (\)
  ];

  for (const [dir1, dir2] of directions) {
    if (checkDirection(dir1) + checkDirection(dir2) - 1 >= 4) {
      return true;
    }
  }
  return false;
}

// Handle cell clicks
grid.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cell") || e.target.classList.contains("taken")) {
    return;
  }

  const col = parseInt(e.target.dataset.col);
  const row = dropPiece(col);

  if (row !== null) {
    if (checkWin(row, col)) {
      status.textContent = `Player ${
        currentPlayer === "green" ? "1" : "2"
      } wins!`;
      grid.style.pointerEvents = "none";
      return;
    }

    // Check for a draw
    if (board.flat().every((cell) => cell !== null)) {
      status.textContent = "It's a draw!";
      return;
    }

    // Switch players
    currentPlayer = currentPlayer === "green" ? "yellow" : "green";
    status.textContent = `Player ${
      currentPlayer === "green" ? "1" : "2"
    }'s Turn (${currentPlayer === "green" ? "Green" : "Yellow"})`;
  }
});

// Reset the game
resetButton.addEventListener("click", () => {
  board = Array(rows).fill(null).map(() => Array(cols).fill(null));
  createGrid();
  currentPlayer = "green";
  status.textContent = "Player 1's Turn (Green)";
  grid.style.pointerEvents = "auto";
});

// Initialize the game
createGrid();
