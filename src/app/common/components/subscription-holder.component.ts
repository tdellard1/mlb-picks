import { Component } from '@angular/core';
import {Subscription} from "rxjs";


export abstract class SubscriptionHolder {
  protected readonly subscriptions: Subscription[] = [];

  protected unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  };
}
