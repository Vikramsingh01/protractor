export class LasuOffenderProfile {
	offenderDetailId: number;
	profileId: number;
	dateDied: Date;
	dateOfBirth: Date;
	exclusionMessage: string;
	exclusionExistsYesNoId: string;
	familyName: string;
	firstName: string;
	genderId: number;
	restrictionMessage: string;
	restrictionExistsYesNoId: any;
	caseReferenceNumber: string;
	isLao: string;
	pncNumber: string;
	rsrDate: Date;
	rsrScore: string;

	teamId: number;
  hasActiveRestrictions: any;
  hasActiveExclusions: any;
  excludedForCurrentUser: any
}
