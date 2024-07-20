import {Experts} from "./expert.interface";


export declare type Slates = Slate[];

export class Slate {
  experts: Experts;
  date: string;

  constructor(date: string, experts: Experts) {
    this.experts = experts;
    this.date = date;
  }
}
