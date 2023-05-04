type DriveApp = GoogleAppsScript.Drive.DriveApp;
type FolderIterator = GoogleAppsScript.Drive.FolderIterator;
type Folder = GoogleAppsScript.Drive.Folder;
type BlobSource = GoogleAppsScript.Base.BlobSource;
type GBlob = GoogleAppsScript.Base.Blob;
type Attachment = GoogleAppsScript.Gmail.GmailAttachment;

function getOrCreateFolder(name: string, parent?: Folder | DriveApp) {
  if (!parent) {
    parent = DriveApp;
  }
  let folderIter: FolderIterator = parent.getFoldersByName(name);
  let folder = folderIter.hasNext() ? folderIter.next() : parent.createFolder(name);
  return _innerFolderResult(folder);
}

function _innerFolderResult(folder: Folder | DriveApp) {
  return {
    resolve: () => folder,
    getOrCreate: (name: string) => getOrCreateFolder(name, DriveApp),
  };
}

function resolveFolder(path: string): Folder | DriveApp {
  let folder = path.split("/")
    .reduce((p, c) => p.getOrCreate(c), _innerFolderResult(DriveApp))
    .resolve();

  return folder;
}


export class Drive {
  private readonly folder: Folder | DriveApp;

  private constructor(folder: Folder | DriveApp) {
    this.folder = folder
  }

  static folder(path: string): Drive {
    return new Drive(resolveFolder(path));
  }

  saveBlob(attachment: Attachment, name: string) {
    let blob: GBlob = attachment.copyBlob()

    let file = this.folder.createFile(blob);
    file.setName(name);
  }
}
