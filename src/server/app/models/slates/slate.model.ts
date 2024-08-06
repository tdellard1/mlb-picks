export declare type Slates = Slate[];

export class Slate {
    experts?: Experts;
    date?: string;

    constructor(data?: any) {
        if (data) {
            this.experts = data.experts;
            this.date = data.date;
        }
    }
}

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
