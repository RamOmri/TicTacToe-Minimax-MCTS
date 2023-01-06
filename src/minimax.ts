const { isTie, hasPlayerWon, createInitialGameState } = require('./utils');

type GameStateType = ('' | 'X' | 'O')[][];

type TreeNode = {
  state: GameStateType;
  score: number | null;
  children: TreeNode[];
  isRoot?: boolean;
};

const cloneState = (state: GameStateType) => {
  return state.map((row) => [...row]);
};

const switchPlayer = (player: string) => {
  return player === 'X' ? 'O' : 'X';
};

// Recursively build a tree graph through a depth first search of the tic tac toe gamespace
const buildTree = async (node: TreeNode, player: 'X' | 'O') => {
  const MAX_SCORE = 10;
  const MIN_SCORE = -10;

  // Check if in terminal state and assign the score accordingly
  if (hasPlayerWon(node.state, switchPlayer(player))) {
    node.score = switchPlayer(player) === 'X' ? MAX_SCORE : MIN_SCORE;
    return;
  }
  if (isTie(node.state)) {
    node.score = 0;
    return;
  }

  // Create a child node for every possible move
  const children: TreeNode[] = [];
  for (let i = 0; i < node.state.length; i++) {
    for (let j = 0; j < node.state.length; j++) {
      if (node.state[i][j] === '') {
        const childState = cloneState(node.state);
        childState[i][j] = player;

        const child: TreeNode = {
          state: childState,
          score: null,
          children: []
        };
        children.push(child);
        buildTree(child, switchPlayer(player)); // Recursively call this function until a terminal node is reached
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
      minScore = Math.min(minScore, child.score!); // player o finds the child with the smallest score
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
    console.log('JSON data is saved.');
  } catch (error) {
    console.error(error);
  }
};

let root: TreeNode = {
  state: createInitialGameState(3),
  score: null,
  children: [],
  isRoot: true
};
buildTree(root, 'X');
writeTree(root, 'minimax-gridsize-3.json');
