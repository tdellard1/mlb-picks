import { Injectable } from '@angular/core';

export class LogLevel {
  None = 0;
  Info = 1;
  Verbose = 2;
  Warn = 3;
  Error = 4;
  constructor() { }
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  logLevel: LogLevel = new LogLevel();
  constructor() {}
  info(msg: any): void {
    this.logWith(this.logLevel.Info, msg);
  }
  warn(msg: any): void {
    this.logWith(this.logLevel.Warn, msg);
  }
  error(msg: any, ...data: any ): void {
    this.logWith(this.logLevel.Error, msg + data);
  }
  private logWith(level: any, msg: any): void {
    if (level <= this.logLevel.Error) {
      switch (level) {
        case this.logLevel.None:
          return console.log(msg);
        case this.logLevel.Info:
          return console.info('%c' + msg, 'color: #6495ED');
        case this.logLevel.Warn:
          return console.warn('%c' + msg, 'color: #FF8C00');
        case this.logLevel.Error:
          return console.error('%c' + msg, 'color: #DC143C');
        default:
          console.debug(msg);
      }
    }
  }
}
