import { MiniMaxTreeNode, Player } from './types';
import { switchPlayers, cloneState, createInitialGameState } from './utils';

import { isTie, hasPlayerWon } from './GameHelperFunctions';

// Recursively build a tree graph through a depth first search of the tic tac toe gamespace
const buildMinimaxTreeGraph = async (node: MiniMaxTreeNode, player: Player) => {
  const MAX_SCORE = 10;
  const MIN_SCORE = -10;

  // Check if in terminal state and assign the score accordingly
  if (hasPlayerWon(node.state, switchPlayers(player))) {
    node.score = switchPlayers(player) === 'X' ? MAX_SCORE : MIN_SCORE; // X maximizes the final score and O minimizes
    return;
  }
  if (isTie(node.state)) {
    node.score = 0; // Return 0 for a tie
    return;
  }

  // Create a child node for every possible move
  const children: MiniMaxTreeNode[] = [];
  for (let i = 0; i < node.state.length; i++) {
    for (let j = 0; j < node.state.length; j++) {
      if (node.state[i][j] === '') {
        const childState = cloneState(node.state);
        childState[i][j] = player;

        const child: MiniMaxTreeNode = {
          state: childState,
          score: null,
          children: []
        };
        children.push(child);
        buildMinimaxTreeGraph(child, switchPlayers(player)); // Recursively call this function until a terminal node is reached
      }
    }
  }

  node.children = children;
  if (player === 'X') {
    let maxScore = MIN_SCORE;
    for (const child of children) {
      maxScore = Math.max(maxScore, child.score!);
    }
    node.score = maxScore; // If current player is player x, then find the child with the highest score
  } else {
    let minScore = MAX_SCORE;
    for (const child of children) {
      minScore = Math.min(minScore, child.score!); // player o finds the child with the lowest score
    }
    node.score = minScore;
  }
  if (Boolean(node.isRoot)) return node; // If this is the root node then simply return and itself and finish the algorithm
};

const fs = require('fs');

// function takes the root node and a name and saves the resulting json into the graphs directory
const writeTree = (tree, name) => {
  const json = JSON.stringify(tree);
  try {
    fs.writeFileSync(`src/graphs/${name}`, json);
    console.log(`JSON data is saved in src/graphs/${name}.`);
  } catch (error) {
    console.error(error);
  }
};

let root: MiniMaxTreeNode = {
  state: createInitialGameState(3),
  score: null,
  children: [],
  isRoot: true
};

buildMinimaxTreeGraph(root, 'X');
writeTree(root, 'minimax-gridsize-3.json');
