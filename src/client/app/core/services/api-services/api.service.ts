import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpOptions} from "../../../common/interfaces/http-options.js";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: HttpOptions): Observable<any> {
    return this.http.get<T>(url, options);
  };

  post<T>(url: string, body: T, options?: HttpOptions): Observable<any> {
    return this.http.post<T>(url,  body, options);
  };
}


// 'https://www.statmuse.com/mlb/ask/st.-louis-cardinals-batting-avg-last-3-games'
