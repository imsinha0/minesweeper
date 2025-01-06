

export function createMinesweeperBoard(rows: number, cols: number, mines: number) {
    const board = Array(rows).fill(null).map(() => Array(cols).fill(0)); // Create an empty board
    let minesPlaced = 0;
  
    // Step 1: Randomly place mines on the board
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (board[row][col] === 0) { // Ensure no mine is placed where one already exists
        board[row][col] = 'X'; // Mark a mine with 'X'
        minesPlaced++;
      }
    }
  
    // Step 2: Count the number of mines surrounding non-mine squares
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],  // Top-left, Top, Top-right
      [0, -1], [0, 1],             // Left, Right
      [1, -1], [1, 0], [1, 1],     // Bottom-left, Bottom, Bottom-right
    ];
  
    // Iterate over every square on the board
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (board[row][col] === 'X') {
          continue; // Skip mine cells
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
  


export class Board{
    boardConfig: string[][];
    boardView: string[][];

    constructor(boardConfig: string[][]){
        this.boardConfig = boardConfig;
        this.boardView = Array(boardConfig.length).fill(null).map(() => Array(boardConfig[0].length).fill(null));
    }
    
    reveal(row: number, col: number){
        if(this.boardConfig[row][col] === 'X'){
            this.boardView[row][col] = 'X';
            return false;
        }
        this.revealHelper(row, col);
        return true;
    }



}

