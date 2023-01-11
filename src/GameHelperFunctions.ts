import { GameState, Player } from './types';

// checks whether a given player has won on a given game state
export function hasPlayerWon(gameState: GameState, player: Player) {
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

  // Check for a win on a diagonal
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

// Checks if all the cells in the game are filled (assumes no player has won yet).
export function isTie(gameState: GameState) {
  return gameState.every((row) =>
    row.every((cell) => cell === 'X' || cell === 'O')
  );
}
