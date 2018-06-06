export class Event {
	eventId: number;
	convictionDate: Date;
	eventNumber: string;
	profileId: number;
	notes: string;
	referralDate: Date;
	outcomeId: any
	// Main offence fields start
	offenceCodeId: number;
	offenceCount: number;
	offenceDate: Date;
	takenIntoConsideration: number;
	//Main Offence fields end

	//Disposal fields start
	disposalId: number;
	enteredLength: number;
	enteredLengthUnitId: number;
	expectedEndDate: Date;
	length: number;
	lengthUnitId: number;
	lengthDays: number;
	orderTypeDisposalTypeId: number;
	osProviderId: number;
	osResponsibleOfficer: string;
	osResponsibleTeam: string;
	secondLength: number;
	secondLengthUnitId: number;
	sentenceDate: Date;
	sentenceValue: number;
	spgEventId: number;
	terminationDate: Date;
	terminationReasonId: number;
	spgVersion: string;
	spgUpdateUser: string;
	//Disposal fields end

	//Allocation Information start
	allocationInformationId: number;
	allocatedProviderId: number;
	allocationDate: Date;
	allocationDecisionId: number;
	decisionProviderId: number;
	rsrDate: Date;
	rsrProviderId: number;
	rsrScore: string;
	//Allocation Information end

	//OGRS Assessment start
	ogrsAssessmentId: number;
	ogrs2Score: number;
	ogrs3Score1: number;
	ogrs3Score2: number;
	//OGRS Assessment end
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
	cohortCode: string;
}
