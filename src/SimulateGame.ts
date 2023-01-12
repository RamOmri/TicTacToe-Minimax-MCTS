import { hasPlayerWon } from './GameHelperFunctions';
import { GameState, Player } from './types';
import {
  cloneState,
  getAvailableMoves,
  applyMove,
  switchPlayers
} from './utils';
import { shuffle } from "lodash";

// Given an initial state, play a random game of tic tac toe until an end state is reached
export default function SimulateRandomGame(
  state: GameState,
  startingPlayer: Player
) {
  let player = startingPlayer;
  let moves = shuffle(getAvailableMoves(state));
  let simulatedState = cloneState(state); // Initial state of the game to simulate
  let isGameOver = moves.length === 0 || hasPlayerWon(simulatedState, player);

  // While the game is not over
  while (!isGameOver) {
    const move = moves.pop(); // Select a random move
    simulatedState = applyMove(simulatedState, move, player); // Apply the move on the current game state
    isGameOver = moves.length === 0 || hasPlayerWon(simulatedState, player);
    player = switchPlayers(player);
  }
  return simulatedState;
}
