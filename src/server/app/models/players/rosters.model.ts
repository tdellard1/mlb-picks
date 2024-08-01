import {RosterPlayer} from "./roster-player.model.js";



export class Roster {
    team!: string;
    roster!: RosterPlayer[];

    constructor(data?: any) {
        if (data) {
            this.team = data.team;
            this.roster = data.roster;
        }
    }
}