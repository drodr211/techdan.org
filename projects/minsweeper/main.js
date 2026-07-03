let x = 10;
let y = 10;
const grid = Array.from({ length: y }, () => Array(x).fill(0));
const revealed = Array.from({ length: y }, () => Array(x).fill(""));
const flagged = Array.from({ length: y }, () => Array(x).fill(""));
const getRandomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

//// --##  ASSIGN BOMB AT A RATE  ##--
for (let i = 0; i < y; i++) for (let j = 0; j < x; j++) if (getRandomRange(0, 100) < 12) grid[i][j] = "X";

// --##  COUNT BOMBS, and place COUNT in GRID  ##--
for (let i = 0; i < y; i++) {
    for (let j = 0; j < x; j++) {
        if(grid[i][j] != "X") {
            let count = 0;
            if(i-1 >= 0) {
                if(j-1 >= 0 && grid[i-1][j-1] == "X" ) count++;
                if(j+1 < x && grid[i-1][j+1] == "X" ) count++;
                if (grid[i-1][j] == "X" ) count++;
            }
            if(i+1 < y) {
                if(j-1 >= 0 && grid[i+1][j-1] == "X" ) count++;
                if(j+1 < x && grid[i+1][j+1] == "X" ) count++;
                if (grid[i+1][j] == "X" ) count++;
            }
            if(j-1 >= 0 && grid[i][j-1] == "X" ) count++;
            if(j+1 < x && grid[i][j+1] == "X" ) count++;
            grid[i][j] = count;
        }
    }
}

// --##  RENDER BOARD  ##--
let board = document.getElementById("board");
for (let i = 0; i < y; i++) {
    let row = document.createElement("div");
    row.id = i;
    row.className = "row";
    for (let j = 0; j < x; j++) {
        let cell = document.createElement("div");
        cell.dataset.y = i;
        cell.dataset.x = j;
        cell.classList.add('cell');
        if(grid[i][j] != "X") {
            cell.addEventListener('click', (event) => {
                event.currentTarget.style.background = '#616161';
                if(grid[i][j] > 0) cell.innerHTML = grid[i][j];
                reveal(Number(event.currentTarget.dataset.x), Number(event.currentTarget.dataset.y));
                if(checkWin() == true) alert("you win");
            });
        }
        else cell.addEventListener('click', (event) => { location.reload(); });
        cell.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            if(flagged[i][j] == "F") {
                cell.innerHTML = "";
                flagged[i][j] = "";
            }
            else {
                cell.innerHTML = "🚩";
                flagged[i][j] = "F";
            }
            
            if(checkWin() == true) alert("you win");
        });
        row.appendChild(cell);
    }
    board.appendChild(row);
}

// --##  REVEAL ALL ADJACENT TILES THAT ARE 0'S THEN 1 MORE  ##--
function reveal(j, i) {
    if(revealed[i][j] == "R" || grid[i][j] == "X") return;
    revealed[i][j] = "R";

    let cell = document.querySelector(`[data-x="${j}"][data-y="${i}"]`);
    cell.style.background = '#616161';

    if(grid[i][j] > 0) { cell.innerHTML = grid[i][j]; return;}

    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx == 0 && dy == 0) continue;

            let jx = j + dx; let iy = i + dy;
            if (jx > -1 && jx < x && iy >-1 && iy < y) reveal(jx, iy);
        }
    }
}


// --##  CHECK WIN - all bombs flagged or all non-bombs revealed  ##--
function checkWin() {
    let win = true;
    for(let i = 0; i < y; i++) {
        for(let j = 0; j < x; j++) {
            if(grid[i][j] != "X" && revealed[i][j] != "R" ) win = false;
            if(grid[i][j] == "X" && flagged[i][j] != "F") win = false;
        }
    }
    return win;
}