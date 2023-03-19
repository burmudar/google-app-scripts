type Thread = GoogleAppsScript.Gmail.GmailThread;
type CalendarApp = GoogleAppsScript.Calendar.CalendarApp;
type Calendar = GoogleAppsScript.Calendar.Calendar;

export function airbaseAction(): (thread: Thread) => Thread {
  return (thread: Thread): Thread => {
    const AIRBASE_PAYDAY_EVENT_TITLE = "Airbase payday!";
    const cal: Calendar = CalendarApp.getDefaultCalendar();
    const eventDate = thread.getLastMessageDate();
    const payDate = eventDate.getDate() + 7;
    eventDate.setDate(payDate);
    cal.createAllDayEvent(
      AIRBASE_PAYDAY_EVENT_TITLE,
      eventDate
    );
    console.log(`payday event created: ${eventDate}`);
    return thread
  }
}


export function therapyAction(): (thread: Thread) => Thread {
  //TODO(burmudar): get the folder to use here from Drive
  return (thread: Thread): Thread => {
    const firstMsg = thread.getMessages()[0];
    const attachments = firstMsg.getAttachments();
    let month = firstMsg.getDate().toLocaleDateString('en-US', { month: 'short' });
    saveBlob({} as any, attachments[0], `${month}-${attachments[0].getName()}`);
    return thread;
  }
}
