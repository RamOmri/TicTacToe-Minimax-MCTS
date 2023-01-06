export type GameStateType = ('' | 'X' | 'O')[][];

export type TreeNode = {
  state: GameStateType;
  score: number | null;
  children: TreeNode[];
  move?: {
    i: number;
    j: number;
  };
  isRoot?: boolean;
};

export const createInitialGameState = (gridSize: number) => {
  const gameState = [...Array(gridSize)].map((e) => Array(gridSize));
  return gameState.map((row) => row.fill('', 0, gridSize));
};

export function hasPlayerWon(gameState: GameStateType, player: 'X' | 'O') {
  // Check for a row win
  if (gameState.some((row) => row.every((cell) => cell === player))) {
    return true;
  }

  // check for a column win
  for (let col = 0; col < gameState.length; col++) {
    let isColumnFull = true;
    for (let row = 0; row < gameState.length; row++) {
      if (gameState[row][col] !== player) {
        isColumnFull = false;
        break;
      }
    }
    if (isColumnFull) return true;
  }

  // Check for a win by player on a diagonal
  let diagonal1Filled = true;
  let diagonal2Filled = true;
  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i][i] !== player) {
      diagonal1Filled = false;
    }
    if (gameState[i][gameState.length - 1 - i] !== player) {
      diagonal2Filled = false;
    }
  }
  if (diagonal1Filled || diagonal2Filled) {
    return true;
  }
  return false;
}

export function isTie(gameState: GameStateType) {
  return gameState.every((row) =>
    row.every((cell) => cell === 'X' || cell === 'O')
  );
}
