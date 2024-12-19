const game = document.getElementById("game");
let isGameStarted = false;
let startTime = null; // Timer start time
let endTime = null; // Timer end time

let grid = Array(15)
  .fill(null)
  .map(() => Array(20).fill(" "));

const middleRow = Math.floor(grid.length / 2);
for (let i = 0; i < grid[0].length / 2; i++) {
  grid[middleRow][i] = "|";
}

for (let y = 9; y <= 11; y++) {
  for (let x = 0; x <= 6; x++) {
    grid[x][y] = "R";
  }
}

for (let x = 13; x <= 18; x++) {
  grid[7][x] = "L";
}
document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("intro").style.display = "none";
  isGameStarted = true;
  startTime = Date.now(); // Start the timer
  renderGame();
});

grid[3][2] = "P";
grid[2][4] = "B";
grid[4][4] = "W";
grid[3][1] = "B";
grid[3][6] = "B";

grid[12][9] = "T";
grid[13][5] = "K";

const renderGame = () => {
  game.innerHTML = "";
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");
      div.classList.add("cell");

      if (cell === "P") {
        const img = document.createElement("img");
        img.src = "img/char1.png";
        img.alt = "Player";
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
      } else if (cell === "B") {
        const img = document.createElement("img");
        img.src = "img/box.png";
        img.alt = "Box";
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
      } else if (cell === "R") {
        const img = document.createElement("img");
        img.src = "img/river.png";
        img.alt = "River";
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
      } else if (cell === "|") {
        const img = document.createElement("img");
        img.src = "img/wall.png";
        img.alt = "Wall";
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
      } else if (cell === "T") {
        const img = document.createElement("img");
        img.src = "img/cat.png";
        img.alt = "Cat";
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
      } else if (cell === "BT") {
        div.classList.add("bridge");
      } else if (cell === "L") {
        const img = document.createElement("img");
        img.src = "img/fire.png";
        img.alt = "Fire";
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
      } else if (cell === "W") {
        const img = document.createElement("img");
        img.src = "img/water.png";
        img.alt = "Water";
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
      } else if (cell === "K") {
        const img = document.createElement("img");
        img.src = "img/basket.png";
        img.alt = "Basket";
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
      }

      game.appendChild(div);
    });
  });
};
const movePlayer = (dx, dy) => {
  if (!isGameStarted) return;
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

  if (
    targetY < 0 ||
    targetY >= grid.length ||
    targetX < 0 ||
    targetX >= grid[0].length
  )
    return;

  const targetCell = grid[targetY][targetX];

  if (targetCell === " " || targetCell === "BT") {
    grid[playerY][playerX] = grid[playerY][playerX] === "T" ? "T" : " ";
    grid[targetY][targetX] = "P";
  } else if (targetCell === "T") {
    alert("You can't step on the target!");
  } else if (targetCell === "|") {
    alert("You can't cross the barrier!");
  } else if (targetCell === "B" || targetCell === "W" || targetCell == "K") {
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
        beyondCell === "T" ||
        beyondCell === "BT"
      ) {
        if (targetCell === "W") {
          if (beyondCell === "L") {
            clearFire();
          } else if (beyondCell == "R") {
            alert("OOPS! you push the water to the river! you lose!");
          } else {
            grid[beyondY][beyondX] = "W";
          }
        } else if (targetCell == "B") {
          if (beyondCell === "R") {
            grid[beyondY][beyondX] = "BT";
          } else {
            grid[beyondY][beyondX] = "B";
          }
        } else if (targetCell === "K") {
          if (beyondCell === "T") {
            grid[beyondY][beyondX] = "KT";
            endTime = Date.now(); // Stop the timer
            const elapsedTime = (endTime - startTime) / 1000;
            console.log(elapsedTime);
            alert("You successfully placed the basket on the cat!");
          } else if (beyondCell === " ") {
            grid[beyondY][beyondX] = "K";
          }
          grid[targetY][targetX] = "P";
          grid[playerY][playerX] = grid[playerY][playerX] === "T" ? "T" : " ";
        }

        grid[targetY][targetX] = "P";
        grid[playerY][playerX] = grid[playerY][playerX] === "T" ? "T" : " ";
      }
    }
  }

  renderGame();
};

const expandFire = () => {
  if (!isGameStarted) return;
  const newFirePositions = [];
  let catTouched = false;

  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "L") {
        // Randomly expand fire to adjacent grass cells
        const directions = [
          [0, -1], // Up
          [0, 1], // Down
          [-1, 0], // Left
          [1, 0], // Right
        ];
        directions.forEach(([dx, dy]) => {
          const newX = x + dx;
          const newY = y + dy;
          if (
            newX >= 0 &&
            newX < grid[0].length &&
            newY >= 0 &&
            newY < grid.length
          ) {
            if (grid[newY][newX] === "T") {
              // Fire touches the cat
              catTouched = true;
            } else if (grid[newY][newX] === " ") {
              // Fire expands to an empty cell
              newFirePositions.push([newY, newX]);
            }
          }
        });
      }
    });
  });

  newFirePositions.forEach(([y, x]) => {
    grid[y][x] = "L";
  });

  if (catTouched) {
    alert("You didn't save the cat on time! You lose!");
  }
  renderGame();
};

setInterval(expandFire, 5000);

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
const clearFire = () => {
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "L") {
        grid[y][x] = " ";
      }
    });
  });
};

renderGame();
