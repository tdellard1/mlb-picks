/*
{
  "BB": "27",
  "Balk": "1",
  "Wild Pitch": "3",
  "Flyouts": "24",
  "BlownSave": "3",
  "Loss": "1",
  "H": "40",
  "HR": "6",
  "ER": "16",
  "Strikes": "550",
  "WHIP": "1.34",
  "Groundouts": "28",
  "R": "16",
  "InningsPitched": "50.0",
  "Save": "1",
  "Batters Faced": "215",
  "SO": "72",
  "Win": "1",
  "Hold": "24",
  "Pitches": "876"
}
*/

export interface RosterPlayerPitching {
    BB: string;
    Balk: string;
    BlownSave: string;
    ER: string;
    Flyouts: string;
    Groundouts: string;
    H: string;
    HR: string;
    Hold: string;
    InningsPitched: string;
    Loss: string;
    Pitches: string;
    R: string;
    SO: string;
    Save: string;
    Strikes: string;
    WHIP: string;
    Win: string;
    ['Batters Faced']: string;
    ['Wild Pitch']: string;
}
