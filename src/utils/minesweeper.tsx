
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
      // Return early if the cell is already revealed
      console.log("Revealing cell: ", row, col);

      if (this.boardView[row][col] !== null) {
        return "done";
      }
  
      if (this.boardConfig[row][col] === 'X') {
        this.boardView[row][col] = 'X';
        return 'X';
      } else {
        // Convert the value to string to maintain consistent types
        this.boardView[row][col] = String(this.boardConfig[row][col]);
        console.log("setting value: ", this.boardConfig[row][col]);
      }
  
      // If the revealed square is empty (i.e., no neighboring mines), reveal adjacent squares
      if (this.boardConfig[row][col] === '0' || Number(this.boardConfig[row][col]) === 0) {
        const directions = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1], [0, 1],
          [1, -1], [1, 0], [1, 1],
        ];
        
        for (const [dx, dy] of directions) {
          const newRow = row + dx;
          const newCol = col + dy;
          
          if (
            newRow >= 0 && 
            newRow < this.boardConfig.length && 
            newCol >= 0 && 
            newCol < this.boardConfig[0].length && 
            this.boardView[newRow][newCol] === null
          ) {
            this.reveal(newRow, newCol);
          }
        }
      }
      
      return this.boardView[row][col];
    }
  
    currentView() {
      return this.boardView.map(row => 
        row.map(cell => cell === null ? "" : String(cell))
      );
    }

    nonmineCount() {
      return this.boardConfig.flat().filter(cell => cell !== 'X').length;
    }

    progress() {
      return this.boardView.flat().filter(cell => cell !== null).length;
    }

    resetBoard() {
      this.boardView = Array(this.boardConfig.length)
        .fill(null)
        .map(() => Array(this.boardConfig[0].length).fill(null));
      console.log("Board reset.");
    }
}