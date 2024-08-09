import { Injectable } from '@angular/core';
import {LoggerService} from "./logger.service.js";

@Injectable({
  providedIn: 'root'
})
export class LastUpdatedService {
  private readonly _needToUpdate: boolean;

  constructor(private logger: LoggerService) {
    const lastUpdatedString: string | null = localStorage.getItem('lastUpdated');
    let lastUpdated: number;
    if (lastUpdatedString !== null) {
      lastUpdated = Number(lastUpdatedString);
    } else {
      lastUpdated = 0;
    }

    const today = new Date().setHours(0, 0, 0, 0);
    this.logger.info(`lastUpdated: ${lastUpdated}, today: ${today}, ${lastUpdated < today}`);
    this._needToUpdate = lastUpdated < today;
  }

  get refresh() {
    return this._needToUpdate;
  }
}
