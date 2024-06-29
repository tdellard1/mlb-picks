export interface Odds {
  last_updated_e_time: string;
  betmgm: BetMGM;
  bet365: Bet365;
  gameDate: string;
  wynnbet: WynnBet;
  unibet: UniBet;
  teamIDHome: string;
  teamIDAway: string;
  homeTeam: string;
  pointsbet: PointsBet;
  betrivers: BetRivers;
  caesars_sportsbook: CaesarSportsBook;
  gameID: string;
  awayTeam: string;
  draftkings: DraftKings;
  playerProps: any;
}

export interface BetMGM {
  awayTeamRunLineOdds: string;
  homeTeamRunLine: string;
  homeTeamRunLineOdds: string;
  awayTeamRunLine: string;
}

export interface Bet365 {
  totalUnder: string;
  totalUnderOdds: string;
  awayTeamMLOdds: string;
  homeTeamMLOdds: string;
  totalOver: string;
  totalOverOdds: string;
}

export interface WynnBet {
  totalUnder: string;
  totalOverOdds: string;
  awayTeamRunLine: string;
  totalUnderOdds: string;
  awayTeamRunLineOdds: string;
  awayTeamMLOdds: string;
  homeTeamRunLine: string;
  homeTeamRunLineOdds: string;
  homeTeamMLOdds: string;
  totalOver: string;
}

export interface UniBet {
  totalUnder: string;
  totalOverOdds: string;
  awayTeamRunLine: string;
  totalUnderOdds: string;
  awayTeamRunLineOdds: string;
  awayTeamMLOdds: string;
  homeTeamRunLine: string;
  homeTeamRunLineOdds: string;
  homeTeamMLOdds: string;
  totalOver: string;
}

export interface PointsBet {
  totalUnder: string;
  totalOverOdds: string;
  awayTeamRunLine: string;
  totalUnderOdds: string;
  awayTeamRunLineOdds: string;
  awayTeamMLOdds: string;
  homeTeamRunLine: string;
  homeTeamRunLineOdds: string;
  homeTeamMLOdds: string;
  totalOver: string;
}

export interface BetRivers {
  totalUnder: string;
  totalOverOdds: string;
  awayTeamRunLine: string;
  totalUnderOdds: string;
  awayTeamRunLineOdds: string;
  awayTeamMLOdds: string;
  homeTeamRunLine: string;
  homeTeamRunLineOdds: string;
  homeTeamMLOdds: string;
  totalOver: string;
}

export interface CaesarSportsBook {
  totalUnder: string;
  totalOverOdds: string;
  awayTeamRunLine: string;
  totalUnderOdds: string;
  awayTeamRunLineOdds: string;
  awayTeamMLOdds: string;
  homeTeamRunLine: string;
  homeTeamRunLineOdds: string;
  homeTeamMLOdds: string;
  totalOver: string;
}

export interface DraftKings {
  totalUnder: string;
  totalOverOdds: string;
  awayTeamRunLine: string;
  totalUnderOdds: string;
  awayTeamRunLineOdds: string;
  awayTeamMLOdds: string;
  homeTeamRunLine: string;
  homeTeamRunLineOdds: string;
  homeTeamMLOdds: string;
  totalOver: string;
}
