import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {BackendApiService} from "../services/backend-api/backend-api.service";

export const slatesResolver: ResolveFn<any> = () => {
  return inject(BackendApiService).getSlates();
};
