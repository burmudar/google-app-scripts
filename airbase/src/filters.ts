type Thread = GoogleAppsScript.Gmail.GmailThread;
type Label = GoogleAppsScript.Gmail.GmailLabel;

export function withOnlyUnprocessed(thread: Thread): boolean {
  if (!thread.isUnread()) {
    return false
  }

  return !hasLabels(thread.getLabels().map(l => l.getName()), ["processed"])
}

export function withLabels(...labels: [string]): (thread: Thread) => boolean {
  return (thread: Thread) => {
    const current: string[] = thread.getLabels().map((l: Label) => l.getName())
    return hasLabels(current, labels);
  }
}

export function withSubject(subject: string): (thread: Thread) => boolean {
  return (thread: Thread) => {
    const matches = thread.getFirstMessageSubject().match(subject);
    return matches.length > 0;
  }
}

export function withAll<T>(...filters: [(item: T) => boolean]): (item: T) => boolean {
  return (item: T) => {
    for (let f of filters) {
      if (!f(item)) {
        return false;
      }
    }
    return true;
  }
}

function hasLabels(current: string[], labels: string[]): boolean {
  return current.filter(l => {
    return labels.findIndex(val => l === val) >= 0
  }).length > 0
}

