import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {map, tap} from "rxjs/operators";
import {ApiService} from "../services/api-services/api.service";
import {Slates} from "../../Slate/data-access/slate.model";
import {environment} from "../../../environments/environment";

export const slatesResolver: ResolveFn<any> = () => {
  return inject(ApiService).get<{slates: Slates}>(environment.apiUrl + 'api/slates')
    .pipe(
      map(({slates}: {slates: Slates}) => slates),
    );
};
