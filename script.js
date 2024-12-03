const game = document.getElementById("game");

// Define a 20x15 grid
let grid = Array(15)
  .fill(null)
  .map(() => Array(20).fill(" "));

// Add a restricted barrier line (left to middle only)
const middleRow = Math.floor(grid.length / 2);
for (let i = 0; i < grid[0].length / 2; i++) {
  grid[middleRow][i] = "|"; // Block the left half of the middle row
}

// Add river (dark blue rectangle)
for (let y = 9; y <= 11; y++) {
  for (let x = 0; x <= 6; x++) {
    grid[x][y] = "R"; // River cells
  }
}

// Add yellow light line
for (let x = 13; x <= 18; x++) {
  // Corrected length and alignment
  grid[7][x] = "L"; // Yellow light cells
}

// Add player and boxes (around the player)
grid[3][2] = "P"; // Player starting position
grid[2][4] = "B"; // Box above the player
grid[4][4] = "B"; // Box below the player
grid[3][1] = "B"; // Box to the left of the player
grid[3][6] = "B"; // Box on the right for variety

// Add targets and more boxes after the river
grid[12][9] = "T"; // Target below the barrier
grid[10][7] = "B"; // Box after river
grid[11][9] = "B"; // Box after river
grid[11][11] = "B"; // Box after river

// Align right-side elements
grid[11][14] = "B"; // Box on the right
grid[13][15] = "T"; // Target near the bottom right
grid[13][17] = "B"; // Another box near the right

const renderGame = () => {
  game.innerHTML = "";
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");
      div.classList.add("cell");
      if (cell === "P") div.classList.add("player");
      if (cell === "B") div.classList.add("box");
      if (cell === "T") div.classList.add("target");
      if (cell === "|") div.classList.add("barrier");
      if (cell === "R") div.classList.add("river");
      if (cell === "BT") div.classList.add("bridge");
      if (cell === "L") div.classList.add("light"); // Light line cells
      game.appendChild(div);
    });
  });
};

const movePlayer = (dx, dy) => {
  // Find the player position
  let playerX, playerY;
  grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (cell === "P") {
        playerX = x;
        playerY = y;
      }
    })
  );

  const targetX = playerX + dx;
  const targetY = playerY + dy;

  // Check bounds
  if (
    targetY < 0 ||
    targetY >= grid.length ||
    targetX < 0 ||
    targetX >= grid[0].length
  )
    return;

  // Check the target cell
  const targetCell = grid[targetY][targetX];

  if (targetCell === " " || targetCell === "BT") {
    // Move player
    grid[playerY][playerX] = grid[playerY][playerX] === "T" ? "T" : " "; // Keep target intact if player moves on it
    grid[targetY][targetX] = "P";
  } else if (targetCell === "T") {
    alert("You can't step on the target!");
  } else if (targetCell === "|") {
    alert("You can't cross the barrier!");
  } else if (targetCell === "B") {
    // Check the next cell beyond the box
    const beyondX = targetX + dx;
    const beyondY = targetY + dy;

    if (
      beyondY >= 0 &&
      beyondY < grid.length &&
      beyondX >= 0 &&
      beyondX < grid[0].length
    ) {
      const beyondCell = grid[beyondY][beyondX];
      if (beyondCell === " " || beyondCell === "R" || beyondCell === "T") {
        // Push box
        if (beyondCell === "R") {
          grid[beyondY][beyondX] = "BT"; // Box turns river into bridge
          // Remove light line when box is placed on river
          for (let x = 13; x <= 18; x++) {
            if (grid[7][x] === "L") {
              grid[7][x] = " "; // Remove light cells
            }
          }
        } else if (beyondCell === "T") {
          grid[beyondY][beyondX] = "BT"; // Box placed on target
          alert("You successfully placed the box!");
        } else {
          grid[beyondY][beyondX] = "B";
        }
        grid[targetY][targetX] = "P";
        grid[playerY][playerX] = grid[playerY][playerX] === "T" ? "T" : " "; // Keep target intact
      }
    }
  }

  renderGame();
};

// Event listener for arrow keys
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      movePlayer(0, -1);
      break;
    case "ArrowDown":
      movePlayer(0, 1);
      break;
    case "ArrowLeft":
      movePlayer(-1, 0);
      break;
    case "ArrowRight":
      movePlayer(1, 0);
      break;
  }
});

// Initial render
renderGame();
