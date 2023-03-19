type GmailApp = GoogleAppsScript.Gmail.GmailApp;
type Label = GoogleAppsScript.Gmail.GmailLabel;
type BlobSource = GoogleAppsScript.Base.BlobSource;

export interface MailDetails {
  recipients: string[]
  subject: string
  body: string
}

let TEST_MODE: boolean = false;

export function SetTestMode(v: boolean) {
  TEST_MODE = v;
}

export function getOrCreateLabel(labelName: string): Label {
  let label: Label = GmailApp.getUserLabelByName(labelName);
  if (!label) {
    label = GmailApp.createLabel(labelName);
  }
  return label;
}

export function sendMail(attachments: BlobSource[], details: MailDetails) {
  if (TEST_MODE) {
    details.recipients = ["william.bezuidenhout@gmail.com"]
  }

  GmailApp.sendEmail(details.recipients.join(", "), details.subject, details.body, {
    attachments: attachments
  });
}
