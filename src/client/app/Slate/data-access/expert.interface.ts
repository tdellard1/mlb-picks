export declare type Experts = Expert[]

export interface Expert {
  name: string;
  predictions: GamePick[];
}

export interface GamePick {
  gameID: string;
  prediction: string;
  options: string[];
  correct: boolean;
  winner: string;
}
