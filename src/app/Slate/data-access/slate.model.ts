import {Experts} from "../../common/resolvers/picks.resolver";

export declare type Slates = NewSlate[];

export class NewSlate {
  experts: Experts;
  date: string;

  constructor(date: string, experts: Experts) {
    this.experts = experts;
    this.date = date;
  }
}
