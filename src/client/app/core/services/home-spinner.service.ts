import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HomeSpinnerService {
  private _showSpinner: BehaviorSubject<boolean> = new BehaviorSubject(true);

  get showSpinner$() {
    return this._showSpinner.asObservable();
  }

  hideSpinner() {
    this._showSpinner.next(false);
  }

  displaySpinner() {
    this._showSpinner.next(true);
  }
}
