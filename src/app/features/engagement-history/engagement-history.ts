export class EngagementHistory {
	engagementHistoryId: number;
	caseReferenceNumber: string;
	spgOffenderId: number;
	acceptedRejectedDate: Date;
	rejectedReason: string;
	acceptedRejectedByUserId: number;

	acceptedRejectByUser: string;

	status: string;
	createdDate: Date;
	createdBy: string;
	createdByUserId: number;
	modifiedDate: Date;
	modifiedBy: string;
	modifiedByUserId: number;
	deleted: number;
	deletedDate: Date;
	deletedBy: string;
	deletedByUserId: number;
	locked: number;
	version: number;
}
