
type Gmail = GoogleAppsScript.Gmail;
type Thread = GoogleAppsScript.Gmail.GmailThread;
type Message = GoogleAppsScript.Gmail.GmailMessage;
type Label = GoogleAppsScript.Gmail.GmailLabel;


function LabelFilter(keep: Array<string>, discard: Array<string>): (m: Thread) => boolean {
    return (m: Thread): boolean => {
        let labels: Array<Label> = m.getLabels()
        return labels
            .map(l => keep.includes(l.getName()) && !discard.includes(l.getName()))
            .reduce((previousValue, currentValue) => previousValue && currentValue, true);
    }
}

function processThread(thread: Thread) {
    console.log(thread);
}

export function main() {
    let labelFilterFn = LabelFilter(["finance/airbase"], ["processed"]);
    GmailApp.getInboxThreads(0, 20).filter((m) => m.isUnread() && labelFilterFn(m)).forEach(processThread);

}
