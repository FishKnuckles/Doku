let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let originalGrid = [
    ["0", "0", "0", "0", "0", "0", "2", "0", "0"],
    ["0", "8", "0", "0", "0", "7", "0", "9", "0"],
    ["6", "0", "2", "0", "0", "0", "5", "0", "0"],
    ["0", "7", "0", "0", "6", "0", "0", "0", "0"],
    ["0", "0", "0", "9", "0", "1", "0", "0", "0"],
    ["0", "0", "0", "0", "2", "0", "0", "4", "0"],
    ["0", "0", "5", "0", "0", "0", "6", "0", "3"],
    ["0", "9", "0", "4", "0", "0", "0", "7", "0"],
    ["0", "0", "6", "0", "0", "0", "0", "0", "0"]
  ];
let grid = [
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"]
];
let solutionGrid = [
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"]
];

let gridSize;
let cellSize;
let xOffset;
let yOffset;
let canvasOffset;
let selectedCell = [-1, -1];
let previouslySelectedCell = [-1, -1];
let isCellSelected;

function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parent_bb = canvas.parentElement.getBoundingClientRect();
    window_bb = document.getElementsByTagName("body")[0].getBoundingClientRect();
    canvas.width = parent_bb.width;
    canvas.height = parent_bb.height;

    let min = Math.min(canvas.width, canvas.height);
    gridSize = min*0.8;
    cellSize = gridSize/9;
    xOffset = (canvas.width - gridSize)/2;
    yOffset = (canvas.height - gridSize)/2;
    canvasOffset = window_bb.width - canvas.width;

    ctx.fillStyle = "#271136";
    ctx.fillRect(xOffset, yOffset, gridSize, gridSize);
    if(isCellSelected){
        previouslySelectedCell = selectedCell;
        ctx.fillStyle = "#8E58B1";
        console.log(selectedCell[0], selectedCell[1]);
        ctx.fillRect(
            xOffset + selectedCell[0]*cellSize,
            yOffset + selectedCell[1]*cellSize,
            cellSize,
            cellSize
        );
    }
    else {
        ctx.fillStyle = "#271136";
        ctx.fillRect(
            xOffset + previouslySelectedCell[0]*cellSize,
            yOffset + previouslySelectedCell[1]*cellSize,
            cellSize,
            cellSize
        );
    }

    ctx.strokeStyle = "#57336E";

    ctx.lineWidth = 1;
    ctx.rect(xOffset, yOffset, gridSize, gridSize);
    ctx.stroke();
    for(let i = 0; i<10; i++) {
        ctx.beginPath();
        if(i%3 === 0 || i == 9) {
            ctx.lineWidth = 3;
        }
        else {
            ctx.lineWidth = 1;
        }
        
        ctx.moveTo(xOffset+cellSize*i, yOffset);
        ctx.lineTo(xOffset+cellSize*i, yOffset+gridSize);
        ctx.moveTo(xOffset, yOffset+cellSize*i);
        ctx.lineTo(xOffset+gridSize, yOffset+cellSize*i);
        ctx.stroke();
    }

    let x, y, xCenter, yCenter, fontSize;
    fontSize = cellSize/2;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "#B3B6C5";
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "0") continue;
            xCenter = (cellSize - ctx.measureText(grid[i][j]).width)/2;
            yCenter = (7/8*cellSize - fontSize)/2 + fontSize;
            x = xOffset+xCenter+cellSize*j;
            y = yOffset+yCenter+cellSize*i;
            // Check if the value exists in originalGrid
            if (grid[i][j] === originalGrid[i][j]) {
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.fillStyle = "#B489D9";
            }
            ctx.fillText(grid[i][j], x, y);
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = "#B3B6C5";
        }
    }
}

let possibleNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function initializeGrids() {
    checkIfValid(originalGrid);
    for(i = 0; i < grid.length; i++) {
        for(j = 0; j < grid.length; j++) {
            grid[i][j] = originalGrid[i][j];
            solutionGrid[i][j] = originalGrid[i][j];
        }
    }
}
initializeGrids();
solveSolutionGrid();

document.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (
        !(
        x >= xOffset &&
        x <= xOffset + gridSize &&
        y >= yOffset &&
        y <= yOffset + gridSize
        )
    ) {
        isCellSelected = false;
    }
    else {
        const selectedColumn = Math.floor((x - xOffset) / cellSize);
        const selectedRow = Math.floor((y - yOffset) / cellSize);
        isCellSelected = true;
        // Register the selected cell
        selectedCell = [selectedColumn, selectedRow];
    }
    // Redraw the canvas
    Draw();
    });

// Listen for keydown events on the document
document.addEventListener("keydown", input);

function input(event){
    if(selectedCell[0] != -1 && selectedCell[1] != -1) {
        if(originalGrid[selectedCell[1]][selectedCell[0]] == "0") {
            if(event.key >= "0" && event.key <= "9") {
                grid[selectedCell[1]][selectedCell[0]] = event.key;
                console.log(isValid(event.key,selectedCell[0],selectedCell[1],grid));
            }
        }
        else {
            window.alert("You can't overwrite originally written numbers");
        }
    }
    Draw();
}

Draw();

window.addEventListener("resize", Draw);

function hint() {
    if(selectedCell[0] != -1 && selectedCell[1] != -1) {
        if(grid[selectedCell[1]][selectedCell[0]] == "0") {
            grid[selectedCell[1]][selectedCell[0]] = solutionGrid[selectedCell[1]][selectedCell[0]];
            selectedCell = [-1, -1];
        }
    }
    else {
        function getRandomNumbers() {
            return Math.floor(Math.random() * 9);
        }
        let randomNum1 = getRandomNumbers().toString();
        let randomNum2 = getRandomNumbers().toString();
        console.log(randomNum1, randomNum2);
        if(grid[randomNum1][randomNum2] == "0") {
            grid[randomNum1][randomNum2] = solutionGrid[randomNum1][randomNum2];
        }
        else hint();
    }
    Draw();
}

function check() {
    const checkButton = document.getElementById("check");
    const originalButtonColor = "#8E58B1";
    if(checkIfValid(grid)) {
    checkButton.style.backgroundColor = "green";
    }
    else {
        checkButton.style.backgroundColor = "#C40000";
    }
     // Restore the original button color after 3 seconds
     setTimeout(() => {
        checkButton.style.backgroundColor = originalButtonColor;
    }, 1000);
}

function checkIfValid(passedGrid) {
    const rowSet = new Set();
    const colSet = new Set();
    const boxSet = new Set();

    for(let i = 0; i < passedGrid.length; i++) {
        const row = passedGrid[i];
        for(let j = 0; j < passedGrid.length; j++) {
            const rowNum = row[j];
            const colNum = passedGrid[j][i];
            const boxNum = passedGrid[3*Math.floor(i/3) + Math.floor(j/3)][((i*3)%9) + (j%3)];

            if(rowNum !== "0") {
                if(rowSet.has(rowNum))
                    return false;
                rowSet.add(rowNum);
            }
            if(colNum !== "0") {
                if (colSet.has(colNum))
                    return false;
                colSet.add(colNum);
            }
            if(boxNum !== "0") {
                if(boxSet.has(boxNum))
                    return false;
                boxSet.add(boxNum);
            }
        }
        rowSet.clear();
        colSet.clear();
        boxSet.clear();
    }
    
    return true;
}

function solveSolutionGrid() {
    let emptySpaces = [];
    
    for(let i = 0; i < solutionGrid.length; i++) {
        for(let j = 0; j < solutionGrid.length; j++) {
            if(solutionGrid[i][j] === "0") {
                emptySpaces.push({row: i, col: j});
            }
        }
    }
    function recurse(emptySpaceIndex) {
        if(emptySpaceIndex === emptySpaces.length){
            return true;
        }

        const {row, col} = emptySpaces[emptySpaceIndex];

        for(let i = 0; i < possibleNumbers.length; i++) {
            let num = possibleNumbers[i];
            if(isValid(num, row, col, solutionGrid)) {
                solutionGrid[row][col] = num;

                if(recurse(emptySpaceIndex + 1)) {
                    return true;
                }
                solutionGrid[row][col] = "0";
            }
        }
        return false;
    }
    recurse(0);
}

function isValid(number, row, col, board){
    for(let i = 0; i<grid.length; i++) {
        if(board[row][i] === number || board[i][col] === number) {
            return false;
        }

        //proverava 3x3 subgridove      
        let startRow = Math.floor(row / 3) *3;
        let startCol = Math.floor(col / 3) *3;
        
        for(let j = startRow; j < startRow+3; j++) {
            for(let k = startCol; k < startCol+3; k++) {
                if(board[j][k] === number) {
                    return false;
                }
            }
        }
    }
    return true;
}

function solve() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = solutionGrid[i][j];
        }
    }
    Draw();
}

function reset() {
    initializeGrids()
    selectedCell = [-1, -1];
    solveSolutionGrid();
    Draw();
}

function wipe() {
    for(i = 0; i < grid.length; i++) {
        for(j = 0; j < grid.length; j++) {
            grid[i][j] = "0";
            originalGrid[i][j] = "0";
            solutionGrid[i][j] ="0";
        }
    }
    selectedCell = [-1, -1];
    Draw();
}

function submit() {
    for(i = 0; i < grid.length; i++) {
        for(j = 0; j < grid.length; j++) {
            originalGrid[i][j] = grid[i][j];
            solutionGrid[i][j] = grid[i][j];
        }
    }
    check();
    solveSolutionGrid();
    Draw();
}