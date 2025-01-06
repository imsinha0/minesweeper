
export function createMinesweeperBoard(rows: number, cols: number, mines: number) {
    const board = Array(rows).fill(null).map(() => Array(cols).fill(0)); // Create an empty board
    let minesPlaced = 0;
  
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (board[row][col] === 0) { // Ensure no mine is placed where one already exists
        board[row][col] = 'X'; // Mark a mine with 'X'
        minesPlaced++;
      }
    }
  
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],  // Top-left, Top, Top-right
      [0, -1], [0, 1],             // Left, Right
      [1, -1], [1, 0], [1, 1],     // Bottom-left, Bottom, Bottom-right
    ];
  
    // Iterate over every square on the board
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (board[row][col] === 'X') {
          continue; // Skip if the current square is a mine
        }
  
        let mineCount = 0;
  
        // Check all 8 neighboring cells
        for (const [dx, dy] of directions) {
          const newRow = row + dx;
          const newCol = col + dy;
  
          // Make sure we are within bounds of the board
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            if (board[newRow][newCol] === 'X') {
              mineCount++;
            }
          }
        }
  
        // Set the number of mines around the current square
        board[row][col] = mineCount;
      }
    }
  
    return board;
  }


export class Board {
    boardConfig: string[][];
    boardView: string[][];
  
    constructor(boardConfig: string[][]) {
      this.boardConfig = boardConfig;
      this.boardView = Array(boardConfig.length)
        .fill(null)
        .map(() => Array(boardConfig[0].length).fill(null));
    }
  
    reveal(row: number, col: number) {
      console.log("Revealing", row, col);
      if (this.boardView[row][col] !== null) {
        return;
      }
  
      if (this.boardConfig[row][col] === 'X') {
        this.boardView[row][col] = 'X';
        return 'X';
      } else {
        this.boardView[row][col] = this.boardConfig[row][col];
        console.log("this.boardView[row][col]: ", this.boardView[row][col]);
      }
  
      // If the revealed square is empty (i.e., no neighboring mines), reveal adjacent squares
      if (Number(this.boardConfig[row][col]) === 0) {
        // Check all 8 directions for neighboring squares to reveal
        const directions = [
          [-1, -1], [-1, 0], [-1, 1], // Top-left, Top, Top-right
          [0, -1], [0, 1],            // Left, Right
          [1, -1], [1, 0], [1, 1],    // Bottom-left, Bottom, Bottom-right
        ];
        for (const [dx, dy] of directions) {
          const newRow = row + dx;
          const newCol = col + dy;
          if (newRow >= 0 && newRow < this.boardConfig.length && newCol >= 0 && newCol < this.boardConfig[0].length) {
            if (this.boardView[newRow][newCol] === null) { // Only reveal if not already revealed
              this.reveal(newRow, newCol); // Recursive call for adjacent squares
            }
          }
        }
      }
    }
  
    currentView() {
      // Show the boardView, where null cells are replaced with empty strings
      return this.boardView.map((row, rowIndex) => {
        return row.map((col, colIndex) => {
          if (col === null) {
            return ""; // Empty string for unrevealed cells
          }
          return col; // Reveal the value (number of mines or 'X' for mines)
        });
      });
    }

    progress(){
      // count number of nonnull entries of boardView
      let count = 0;
      for (let i = 0; i < this.boardView.length; i++) {
        for (let j = 0; j < this.boardView[i].length; j++) {
          if (this.boardView[i][j] !== null) {
            count++;
          }
        }
      }
      return count;
    }

    resetBoard() {
        // Reset the boardView to all nulls
        this.boardView = Array(this.boardConfig.length)
          .fill(null)
          .map(() => Array(this.boardConfig[0].length).fill(null));
        
        console.log("Board reset successfully.");
      }

  }
  