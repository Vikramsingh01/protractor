export class OffenderProfileSummary {
	name : string;
	dateOfBirth: Date;
	alias : string = "Not Recorded";
	fullAddress : string;
	mobileNumber: string;
	pncNumber: string;
	ethnicityId: number;
	nationalityId: number;
	accessibilityStatus : string = "Not Recorded";
	prisonLocationId : number;
	teamId : number;
	caseManagerId : number;
	teamContactNumber : string;
	offenderManagerResponsibleOfficer : string;
	note : string;
}
