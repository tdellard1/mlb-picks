import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpOptions} from "../../model/http-options.model";

@Injectable({
  providedIn: 'root'
})
export class FanGraphsApiService {
  private apiUrl: string = 'https://www.fangraphs.com/api/leaders/major-league/data?pos=all&stats=bat&lg=all&qual=0&season=2024&season1=2024&startdate=2024-03-01&enddate=2024-11-01&month=0&team=0%2Cts&pageitems=30&pagenum=1&ind=0&rost=0&players=0&type=8&sortdir=default&sortstat=WAR';
  private headers: HttpHeaders = new HttpHeaders({
    // 'Cookie': '_ga=GA1.1.678410981.1718169640; __qca=P0-1887509951-1718169640072; _sharedID=e834dcf0-8e22-4963-bd2f-6722b630389c; _sharedID_cst=zix7LPQsHA%3D%3D; hb_insticator_uid=e646ea0b-f25b-44df-938a-a845812214ea; cnx_userId=ddabfc2cd8b348898c4a9746bbe42d8d; _lc2_fpi=ba1275917a72--01j05e8b0msxcgpg4z4xnm3fcx; _lc2_fpi_meta={%22w%22:1718169644052}; __gads=ID=ddfd5d2a1114829a:T=1718169642:RT=1718170760:S=ALNI_Ma_vJCFlQSCuw2DKcNq-7xQKUfX1g; __gpi=UID=00000e26d7a352e3:T=1718169642:RT=1718170760:S=ALNI_MbhRhI4kfREyH6Zz6A5d5UI0i3blQ; __eoi=ID=662100b77ae03076:T=1718169642:RT=1718170760:S=AA-AfjaczyILshv-rZp-2NahuSgb; FCNEC=%5B%5B%22AKsRol-ZMSGGh2bKTEXoKNOSisYc2d1o3ahk_2psuaVCFVD5m6hdVXjRV6aKAMndS0gAXs0nhye64DJxHVjZ0h8MTMrDc9_ELvR2l3PUFsckXQOgwQHlrwirQEI2527MqM91ulFYX2zR2n7_ouJ4Kr0V0eyNOizT0w%3D%3D%22%5D%5D; _ga_757YGY2LKP=GS1.1.1718169640.1.1.1718170915.0.0.0',
  });

  constructor(private http: HttpClient) {}

  get<T>(url: string = 'data', params?: any): Observable<any> {
    const options: HttpOptions = {
      headers: this.headers,
      params: params
    };

    return this.http.get<T>(this.apiUrl + url, options);
  };
}
