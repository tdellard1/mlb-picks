/*
{
  "BB": "15",
  "AB": "353",
  "H": "100",
  "IBB": "1",
  "HR": "8",
  "TB": "145",
  "3B": "2",
  "GIDP": "14",
  "2B": "17",
  "R": "41",
  "SF": "7",
  "avg": ".283",
  "SAC": "0",
  "HBP": "1",
  "RBI": "54",
  "SO": "55"
}
*/

export interface RosterPlayerHitting {
    AB: string; // At Bats
    BB: string; // Walks
    GIDP: string; // Grounded Into Double Play
    H: string; // Hits
    HBP: string; // Hit By Pitch
    HR: string; // Home Runs
    IBB: string; // Intentional Walks
    R: string; // Runs
    RBI: string; // Runs Batterd In
    SAC: string; // Sacrifice
    SF: string; // Sacrifice Fly
    SO: string; // Struck Outs
    TB: string; // Total Bases
    ['2B']: string; // Doubles
    ['3B']: string; // Singles
    avg: string; // Batting Average
}