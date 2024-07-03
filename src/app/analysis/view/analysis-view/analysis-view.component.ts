import {Component, Input, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {Game} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";
import {TeamSchedule} from "../../../common/model/team-schedule.interface";
import {ensure} from "../../../common/utils/array.utils";
import {AnalysisData} from "../../../common/model/analysis.interface";
import {LeagueRanking} from "../../../common/model/average-runs-per-game.interface";
import {MatIcon} from "@angular/material/icon";
import {MatFabButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {NgForOf, NgOptimizedImage} from "@angular/common";

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid, NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'analysis-component-view',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    NgApexchartsModule,
    MatIcon,
    MatFabButton,
    MatCard,
    NgOptimizedImage,
    NgForOf
  ],
  templateUrl: './analysis-view.component.html',
  styleUrl: './analysis-view.component.css'
})
export class AnalysisViewComponent implements OnInit {
  @Input() games: Game[] = [];
  @Input() teams: Teams = {} as Teams;
  @Input() teamSchedules: TeamSchedule[] = [];

  currentGame: Game = {} as Game;
  homeTeamName: string = '';
  awayTeamName: string = '';

  private _index: number = 0;
  public runsPerGameAverageChartOptions: ChartOptions = {} as ChartOptions;
  public averageBattingAverageChartOptions: ChartOptions = {} as ChartOptions;
  public strikeoutAverageChartOptions: ChartOptions = {} as ChartOptions;

  constructor() {
    this.setUpChart();
  }

  ngOnInit(): void {
    this.currentGame = this.games[this._index];
    this.makeEverythingWork(this.currentGame);
  }

  makeEverythingWork(game: Game) {
    const {home, away}: Game = game;

    this.homeTeamName = this.teams.getTeamFullName(home);
    this.awayTeamName = this.teams.getTeamFullName(away);

    const analysisData: AnalysisData = new AnalysisData(this.teamSchedules);

    console.log(this.teamSchedules);


    this.runsPerGameAverageChartOptions = {} as ChartOptions;
    this.averageBattingAverageChartOptions = {} as ChartOptions;
    this.setUpChart();

    const rpgLeagueHigh: any[] = [];
    const rpgLeagueLow: any[] = [];

    for (let i = 15; i > 0; --i) {
      rpgLeagueHigh.push(ensure(analysisData.averageRunsPerGameModel.League[i].find((leagueRanking: LeagueRanking) => leagueRanking.rank === '1')).value)
      rpgLeagueLow.push(ensure(analysisData.averageRunsPerGameModel.League[i].find((leagueRanking: LeagueRanking) => leagueRanking.rank === '30')).value)
    }

    this.runsPerGameAverageChartOptions.series[0].data = rpgLeagueHigh;
    this.runsPerGameAverageChartOptions.series[3].data = rpgLeagueLow;
    this.runsPerGameAverageChartOptions.series[1].data = [...analysisData.averageRunsPerGameModel.Team[home].values()].reverse();
    this.runsPerGameAverageChartOptions.series[1].name = this.teams.getTeamFullName(home);
    this.runsPerGameAverageChartOptions.series[2].data = [...analysisData.averageRunsPerGameModel.Team[away].values()].reverse();
    this.runsPerGameAverageChartOptions.series[2].name = this.teams.getTeamFullName(away);

    const abaLeagueHigh: any[] = [];
    const abaLeagueLow: any[] = [];

    for (let i = 15; i > 0; --i) {
      abaLeagueHigh.push(ensure(analysisData.battingAverageModel.League[i].find((leagueRanking: LeagueRanking) => leagueRanking.rank === '1')).value)
      abaLeagueLow.push(ensure(analysisData.battingAverageModel.League[i].find((leagueRanking: LeagueRanking) => leagueRanking.rank === '30')).value)
    }

    this.averageBattingAverageChartOptions.series[0].data = abaLeagueHigh;
    this.averageBattingAverageChartOptions.series[3].data = abaLeagueLow;
    this.averageBattingAverageChartOptions.series[1].data = [...analysisData.battingAverageModel.getTeamValues(home)].reverse();
    this.averageBattingAverageChartOptions.series[1].name = this.teams.getTeamFullName(home);
    this.averageBattingAverageChartOptions.series[2].data = [...analysisData.battingAverageModel.getTeamValues(away)].reverse();
    this.averageBattingAverageChartOptions.series[2].name = this.teams.getTeamFullName(away);

    const soLeagueHigh: any[] = [];
    const soLeagueLow: any[] = [];

    for (let i = 15; i > 0; --i) {
      soLeagueHigh.push(ensure(analysisData.strikeoutModel.League[i].find((leagueRanking: LeagueRanking) => leagueRanking.rank === '1')).value)
      soLeagueLow.push(ensure(analysisData.strikeoutModel.League[i].find((leagueRanking: LeagueRanking) => leagueRanking.rank === '30')).value)
    }

    this.strikeoutAverageChartOptions.series[0].data = soLeagueHigh;
    this.strikeoutAverageChartOptions.series[3].data = soLeagueLow;
    this.strikeoutAverageChartOptions.series[1].data = [...analysisData.strikeoutModel.getTeamValues(home)].reverse();
    this.strikeoutAverageChartOptions.series[1].name = this.teams.getTeamFullName(home);
    this.strikeoutAverageChartOptions.series[2].data = [...analysisData.strikeoutModel.getTeamValues(away)].reverse();
    this.strikeoutAverageChartOptions.series[2].name = this.teams.getTeamFullName(away);

  }

  nextGame() {
    this._index++;
    this.makeEverythingWork(this.games[this._index]);
  }

  private setUpChart() {
    this.runsPerGameAverageChartOptions = {
      chart: {
        height: 300,
        width: 500,
        type: "line",
        foreColor: 'orange',
        fontFamily: 'Helvetica',
        background: 'white',
        sparkline: {
          //   enabled: true
        },
        dropShadow: {
          enabled: true,
          blur: 20,
        },
        zoom: {
          enabled: false
        }
      } as ApexChart,
      dataLabels: {
        enabled: false
      },
      series: [
        {
          name: "League High",
          data: [],
          color: 'green'
        },
        {
          name: "Home",
          data: []
        },
        {
          name: "Away",
          data: []
        },
        {
          name: "League Low",
          data: [],
          color: 'red'
        }
      ],

      stroke: {
        curve: "straight"
      },
      xaxis: {
        title: {
          text: 'Games Ago'
        },
        categories: [
          "15",
          "14",
          "13",
          "12",
          "11",
          "10",
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2",
          "1",
        ]
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      title: {
        text: "Average Runs Per Game",
        align: "center"
      },
    };
    this.averageBattingAverageChartOptions = {
      chart: {
        height: 300,
        width: 500
        ,
        type: "line",
        foreColor: 'orange',
        fontFamily: 'Helvetica',
        background: 'white',
        sparkline: {
          //   enabled: true
        },
        dropShadow: {
          enabled: true,
          blur: 20,
        },
        zoom: {
          enabled: false
        }
      } as ApexChart,
      dataLabels: {
        enabled: false
      },
      series: [
        {
          name: "League High",
          data: [],
          color: 'green'
        },
        {
          name: "Home",
          data: []
        },
        {
          name: "Away",
          data: []
        },
        {
          name: "League Low",
          data: [],
          color: 'red'
        }
      ],

      stroke: {
        curve: "straight"
      },
      xaxis: {
        title: {
          text: 'Games Ago'
        },
        categories: [
          "15",
          "14",
          "13",
          "12",
          "11",
          "10",
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2",
          "1",
        ]
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      title: {
        text: "The Average Batting Average Per Game",
        align: "center"
      },
    };
    this.strikeoutAverageChartOptions = {
      chart: {
        height: 300,
        width: 500
        ,
        type: "line",
        foreColor: 'orange',
        fontFamily: 'Helvetica',
        background: 'white',
        sparkline: {
          //   enabled: true
        },
        dropShadow: {
          enabled: true,
          blur: 20,
        },
        zoom: {
          enabled: false
        }
      } as ApexChart,
      dataLabels: {
        enabled: false
      },
      series: [
        {
          name: "League High",
          data: [],
          color: 'green'
        },
        {
          name: "Home",
          data: []
        },
        {
          name: "Away",
          data: []
        },
        {
          name: "League Low",
          data: [],
          color: 'red'
        }
      ],

      stroke: {
        curve: "straight"
      },
      xaxis: {
        title: {
          text: 'Games Ago'
        },
        categories: [
          "15",
          "14",
          "13",
          "12",
          "11",
          "10",
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2",
          "1",
        ]
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      title: {
        text: "Average Batting Strikeouts Per Game",
        align: "center"
      },
    };
  }

  getHomeTeamImage({home}: Game) {
    return this.teams.getTeamLogo(home);
  }

  getAwayTeamImage({away}: Game) {
    return this.teams.getTeamLogo(away);
  }
}
