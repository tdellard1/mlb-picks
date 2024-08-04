import { ResolveFn } from '@angular/router';

export const pitcherResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
