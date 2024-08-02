export interface AverageRunsPerGameTeam {
  [teams: string]: Map<number, number>;
}

export interface AverageRunsPerGameLeague {
  [runs: string]: LeagueRanking[];
}

export interface BattingAveragePerGame {
  [teams: string]: Map<number, number>;
}

export interface LeagueRanking {
  rank: string;
  team: string;
  value?: string | number;
}

export interface LeagueRankingRPG {
  team: string;
  runs: number;
}
