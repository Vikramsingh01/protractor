export class PendingTransfer {
  profileId: number;
  transferRequestId: number;
  pendingTransferId: number;
  rosh: string;
  rsr: string;
  ogrs1: any;
  ogrs2:any;
  categoryId:any;
  transferReason : string;
  dateReceived: Date;
  dateTimeReceived: Date;
  crn: string;
  serviceUserName: string;
  senderId: number;
  targetId: number;
  actionId: string;
  managedByCrc: boolean;
  descriptionId:number;
  restrictionsExistYesNoId:number;
  exclusionsExistYesNoId:number;
}