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
const renderGame = () => {
  game.innerHTML = ""; // Clear the game container
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");
      div.classList.add("cell");

      if (cell === "P") {
        const img = document.createElement("img");
        img.src = "img/char1.png"; // Path to your player character image
        img.alt = "Player";
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
      } else if (cell === "B") {
        const img = document.createElement("img");
        img.src = "img/box.png"; // Path to your box image
        img.alt = "Box";
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
      } else if (cell === "R") {
        const img = document.createElement("img");
        img.src = "img/river.png"; // Path to your river image
        img.alt = "River";
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
      } else if (cell === "|") {
        const img = document.createElement("img");
        img.src = "img/wall.png"; // Path to your wall image
        img.alt = "Wall";
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
      } else if (cell === "T") {
        div.classList.add("target");
      } else if (cell === "BT") {
        div.classList.add("bridge");
      } else if (cell === "L") {
        const img = document.createElement("img");
        img.src = "img/fire.png"; // Path to your fire image
        img.alt = "Fire";
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
      }

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
      if (
        beyondCell === " " ||
        beyondCell === "R" ||
        beyondCell === "L" ||
        beyondCell === "T"
      ) {
        // Push box
        if (beyondCell === "R") {
          grid[beyondY][beyondX] = "BT"; // Box turns river into bridge
        } else if (beyondCell === "L") {
          grid[beyondY][beyondX] = "BT"; // Box placed on light line
          // Remove light line when box is placed on it
          for (let x = 13; x <= 18; x++) {
            grid[7][x] = " "; // Remove all light cells
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
