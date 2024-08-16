export interface LineScore {
  H: string;
  R: string;
  team: string;
  scoresByInning: { [inning: string]: string };
  E: string;
}