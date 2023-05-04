type Gmail = GoogleAppsScript.Gmail;
type Thread = GoogleAppsScript.Gmail.GmailThread;
type Message = GoogleAppsScript.Gmail.GmailMessage;
type Label = GoogleAppsScript.Gmail.GmailLabel;
type Calendar = GoogleAppsScript.Calendar.Calendar

import { filter, Observable, partition, Subscriber, share, map, merge } from 'rxjs';
import { withAll, withLabels, withOnlyUnprocessed, withSubject } from "filters";
import { airbaseAction, therapyAction, ThreadAction } from "actions";
import { getOrCreateLabel } from "mail";

function markProcessed(): (thread: Thread) => Thread {
  const processedLabel = getOrCreateLabel("processed");
  return (thread: Thread) => {
    const subject = thread.getFirstMessageSubject();
    thread.addLabel(processedLabel);
    thread.markRead();
    console.log(`processed ${subject}`);
    return thread;
  }
}

export function main() {
  const mails = new Observable((subscriber: Subscriber<Thread>) => {
    const threads: Thread[] = GmailApp.getInboxThreads(0, 100);

    for (let t of threads) {
      subscriber.next(t);
    }
    subscriber.complete();
  }).pipe(
    filter(withOnlyUnprocessed),
    share()
  );

  // TODO(burmudar): current thinking
  // - primary observable which has subObservers thant create actions, which
  //   will ultimately be merged into a single pipeline of actions
  // - We create an observable from all the actions, and execute each action and then let subscribers know
  // - This means Actions should remember the thread they're for
  var [airbaseMails, other] = partition(mails, withAll<Thread>(withLabels("Finance/Airbase"), withSubject("initiated\\sthe\\spayment\\sfor\\s")));
  var [therapyMails, other] = partition(other, withLabels("Therapy"));

  const all = merge(airbaseMails.pipe(map<Thread, ThreadAction>(airbaseAction)), therapyMails.pipe(map<Thread, ThreadAction>(therapyAction)));
  all.pipe(concatMap(action => action()
  other.subscribe((thread: Thread) => console.log(`skipped ${thread.getFirstMessageSubject()}`));
}
