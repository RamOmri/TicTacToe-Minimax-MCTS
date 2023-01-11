import { GameState, Player } from './types';

// Returns the opposite player to the one provided.
export const switchPlayers = (player: Player) => {
  return player === 'X' ? 'O' : 'X';
};

// Returny a deepy copy of the game state.
export const cloneState = (state: GameState) => {
  return state.map((row) => [...row]);
};

// Return an initial gamestate
export function createInitialGameState(gridSize: number) {
  const gameState = [...Array(gridSize)].map((e) => Array(gridSize));
  return gameState.map((row) => row.fill('', 0, gridSize)) as GameState;
}

// Given a row column and player apply the move on the game state and return.
export function applyMove(state, move, player) {
  const [i, j] = move;
  state[i][j] = player;
  return state;
}

// Returns the row and column of all empty cells.
export function getAvailableMoves(state: GameState): [number, number][] {
  const moves: [number, number][] = [];
  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state.length; j++) {
      if (state[i][j] === '') {
        moves.push([i, j]);
      }
    }
  }

  return moves;
}
