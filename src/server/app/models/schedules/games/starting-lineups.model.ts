/*
{
  "0": {
    "battingOrder": "1",
    "playerID": "666182"
  },
  "1": {
    "battingOrder": "2",
    "playerID": "687462"
  },
  "2": {
    "battingOrder": "3",
    "playerID": "665489"
  },
  "3": {
    "battingOrder": "4",
    "playerID": "457759"
  },
  "4": {
    "battingOrder": "5",
    "playerID": "543807"
  },
  "5": {
    "battingOrder": "6",
    "playerID": "676914"
  },
  "6": {
    "battingOrder": "7",
    "playerID": "643376"
  },
  "7": {
    "battingOrder": "8",
    "playerID": "643396"
  },
  "8": {
    "battingOrder": "9",
    "playerID": "595281"
  },
  "length": 9
}
 */


// Missing Length
export interface Teams<T> {
    away: T;
    home: T;
}

export interface LineUp {
    [order: string]: string;
}

export interface LineScore {
    H: string;
    R: string;
    team: string;
    scoresByInning: ScoresByInning;
    E: string;
}

export interface ScoresByInning {
    [inning: string]: string;
}
