import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {map, tap} from "rxjs/operators";
import {ApiService} from "../services/api-services/api.service";
import {Slates} from "../../Slate/data-access/slate.model";

export const slatesResolver: ResolveFn<any> = () => {
  return inject(ApiService).get<{slates: Slates}>('api/slates')
    .pipe(
      map(({slates}: {slates: Slates}) => slates),
    );
};
