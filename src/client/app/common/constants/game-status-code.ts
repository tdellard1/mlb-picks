// Game Status Code (gameStatusCode)
//  Many endpoints will return a game's game status.
//  This is a literal string and has literals such as "Completed", "Suspended", "Live - In Progress", "Final", "End Game Cleanup" etc...
//  To simplify this for users, each of these endpoints that have "gameStatus" element will also have "gameStatusCode"
//  "gameStatusCode" is a number starting with 0 and can be the following:
//      "0" - This means the game has not started yet.
//       "1" - Game is currently in progress.
//       "2" - Game is "completed" or "final".
//       "3" - Game has been "postponed".
//       "4" - Game has been "suspended"
//
// Endpoints that currently have gameStatus and gameStatusCode are:
//    getMLBScoresOnly
//    getMLBBoxScore
//    getMLBLineScore
//    getMLBGamesForDate
//    getMLBTeamSchedule
//    getMLBGameInfo

export enum GameStatusCode {
  NotStarted = "0", // This means the game has not started yet
  InProgress = "1", // Game is currently in progress
  CompletedOrFinal = "2", // Game is "completed" or "final"
  Postponed = "3", // Game has been "postponed"
  Suspended = "4", // Game has been "suspended"
}