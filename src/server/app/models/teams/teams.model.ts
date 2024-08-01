export class Team {
    DIFF?: string;
    RA?: string;
    RS?: string;
    conference?: string;
    conferenceAbv?: string;
    division?: string;
    espnLogo1?: string;
    loss?: string;
    mlbLogo1?: string;
    teamAbv!: string;
    teamCity?: string;
    teamID?: string;
    teamName?: string;
    teamStats?: any;
    topPerformers?: any;
    wins?: string;

    constructor(data?: any) {
        if (data) {
            this.DIFF = data.DIFF;
            this.RA = data.RA;
            this.RS = data.RS;
            this.conference = data.conference;
            this.conferenceAbv = data.conferenceAbv;
            this.division = data.division;
            this.espnLogo1 = data.espnLogo1;
            this.loss = data.loss;
            this.mlbLogo1 = data.mlbLogo1;
            this.teamAbv = data.teamAbv;
            this.teamCity = data.teamCity;
            this.teamID = data.teamID;
            this.teamName = data.teamName;
            this.teamStats = data.teamStats;
            this.topPerformers = data.topPerformers;
            this.wins = data.wins;
        }
    }
}