import { Drive } from "drive";

type Thread = GoogleAppsScript.Gmail.GmailThread;
type Calendar = GoogleAppsScript.Calendar.Calendar;

function nextBusinessDay(start: Date, days: number): Date {
  const currentDate = new Date(start);
  // Loop through each day and check if it's a business day
  while (days > 0) {
    // Add one day to the current date
    currentDate.setDate(currentDate.getDate() + 1);

    // Check if the current day is a weekend
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      days--;
    }
  }

  return currentDate

}
type ActionFn = (thread: Thread) => Thread;

export class ThreadAction {
  private readonly thread: Thread;
  private readonly actionFn: ActionFn
  constructor(thread: Thread, fn: ActionFn) {
    this.thread = thread;
    this.actionFn = fn;
  }

  do(): Thread {
    return this.actionFn(this.thread)
  }
}

export function airbaseAction(thread: Thread): ThreadAction {
  const fn = (thread: Thread): Thread => {
    const AIRBASE_PAYDAY_EVENT_TITLE = "Airbase payday!";
    const cal: Calendar = CalendarApp.getDefaultCalendar();
    const eventDate = thread.getLastMessageDate();
    // Calculate the next business day (5 days from today)
    const payDate = nextBusinessDay(new Date(), 5);
    // Set the date of the event to the next business day
    eventDate.setDate(payDate.getDate());
    // Create an all-day event on the calendar with the payday title and date
    cal.createAllDayEvent(
      AIRBASE_PAYDAY_EVENT_TITLE,
      eventDate
    );
    console.log(`payday event created: ${eventDate}`);
    return thread
  }
  return new ThreadAction(thread, fn);
}


export function therapyAction(thread: Thread): ThreadAction {
  //TODO(burmudar): get the folder to use here from Drive

  const year = new Date().getFullYear();
  const path = `Bill-Admin/Therapy/${year}`;
  const folder = Drive.folder(path);
  const fn = (thread: Thread): Thread => {
    const firstMsg = thread.getMessages()[0];
    const attachments = firstMsg.getAttachments();
    let month = firstMsg.getDate().toLocaleDateString('en-US', { month: 'short' });
    folder.saveBlob(attachments[0], `${month}-${attachments[0].getName()}`);
    return thread;
  }
  return new ThreadAction(thread, fn);
}
