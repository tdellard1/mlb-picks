import { Injectable, isDevMode } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpOptions} from "../../model/http-options.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: HttpOptions): Observable<any> {
    return this.http.get<T>(url, options);
  };

  post<T>(url: string, body: any): Observable<any> {
    return this.http.post<T>(url,  body);
  };
}


// 'https://www.statmuse.com/mlb/ask/st.-louis-cardinals-batting-avg-last-3-games'
