import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpOptions} from "../../model/http-options.model";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  serverUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: HttpOptions): Observable<any> {
    return this.http.get<T>(this.serverUrl + url, options);
  };

  post<T>(url: string, body: any): Observable<any> {
    console.log('body: ', body);
    return this.http.post<T>(url,  body);
  };
}


// 'https://www.statmuse.com/mlb/ask/st.-louis-cardinals-batting-avg-last-3-games'
