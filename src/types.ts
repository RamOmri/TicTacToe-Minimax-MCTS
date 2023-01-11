export type Player = 'X' | 'O';

export type GameState = ('' | Player)[][];

export type MiniMaxTreeNode = {
  state: GameState;
  score: number | null;
  children: MiniMaxTreeNode[];
  isRoot?: boolean;
};

export type MCTSTreeNode = {
  state: GameState;
  children: MCTSTreeNode[];
  totalScore: number;
  ucb1: number;
  visits: number;
  playerTurn: Player;
  parent?: MCTSTreeNode;
  isRoot?: boolean;
};
