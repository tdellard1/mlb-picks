export abstract class SubscriptionHolder {
  protected readonly subscriptions: { unsubscribe: VoidFunction }[] = [];

  protected unsubscribe() {
    this.subscriptions.forEach((subscriber: { unsubscribe: VoidFunction }) => subscriber.unsubscribe());
  };
}
