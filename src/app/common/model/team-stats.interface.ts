export interface TeamStats {
  Pitching: TeamPitchingStats;
  BaseRunning: TeamBaseRunningStats;
  Fielding: TeamFieldingStats;
  Hitting: TeamHittingStats;
}

export interface TeamPitchingStats {
  Groundouts: string;
  Balk: string;
  ['Wild Pitch']: string;
  Flyouts: string;
  ['Inherited Runners']: string;
  ['Batters Faced']: string;
  Pitches: string;
  Strikes: string;
  ['Inherited Runners Scored']: string;
}

export interface TeamBaseRunningStats {
  CS: string;
  SB: string
  PO: string;
}
export interface TeamFieldingStats {
  E: string;
  Pickoffs: string;
  ['Passed Ball']: string;
}

export interface TeamHittingStats {
  BB: string;       // Walks
  ['2B']: string;   // Doubles
  R: string;        // Runs
  SF: string;       // Sacrifice Fly
  SAC: string;      //
  HBP: string;      // Hit By Pitch
  H: string;        // Hits
  RBI: string;      // Runs Batted In
  IBB: string;      // Intentional Walks
  TB: string;       // Total Bases
  ['3B']: string;   // Triples
  GIDP: string;     // Ground Into Double Play
}
