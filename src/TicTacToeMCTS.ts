import SimulateRandomGame from './SimulateGame';
import {
  getAvailableMoves,
  cloneState,
  switchPlayers,
  applyMove
} from './utils';
import { shuffle } from 'lodash';
import { GameState, Player, MCTSTreeNode } from './types';
import { hasPlayerWon, isTie } from './GameHelperFunctions';


// given some game state and player, use a monte carlo tree search to find the optimal move by that player.
export default function TicTacToeMCTS(
  state: GameState,
  agentPlayer: Player,
  MAX_ITERATIONS: number // Number of iterations of the algorithm before returning
): GameState {
  const root: MCTSTreeNode = {
    state,
    children: [],
    totalScore: 0,
    visits: 0,
    playerTurn: agentPlayer,
    ucb1: Number.POSITIVE_INFINITY,
    isRoot: true
  };

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    let node = root;

    // Find a leaf node 
    while (node.children.length !== 0) {
      const sortNodesByUCB1 = (a: MCTSTreeNode, b: MCTSTreeNode) => b.ucb1 - a.ucb1; // select the child with the highest ucb1 score
      node = node.children.sort(sortNodesByUCB1)[0];
    }

    // If this node is terminal then backpropagate and continue
    if (isTerminal(node.state)) {
      const hasWon = hasPlayerWon(node.state, agentPlayer);
      const hasLost = hasPlayerWon(node.state, switchPlayers(agentPlayer));
      const score = getGameScore(hasWon, hasLost);
      backPropagate(node, score);
      continue;
    }

    // If this is the first visit then rollout then backpropagate
    if (node.visits === 0) {
      const score = RollOut(node, agentPlayer);
      backPropagate(node, score);
      continue;
    }

    // If the node has been visited before but is still a leaf node then expand the node and roll out on one of the child nodes
    expandNode(node);
    node = node.children[0];
    const score = RollOut(node, agentPlayer);
    backPropagate(node, score);
  }

  if (root.children.length === 0) return root.state; // Simply return the root state if the root is terminal

  const sortNodesByScore = (a: MCTSTreeNode, b: MCTSTreeNode) =>
    b.totalScore / b.visits - a.totalScore / a.visits; // Function sorts nodes according to their total score divided by visits
  
    return root.children.sort(sortNodesByScore)[0].state; // Return the state of the node with the highest avg score
}

// The Rollout function simulates a game of random moves and returns the final score for a
// win loss or tie in the final simulated state
function RollOut(node, agentPlayer) {
  const simulatedGameState = SimulateRandomGame(node.state, node.playerTurn);
  const hasWon = hasPlayerWon(simulatedGameState, agentPlayer);
  const hasLost = hasPlayerWon(simulatedGameState, switchPlayers(agentPlayer));
  const score = getGameScore(hasWon, hasLost);
  return score;
}

// For each possible move in the node's state, add a child to the node after applying the move.
function expandNode(node: MCTSTreeNode) {
  const moves: [number, number] = shuffle(getAvailableMoves(node.state));
  moves.forEach((move) => {
    const state = applyMove(cloneState(node.state), move, node.playerTurn);
    node.children.push({
      state,
      children: [],
      totalScore: 0,
      visits: 0,
      playerTurn: switchPlayers(node.playerTurn),
      ucb1: Number.POSITIVE_INFINITY,
      parent: node
    });
  });
}

// back propagate up the graph from a leaf node and update the number of visits, total score and ucb1 value
function backPropagate(leafNode: MCTSTreeNode, score: number) {
  let currentNode: undefined | MCTSTreeNode = leafNode;
  while (Boolean(currentNode)) {
    currentNode.visits += 1;
    currentNode.totalScore += score;
    currentNode.ucb1 = calculateUCB1(currentNode);
    currentNode = currentNode.parent;
  }
}

// Calculate the ucb1 value for a node
function calculateUCB1(node) {
  if (node.visits === 0) return Number.POSITIVE_INFINITY;
  if (Boolean(node.isRoot)) return 0;
  return (
    node.totalScore / node.visits +
    2 * Math.sqrt(Math.log(node.parent.visits) / node.visits)
  );
}

// Given whether the agent won or lost, return some predefined score. Currently biasing the agent against losing
function getGameScore(hasWon: boolean, hasLost: boolean) {
  if (hasWon) return 10;
  if (hasLost) return -100;
  return 0;
}

// Is the current gamestate terminal
function isTerminal(state: GameState) {
  return isTie(state) || hasPlayerWon(state, 'X') || hasPlayerWon(state, 'O');
}
