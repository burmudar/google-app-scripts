type Gmail = GoogleAppsScript.Gmail;
type Thread = GoogleAppsScript.Gmail.GmailThread;
type Message = GoogleAppsScript.Gmail.GmailMessage;
type Label = GoogleAppsScript.Gmail.GmailLabel;
type Calendar = GoogleAppsScript.Calendar.Calendar

import { filter, Observable } from 'rxjs';

const AIRBASE_PAYDAY_EVENT_TITLE = "Airbase payday!";

function hasLabels(current: String[], labels: String[]): boolean {
  return current.filter(l => {
    return labels.findIndex(val => l === val) >= 0
  }).length > 0
}

function getOrCreateLabel(labelName: string): Label {
  let label: Label = GmailApp.getUserLabelByName(labelName);
  if (!label) {
    label = GmailApp.createLabel(labelName);
  }
  return label;
}

export function main() {
  const processedLabel = getOrCreateLabel("processed");
  const mails = new Observable<Thread>((subscriber) => {
    const threads: Thread[] = GmailApp.getInboxThreads(0, 100);

    for (let t of threads) {
      subscriber.next(t);
    }
    subscriber.complete();
  }).pipe(
    filter(t => t.isUnread()),
    filter(t => !hasLabels(t.getLabels().map(l => l.getName()), ["processed"])),
    filter(t => hasLabels(t.getLabels().map(l => l.getName()), ["Finance/Airbase"])),
    filter(t => {
      const matches = t.getFirstMessageSubject()).match('initiated\sthe\spayment\sfor\s');
  return matches.length > 0;
});

mails.subscribe((thread: Thread) => {
  thread.addLabel(processedLabel);
  thread.markRead();
  // Create an event 7 days (5 business) from now to mark the payday
  const cal: Calendar = CalendarApp.getDefaultCalendar();
  const eventDate = thread.getLastMessageDate();
  const payDate = eventDate.getDate() + 7;
  eventDate.setDate(payDate);
  // cal.createAllDayEvent(
  //   AIRBASE_PAYDAY_EVENT_TITLE,
  //   payDate
  // );
  console.log(`payday event created: ${eventDate}`)
});
}
