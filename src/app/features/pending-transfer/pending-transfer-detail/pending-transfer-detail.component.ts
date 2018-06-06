import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { FormBuilder } from '@angular/forms';
import { TransferRequestService } from '../transfer-request-services/transfer-request.service'
import { Alias } from '../../alias/alias';
import { AliasService } from '../../alias/alias.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { ListService } from '../../../services/list.service';
import { OffenderProfile } from '../../offenderprofile/offenderprofile';
import { OffenderProfileService } from '../../offenderprofile/offenderprofile.service';
import { OffenderManagerService } from '../../offendermanager/offendermanager.service';
import { OffenderManager } from '../../offendermanager/offendermanager';
import { AdditionalIdentifierService } from '../../additional-identifier/additional-identifier.service';
import { AdditionalIdentifier } from '../../additional-identifier/additional-identifier';
import { PersonalCircumstanceService } from '../../personal-circumstance/personal-circumstance.service';
import { PersonalCircumstance } from '../../personal-circumstance/personal-circumstance';
import { AssessmentService } from '../../assessment/assessment.service';
import { Assessment } from '../../assessment/assessment';
import { ReferralService } from '../../referral/referral.service';
import { Referral } from '../../referral/referral';
import { CourtReportService } from '../../court-report/court-report.service';
import { CourtReport } from '../../court-report/court-report';
import { ApprovedPremiseResidenceService } from '../../approvedpremiseresidence/approvedpremiseresidence.service';
import { ApprovedPremiseResidence } from '../../approvedpremiseresidence/approvedpremiseresidence';
import { EventService } from '../../event/event.service';
import { Event } from '../../event/event';
import { AdditionalOffenceService } from '../../additional-offence/additional-offence.service';
import { AdditionalOffence } from '../../additional-offence/additional-offence';
import { CommunityRequirementService } from '../../community-requirement/community-requirement.service';
import { CommunityRequirement } from '../../community-requirement/community-requirement';
import { CustodyLocationService } from '../../custody-location/custody-location.service';
import { CustodyLocation } from '../../custody-location/custody-location';
import { ReleaseService } from '../../release/release.service';
import { Release } from '../../release/release';
import { LicenceConditionService } from '../../licence-condition/licence-condition.service';
import { LicenceCondition } from '../../licence-condition/licence-condition';
import { AddressAssessmentService } from '../../address-assessment/address-assessment.service';
import { AddressAssessment } from '../../address-assessment/address-assessment';
import { CourtAppearanceService } from '../../court-appearance/court-appearance.service';
import { CourtAppearance } from '../../court-appearance/court-appearance';
import { CohortService } from '../../cohort/cohort.service';
import { Cohort } from '../../cohort/cohort';
import { Network } from '../../network/network';
import { NetworkService } from '../../network/network.service';
import { addressService } from '../../address/address.service';
import { Address } from '../../address/address';
import { ProcessContactService } from '../../process-contact/process-contact.service';
import { ProcessContact } from '../../process-contact/process-contact';
import { LicenceConditionManager } from '../../licence-condition-manager/licence-condition-manager';
import { LicenceConditionManagerService } from '../../licence-condition-manager/licence-condition-manager.service';
import { ProvisionService } from '../../provision/provision.service';
import { Provision } from '../../provision/provision';
import { CustodyKeyDateService } from '../../custody-key-date/custody-key-date.service';
import { CustodyKeyDate } from '../../custody-key-date/custody-key-date';
import { InstitutionalReportService } from '../../institutional-report/institutional-report.service';
import { InstitutionalReport } from '../../institutional-report/institutional-report';
import { PssRequirementManagerService } from '../../pss-requirement-manager/pss-requirement-manager.service';
import { PssRequirementManager } from '../../pss-requirement-manager/pss-requirement-manager';
import { OffenderDisabilityService } from '../../offender-disability/offender-disability.service';
import { OffenderDisability } from '../../offender-disability/offender-disability';
import { OffenderAdditionalSentenceService } from '../../offender-additional-sentence/offender-additional-sentence.service';
import { OffenderAdditionalSentence } from '../../offender-additional-sentence/offender-additional-sentence';
import { PssRequirementService } from '../../pss-requirement/pss-requirement.service';
import { PssRequirement } from '../../pss-requirement/pss-requirement';
import { RegistrationService } from '../../registration/registration.service';
import { Registration } from '../../registration/registration';
import { ApprovedPremisesReferralService } from '../../approvedpremisesreferral/approvedpremisesreferral.service';
import { ApprovedPremisesReferral } from '../../approvedpremisesreferral/approvedpremisesreferral';
import { ProviderLaoDetailService } from '../../providerlaodetail/providerlaodetail.service';
import { ProviderLaoDetail } from '../../providerlaodetail/providerlaodetail';
import { OrderManagerService } from '../../ordermanager/ordermanager.service';
import { OrderManager } from '../../ordermanager/ordermanager';
import { ContactService } from '../../contact/contact.service';
import { Contact } from '../../contact/contact';
import { AllocateProcessService } from '../../allocateprocess/allocateprocess.service';
import { AllocateProcess } from '../../allocateprocess/allocateprocess';
import { RequirementManagerService } from '../../requirementmanager/requirementmanager.service';
import { RequirementManager } from '../../requirementmanager/requirementmanager';
import { ProposedRequirementService } from '../../proposedrequirement/proposedrequirement.service';
import { ProposedRequirement } from '../../proposedrequirement/proposedrequirement';
import { PssContactService } from '../../psscontact/psscontact.service';
import { PssContact } from '../../psscontact/psscontact';
import { RegistrationReviewService } from '../../registration-review/registration-review.service';
import { RegistrationReview } from '../../registration-review/registration-review';

import { RateCardInterventionService } from '../../rate-card-intervention/rate-card-intervention.service';
import { RateCardIntervention } from '../../rate-card-intervention/rate-card-intervention';

import { HeaderService } from '../../../views/header/header.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-pending-transfer-detail',
    templateUrl: 'pending-transfer-detail.component.html',
    providers: [AliasService,
        TokenService,
        TransferRequestService,
        OffenderProfileService,
        OffenderManagerService,
        AdditionalIdentifierService,
        PersonalCircumstanceService,
        AssessmentService,
        ReferralService,
        CourtReportService,
        EventService,
        ApprovedPremiseResidenceService,
        CohortService,
        CourtAppearanceService,
        AddressAssessmentService,
        LicenceConditionService,
        ReleaseService,
        CustodyLocationService,
        CommunityRequirementService,
        AdditionalOffenceService,
        NetworkService,
        addressService,
        ProcessContactService,
        LicenceConditionManagerService,
        ProvisionService,
       // DrugTestService,
        CustodyKeyDateService,
        InstitutionalReportService,
        PssRequirementManagerService,
        OffenderDisabilityService,
        OffenderAdditionalSentenceService,
        PssRequirementService,
        RegistrationService,
        RegistrationReviewService,
        ApprovedPremisesReferralService,
        ProviderLaoDetailService,
        OrderManagerService,
        ContactService,
      //  DocumentService,
        AllocateProcessService,
        RequirementManagerService,
        ProposedRequirementService,
        PssContactService,
        RateCardInterventionService,
        SortSearchPagination


    ],

})
export class PendingTransferDetailComponent implements OnInit {

    private subscription: Subscription;
    private offenderProfile: OffenderProfile;
    private profileId: number;
    private transferRequestId: number;
    private offenderDetailId: number;

    private aliasList: Alias[] = [];
    private offenderManagers: OffenderManager[] = [];
    private additionalIdentifiers: AdditionalIdentifier[] = [];
    private personalCircumstances: PersonalCircumstance[] = [];
    private assessments: Assessment[] = [];
    private referrals: Referral[] = [];
    private courtReports: CourtReport[] = [];
    private events: Event[] = [];
    private additionalOffences: AdditionalOffence[] = [];
    private cohorts: Cohort[] = [];
    // private upwAdjustmentList: UPWAdjustment[] = [];
    private licenceConditionsList: LicenceCondition[] = [];
    private addressAssessmentsList: AddressAssessment[] = [];
    private approvedPremiseResidences: ApprovedPremiseResidence[] = [];
    private courtAppearances: CourtAppearance[] = [];
    private releases: Release[] = [];
    private custodyLocations: CustodyLocation[] = [];
    private communityRequirements: CommunityRequirement[] = [];
    private provisions: Provision[] = [];
    private licenceConditionManagerList: LicenceConditionManager[] = [];
    private processContacts: ProcessContact[] = [];
    private networks: Network[] = [];
    private offenderAddressesList: Address[] = [];
    // private drugTests: DrugTest[] = [];

    private custodyKeyDates: CustodyKeyDate[] = [];
    private institutionalReports: InstitutionalReport[]=[];
    private pssRequirementManagers: PssRequirementManager[] = [];
    private offenderDisabilitys: OffenderDisability[] = [];
    private offenderAdditionalSentences: OffenderAdditionalSentence[] = [];
    // private upwDetails: Upwdetails[] = [];
    private pssRequirements: PssRequirement[] = [];
    private registrations: Registration[] = [];
    private registrationReviews: RegistrationReview[] = [];
    private approvedPremisesReferrals: ApprovedPremisesReferral[] = [];
    private offenderProfiles: OffenderProfile[] = [];
    private providerLaoDetails: ProviderLaoDetail[] = [];
    public isLaoDetailsExist: boolean;
    private pendingTransferRegistrations: Registration[] = [];

    public transferReasonId = 1;
    private orderManagers: OrderManager[] = [];
    private contacts: Contact[] = [];
    private documents: Document[] = [];
    private allocateProcessList: AllocateProcess[] = [];
    private requirementmanagerList: RequirementManager[] = [];
    private requirementmanagerNewList: RequirementManager[] = [];
    private proposedRequirementList: ProposedRequirement[] = [];
    private pssContacts: PssContact[] = [];
    private rateCardInterventionList: RateCardIntervention[] = [];
    // private UpwAppointmentList: UpwAppointment[] = [];
    // private UpwdetailsList: Upwdetails[] = [];
    private RegistrationReviewList: RegistrationReview[] = [];

    genderList: any[];
    private event: Event = new Event();
    private registration: Registration = new Registration();
    private courtAppearance: CourtAppearance = new CourtAppearance();
    private pssRequirement: PssRequirement = new PssRequirement();
    private offenderDisability: OffenderDisability = new OffenderDisability();
    private approvedPremisesReferral: ApprovedPremisesReferral = new ApprovedPremisesReferral();
    private offenderManagerTransferRequest;
    private transferRequest;
    private orderSupervisorTransferRequests;
    private courtReportTransferRequests;
    private institutionalReportTransferRequests;
    private postSentenceSupervisionTransferRequests;
    private licenceConditionTransferRequests;
    private requirementTransferRequests;
    private nonStatutoryInterventionTransferRequests;

    private acceptFlagId;
    private rejectFlagId;
    private drsResponseStatus;
    private error: boolean = false;
    private methodName='';
    private confirmBox=false;
    private rejectReason='';
    constructor(private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private transferRequestService: TransferRequestService,
        private aliasService: AliasService,
        private offenderProfileService: OffenderProfileService,
        private offenderManagerService: OffenderManagerService,
        private additionalIdentifierService: AdditionalIdentifierService,
        private personalcircumstanceService: PersonalCircumstanceService,
        private assessmentService: AssessmentService,
        private referralService: ReferralService,
        private courtAppearanceService: CourtAppearanceService,
        private courtReportService: CourtReportService,
        private eventService: EventService,
        private approvedPremiseResidenceService: ApprovedPremiseResidenceService,
        private cohortService: CohortService,
        private addressAssessmentService: AddressAssessmentService,
        // private upwAdjustmentService: UPWAdjustmentService,
        private licenceConditionService: LicenceConditionService,
        private releaseService: ReleaseService,
        private custodyLocationService: CustodyLocationService,
        private communityRequirementService: CommunityRequirementService,
        private additionalOffenceService: AdditionalOffenceService,
         private networkService:NetworkService,
        private processContactService: ProcessContactService,
        private addressService: addressService,
        private licenceConditionManagerService: LicenceConditionManagerService,
        private provisionService: ProvisionService,
        private custodyKeyDateService: CustodyKeyDateService,
        private institutionalReportService:InstitutionalReportService,
        private pssRequirementManagerService: PssRequirementManagerService,
        private offenderDisabilityService: OffenderDisabilityService,
        private offenderAdditionalSentenceService: OffenderAdditionalSentenceService,
        private pssRequirementService: PssRequirementService,
        private registrationService: RegistrationService,
        private registrationReviewService: RegistrationReviewService,
        private approvedPremisesReferralService: ApprovedPremisesReferralService,
        private listService: ListService,
        private providerLaoDetailService: ProviderLaoDetailService,
        private orderManagerService: OrderManagerService,
        private contactService: ContactService,
       // private documentService: DocumentService,
        private allocateProcessService: AllocateProcessService,
        private requirementManagerService: RequirementManagerService,
        private proposedRequirementService: ProposedRequirementService,
        private pssContactService: PssContactService,
        private rateCardInterventionService: RateCardInterventionService,
        private headerService: HeaderService,
        private confirmService: ConfirmService,
        private sortSearchPagination: SortSearchPagination,
        private titleService: Title

    ) {
        this.sortSearchPagination = new SortSearchPagination();
        this.sortSearchPagination.paginationObj.size = 1000000;
    }

    ngOnInit() {
        this.titleService.setTitle('View Pending Transfer Details');
        this.listService.getListDataWithLookup(229, 405).subscribe(statusList => {
            statusList.forEach(status => {
                if (status.value == 'TA') {
                    this.acceptFlagId = status.key;
                }
                if (status.value == 'TR') {
                    this.rejectFlagId = status.key;
                }
            })
        });
        this.subscription = this.route.params.subscribe((params: any) => {
            this.offenderDetailId = params['profileId'];
            this.profileId = params['profileId'];
            this.transferRequestId = params['transferRequestId'];



            let alias: Alias = new Alias();
            let offendermanager: OffenderManager = new OffenderManager()
            let additionalidentifier: AdditionalIdentifier = new AdditionalIdentifier();
            let personalCircumstance: PersonalCircumstance = new PersonalCircumstance();
            let assessment: Assessment = new Assessment();
            let referral: Referral = new Referral();
            let courtReport: CourtReport = new CourtReport();
            let event: Event = new Event();
            let courtAppearance: CourtAppearance = new CourtAppearance();
            let additionalOffence: AdditionalOffence = new AdditionalOffence();
           // let licenceCondition: LicenceCondition = new LicenceCondition();
            let cohort: Cohort = new Cohort();
           // let communityrequirement: CommunityRequirement = new CommunityRequirement();
            let custodylocation: CustodyLocation = new CustodyLocation();
            let release: Release = new Release();
            let addressassessment: AddressAssessment = new AddressAssessment();
            let approvedpremiseresidence: ApprovedPremiseResidence = new ApprovedPremiseResidence();
            let processContact: ProcessContact = new ProcessContact();
            let network:Network  = new Network();
            //let licenceConditionManager: LicenceConditionManager = new LicenceConditionManager();
            let offenderAddresse: Address = new Address();
            let provision: Provision = new Provision();
            let custodykeydate: CustodyKeyDate = new CustodyKeyDate();
            let institutionalReport: InstitutionalReport = new InstitutionalReport();
            let pssRequirementManager: PssRequirementManager = new PssRequirementManager();
            let offenderDisability: OffenderDisability = new OffenderDisability();
            let offenderAdditionalSentence: OffenderAdditionalSentence = new OffenderAdditionalSentence();
            let pssRequirement: PssRequirement = new PssRequirement();
            let registration: Registration = new Registration();
            let registrationReview: RegistrationReview = new RegistrationReview();
            let approvedPremisesReferral: ApprovedPremisesReferral = new ApprovedPremisesReferral();
            let transferRequest: any = {};
            let providerlaodetail: ProviderLaoDetail = new ProviderLaoDetail();
            let ordermanager: OrderManager = new OrderManager();
            let allocateprocess: AllocateProcess = new AllocateProcess();
            let requirementmanager: RequirementManager = new RequirementManager();
            let proposedRequirement: ProposedRequirement = new ProposedRequirement();
            let pssContact: PssContact = new PssContact();
            let rateCardIntervention: RateCardIntervention = new RateCardIntervention();

            this.offenderProfileService.getOffenderProfileByProfileId(this.profileId).subscribe((data: OffenderProfile) => {

                this.headerService.publishOffenderDetailsData(data);
                this.offenderProfile = data;
                this.profileId = this.offenderProfile.profileId;
                alias.profileId = this.profileId;
                offendermanager.profileId = this.profileId;
                additionalidentifier.profileId = this.profileId;
                personalCircumstance.profileId = this.profileId;
                transferRequest.transferRequestId = this.transferRequestId;
                network.profileId=this.profileId;
                processContact.profileId = this.profileId;
                //licenceConditionManager.providerId = this.p;
                offenderAddresse.profileId = this.profileId;
                offenderDisability.profileId = this.profileId;
                registration.profileId = this.profileId;
                event.profileId = this.profileId;
                providerlaodetail.profileId = this.profileId;
                allocateprocess.profileId = this.profileId;
                allocateprocess.profileId = this.profileId;
                rateCardIntervention.profileId = this.profileId;


                this.eventService.getEventForPendingTransfer(this.profileId).subscribe(data => {
                    this.events = data;

                    this.events.forEach(element => {
                      
                        let licenceCondition: LicenceCondition = new LicenceCondition();
                        let communityrequirement: CommunityRequirement = new CommunityRequirement();
                        this.event = element;

                        referral.eventId = this.event.eventId;
                        courtAppearance.eventId = this.event.eventId;
                        additionalOffence.eventId = this.event.eventId;
                        licenceCondition.eventId = this.event.eventId;
                        cohort.eventId = this.event.eventId;
                        communityrequirement.eventId = this.event.eventId;
                        custodylocation.eventId = this.event.eventId;
                        release.eventId = this.event.eventId;
                        custodykeydate.eventId = this.event.eventId;
                        institutionalReport.eventId = this.event.eventId;
                        offenderAdditionalSentence.eventId = this.event.eventId;
                        pssRequirement.eventId = this.event.eventId;
                        approvedPremisesReferral.eventId = this.event.eventId;
                        ordermanager.eventId = this.event.eventId;
                        pssContact.eventId = this.event.eventId

                        this.rateCardInterventionService.searchRateCardIntervention(rateCardIntervention).subscribe(rateCardInterventionList => {
                            this.rateCardInterventionList = rateCardInterventionList.content
                        });
                        this.allocateProcessService.searchAllocateProcess(allocateprocess).subscribe(allocateProcessList => {
                            this.allocateProcessList = allocateProcessList.content;
                        });
                        this.processContactService.sortFilterAndPaginate(processContact,null,null).subscribe((data) => {
                            this.processContacts = data.content;
                        });

                        this.additionalOffenceService.sortFilterAndPaginate(additionalOffence, null ,null).subscribe((data) => {
                            data.content.forEach(additionalOffenceData => {
                                this.additionalOffences.push(additionalOffenceData);
                            })
                        });

                        this.orderManagerService.sortFilterAndPaginate(ordermanager, null, null).subscribe((data) => {
                            data.content.forEach(orderManagerData => {
                                this.orderManagers.push(orderManagerData);
                            })
                        });

                        this.pssContactService.searchPssContact(pssContact).subscribe((data) => {
                            data.content.forEach(pssContactData => {
                                this.pssContacts.push(pssContactData);
                            })
                        });

                        this.referralService.sortFilterAndPaginate(referral, null, null).subscribe((data) => {
                            data.content.forEach(referralData => {
                                this.referrals.push(referralData);
                            })
                            this.referrals.forEach(element => {
                                let assessment = new Assessment();
                                assessment.referralId = element.referralId;
                                this.assessmentService.sortFilterAndPaginate(assessment,null,null).subscribe((assessmentdata) => {
                                    assessmentdata.content.forEach(assessmentData => {
                                        this.assessments.push(assessmentData);
                                    })
                                });
                            });
                        });

                        this.pssRequirementService.sortFilterAndPaginate(pssRequirement,null,null).subscribe(data => {
                            data.content.forEach(pssRequirementData => {
                                this.pssRequirements.push(pssRequirementData);
                            })
                            this.pssRequirements.forEach(element => {
                                this.pssRequirement = element;
                                pssRequirementManager.pssRequirementId = this.pssRequirement.pssRequirementId;

                                this.pssRequirementManagerService.searchPssRequirementManager(pssRequirementManager).subscribe((reman) => {
                                    reman.content.forEach(pssRequirementManagerData => {
                                        if(this.pssRequirementManagers.map(element => element.pssRequirementManagerId).
                                            indexOf(pssRequirementManagerData.pssRequirementManagerId) == -1 ){
                                                this.pssRequirementManagers.push(pssRequirementManagerData);
                                        }
                                        
                                    })
                                });

                            });
                        });


                        this.approvedPremisesReferralService.searchApprovedPremisesReferral(approvedPremisesReferral).subscribe((approvedPremisesReferrals) => {
                            approvedPremisesReferrals.content.forEach(approvedPremisesReferralData => {
                                this.approvedPremisesReferrals.push(approvedPremisesReferralData);
                            })
                            this.approvedPremisesReferrals.forEach(element => {
                                this.approvedPremisesReferral = element;
                                approvedpremiseresidence.approvedPremiseReferralId = this.approvedPremisesReferral.approvedPremiseReferralId;
                                this.approvedPremiseResidenceService.searchApprovedPremiseResidence(approvedpremiseresidence).subscribe((data) => {
                                    data.content.forEach(approvedPremiseResidenceData => {
                                        this.approvedPremiseResidences.push(approvedPremiseResidenceData);
                                    })
                                });
                            });
                        });

                        this.offenderAdditionalSentenceService.sortFilterAndPaginate(offenderAdditionalSentence,null,null).subscribe((data) => {
                            data.content.forEach(offenderAdditionalSentenceData => {
                                this.offenderAdditionalSentences.push(offenderAdditionalSentenceData);
                            })
                        });

                        this.custodyKeyDateService.sortFilterAndPaginate(custodykeydate, null, null).subscribe((data) => {
                            console.log('==cusitfyy==='+data.content);
                            data.content.forEach(custodyKeyDateData => {
                                this.custodyKeyDates.push(custodyKeyDateData);
                            })
                        });

                        this.institutionalReportService.sortFilterAndPaginate(institutionalReport, null, null).subscribe((data) => {
                            data.content.forEach(institutionalReportData => {
                                this.institutionalReports.push(institutionalReportData);
                            })
                        });

                        this.institutionalReportService.sortFilterAndPaginate(institutionalReport, null, null).subscribe((data) => {
                            data.content.forEach(institutionalReportData => {
                                this.institutionalReports.push(institutionalReportData);
                            })
                        });

                        this.releaseService.sortFilterAndPaginate(release, null ,null).subscribe((data) => {
                            data.content.forEach(releaseData => {
                                this.releases.push(releaseData);
                            })
                        });

                        this.custodyLocationService.searchCustodyLocation(custodylocation).subscribe((data) => {
                            data.content.forEach(custodyLocationData => {
                                this.custodyLocations.push(custodyLocationData);
                            })
                        });

                        this.communityRequirementService.sortFilterAndPaginate(communityrequirement,null,null).subscribe((data) => {
                            data.content.forEach(communityRequirementData => {
                                this.communityRequirements.push(communityRequirementData);
                            })
                            this.communityRequirements.forEach(element => {
                              let requirementManager = new RequirementManager();
                             
                                requirementManager.communityRequirementId = element.communityRequirementId;
                                this.requirementManagerService.searchRequirementManager(requirementManager).subscribe(rqManagers => {
                                    rqManagers.content.forEach(requirementmanagerData => {
                                       
                                        if(this.requirementmanagerList.map(element => element.requirementManagerId).
                                            indexOf(requirementmanagerData.requirementManagerId) == -1 ){
                                                this.requirementmanagerList.push(requirementmanagerData);
                                        }
                                       
                                    })
                                })

                            });
                        });

                        this.cohortService.searchCohort(cohort).subscribe((data) => {
                            data.content.forEach(cohortData => {
                                this.cohorts.push(cohortData);
                            })

                        });

                        this.licenceConditionService.sortFilterAndPaginate(licenceCondition,null,null).subscribe((data) => {
                            data.content.forEach(licenceConditionData => {
                                this.licenceConditionsList.push(licenceConditionData);
                            })
                            this.licenceConditionsList.forEach(element => {
                              let licenceConditionManager=new LicenceConditionManager();
                                 licenceConditionManager.licenceConditionId = element.licenceConditionId;
                                this.licenceConditionManagerService.sortFilterAndPaginate(licenceConditionManager,null,null).subscribe(managers => {
                                    managers.content.forEach(manData => {
                                        
                                        
                                        if(this.licenceConditionManagerList.map(element => element.licenceConditionManagerId).
                                            indexOf(manData.licenceConditionManagerId) == -1 ){
                                                this.licenceConditionManagerList.push(manData);
                                        }
                                    })
                                })

                            });
                        });


                        this.courtAppearanceService.sortFilterAndPaginate(courtAppearance,null,null).subscribe((data) => {
                          //  this.courtAppearances =null;
                            data.content.forEach(courtAppearanceData => {

                                this.courtAppearance=courtAppearanceData;
                                this.courtAppearances.push(courtAppearanceData);

                                courtReport.courtAppearanceId = this.courtAppearance.courtAppearanceId;
                                 this.courtReportService.sortFilterAndPaginate(courtReport, null, null).subscribe((data) => {
                                    data.content.forEach(courtReportData => {
                                        this.courtReports.push(courtReportData);
                                          this.courtAppearances.forEach(element => {
                                this.courtAppearance = element;
                                      this.courtReports.forEach(elements => {
                                        proposedRequirement.courtReportId = elements.courtReportId;
                                        this.proposedRequirementService.searchProposedRequirement(proposedRequirement).subscribe(proposedRequirementList => {
                                            proposedRequirementList.content.forEach(proposedRequirementData => {
                                                this.proposedRequirementList.push(proposedRequirementData);
                                            })

                                        })
                                  });
                                    });
                                    })
                    })

                          
                               // courtReport.courtAppearanceId = this.courtAppearance.courtAppearanceId;


                               
                            });
                        });
                    });
                })

                this.registrationService.sortFilterAndPaginate(registration,null,null).subscribe(data => {
                    this.registrations = data.content;
                    this.registrations.forEach(element => {


                        this.registration = element;
                        registrationReview.registrationId = this.registration.registrationId

                        this.registrationReviewService.sortFilterAndPaginate(registrationReview,null,null).subscribe((data) => {

                            data.content.forEach(elementData => {
                                this.registrationReviews.push(elementData);
                             });
                        });

                    });

                });
                this.offenderDisabilityService.sortFilterAndPaginate(offenderDisability,null,null).subscribe(data => {
                    this.offenderDisabilitys = data.content;

                    this.offenderDisabilitys.forEach(element => {
                        this.offenderDisability = element
                        provision.offenderDisabilityId = this.offenderDisability.offenderDisabilityId;
                        this.provisionService.sortFilterAndPaginate(provision, null, null).subscribe(data => {
                            this.provisions = data.content;
                        });

                    });
                });

                this.aliasService.sortFilterAndPaginate(alias, null, null).subscribe(aliasList => {
                    this.aliasList = aliasList.content;
                });

                this.rateCardInterventionService.searchRateCardIntervention(rateCardIntervention).subscribe(rateCardInterventionList => {
                    this.rateCardInterventionList = rateCardInterventionList.content
                });


                this.allocateProcessService.searchAllocateProcess(allocateprocess).subscribe(allocateProcessList => {
                    this.allocateProcessList = allocateProcessList.content;
                });
                this.addressService.sortFilterAndPaginate(offenderAddresse,null,null).subscribe((data) => {

                    this.offenderAddressesList = data.content;
                    this.offenderAddressesList.forEach(elements => {

                        addressassessment.offenderAddressId = elements.offenderAddressId;
                        this.addressAssessmentService.sortFilterAndPaginate(addressassessment, null, null).subscribe((obj) => {
                            this.addressAssessmentsList = obj.content;
                        })
                    })
                });

                this.additionalIdentifierService.sortFilterAndPaginate(additionalidentifier, this.sortSearchPagination.paginationObj, null).subscribe((data) => {
                    this.additionalIdentifiers = data.content;
                });

                this.offenderManagerService.searchOffenderManager(offendermanager).subscribe((data) => {
                    this.offenderManagers = data.content;
                });

             this.personalcircumstanceService.sortFilterAndPaginate(personalCircumstance, null, null).subscribe((data) => {
                     this.personalCircumstances = data.content;
                 });

                this.processContactService.sortFilterAndPaginate(processContact,null,null).subscribe((data) => {
                    this.processContacts = data.content;
                });
                this.providerLaoDetailService.searchProviderLaoDetail(providerlaodetail).subscribe((data) => {
                    if (data.content.length > 0) {
                        this.isLaoDetailsExist = true;
                    }
                });

                 this.networkService.sortFilterAndPaginate(network,null,null).subscribe((data)=>{
                this.networks = data.content;
               });

                this.addressService.sortFilterAndPaginate(offenderAddresse,null,null).subscribe((data) => {
                    this.offenderAddressesList = data.content;
                });



            },error=>{

            });
        })
        this.transferRequestService.getConsolidatedTransferRequest(this.transferRequestId).subscribe((consolidatedTransferRequest: any)=>{
          this.transferRequest = consolidatedTransferRequest.transferRequest;
          this.offenderManagerTransferRequest = consolidatedTransferRequest.omTransferRequest;
          this.orderSupervisorTransferRequests = consolidatedTransferRequest.osTransferRequests;
          this.requirementTransferRequests = consolidatedTransferRequest.rqTransferRequests;
          this.licenceConditionTransferRequests = consolidatedTransferRequest.lcTransferRequests;
          this.postSentenceSupervisionTransferRequests = consolidatedTransferRequest.pssTransferRequests;
          this.nonStatutoryInterventionTransferRequests = consolidatedTransferRequest.nsiTransferRequests;
          this.courtReportTransferRequests = consolidatedTransferRequest.crTransferRequests;
          this.institutionalReportTransferRequests = consolidatedTransferRequest.irTransferRequests;

        })

    }

    isAuthorized(action) {
        // return this.authorizationService.isFeatureActionAuthorized(OffenderProfileConstants.featureId, action);
        return true;
    }
    isFeildAuthorized(field) {
        if (field == 'spgVersion' || field == 'spgUpdateUser') {
            return false;
        }
        // return this.authorizationService.isFeildAuthorized(OffenderProfileConstants.featureId, field, "Read");
        return true;
    }

}
