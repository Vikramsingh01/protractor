import { environment } from '../../environments/environment';
import { Config } from '../configuration/config';
export const ServiceUrlConstants = {
  AdditionalIdentifier: '/additional-identifier-api/additionalidentifier',
  AUTHENTICATION: '/authentication-api',
  LIST: '/list-service-api/list',
  AD: '/list-service-api/child/answers/',
  PARENT_ANSWERS: '/list-service-api/parent/answers/',
  QD: '/question-dependency-api/qdList/',
  LISTBYPARAM: '/list-service-api/list-by-param',
  CASE_MANAGER_ALLOCATION: '/case-manager-allocation-api/casemanagerallocation',
  AUTHORIZATION: '/authorization-api',
  OFFENDERADDRESS: '/offender-address/neooffenderaddress',
  ADDRESS: '/address-api/address',
  COURTAPPEARANCE: '/court-appearance-api/courtappearance',
  REFERRAL: '/referral-api/referral',
  ASSESSMENT: '/assessment-api/assessment',
  CourtReport: '/court-report-api/courtreport',
  PROVIDERS: '/list/listof',
  NEOINSTITUTIONALREPORT: '/institutional-report-api/institutionalreport',
  ALIAS: '/alias-api/alias',
  CUSTODYLOCATION: '/custody-location-api/custodylocation',
  AddressAssessment: '/address-assesment-api/addressassesment',
  TERMINATEEVENT: '/terminate-sentence-api/terminatesentence',
  PROPOSEDREQUIREMENT: '/proposed-requirement-api/proposedrequirement',
  CUSTODYKEYDATE: '/custody-key-date-api/custodykeydate',
  GENERIC_LIST: '/list-service-api/listof',
  PersonalCircumstance: '/personal-circumstance-api/personalcircumstance',
  RELEASE: '/release-api/release',
  PROVIDERLAODETAIL: '/provider-lao-detail-api/providerlaodetail',
  PERSONALCONTACT: '/personal-contact-api/personalcontact',
  Registration: '/registration-api/registration',
  RegistrationReview: '/registration-review-api/registrationreview',
  ORDERMANAGER: '/order-manager-api/ordermanager',
  NETWORK: '/network-api/network',
  LicenceCondition: '/licence-condition-api/licencecondition',
  LICENCECONDITIONMANAGER: '/licence-condition-manager-api/licenceconditionmanager',
  ADDITIONALOFFENCE: '/additional-offence-api/additionaloffence',
  PSSREQUIREMENT: '/pss-requirement-api/pssrequirement',
  PSSREQUIREMENTMANAGER: '/pss-requirement-manager-api/pssrequirementmanager',
  OFFENDERADDITIONALSENTENCE: '/offender-additional-sentence-api/offenderadditionalsentence',
  REQUIREMENTMANAGER: '/requirement-manager-api/requirementmanager',
  RECALL: '/recall-api/recall',
  PSSCONTACT: '/pss-contact-api/psscontact',
  OFFENDERMANAGER: '/offender-manager-api/offendermanager',
  COHORT: '/cohort-api/cohort',
  OFFENDERPROFILE: '/neo-offender-profile/offenderprofile',
  SERVICEUSER: '/service-user-api/serviceuser',
  TRANSGENDERPROCESS: '/service-user-api/transgenderprocess',
  PROCESSCONTACT: '/process-contact-api/processcontact',
  OFFENDERDISABILITY: '/offender-disability-api/offenderdisability',
  PROVISION: '/provision-api/provision',
  RATECARDINTERVENTION: '/rate-card-intervention-api/ratecardintervention',
  EVENT: '/neo-event-api/neoevent',
  COMMUNITYREQUIREMENT: '/community-requirement-api/communityrequirement',
  APPROVEDPREMISERESIDENCE: '/approved-premises-residence-api/approvedpremiseresidence',
  UPWADJUSTMENT: '/neo-upw-adjustment-api/upwadjustment',
  DEREGISTRATIONSPG: '/neo-deregistrationspg-api/neoderegistrationspg',
  DEREGISTRATION: '/registration-api/deregistration',
  CONTACT: '/contact-api/contact',
  APPROVEDPREMISESREFERRAL: '/approved-premises-referral-api/neoaprrovedpremisesrefferal',
  OFFENDER_IDENTITY: '/offender-identity-service-api/offenderidentity',
  ALLOCATEPROCESS: '/allocate-process-api/allocateprocess',
  TERMINATESENTENCE: '/neo-event-api/terminatesentence',
  PENDINGTRANSFEREVENT: '/pending-transfer-event',
  INDUCTIONLETTER: '/induction-letter-api/inductionletter',
  ENGAGEMENTHISTORY: '/engagement-history-api/engagementhistory',
  NSRDLIST: '/list-service-api/nsrdlist',
  SERVICEPROVIDER: '/service-provider-api/serviceprovider',
  SERVICEPROVIDERCONTACT: '/service-provider-contact-api/serviceprovidercontact',
  TRANSFER_OUT_REQUEST: '/transfer-out-request-api/transferoutrequest',
  UpwProject: '/upw-project-api/upwproject',
  UpwDetail: '/upw-details-api/upwdetails',
  UpwAppointment: '/upw-appointment-api/upwappointment',
  PendingTransfer: '/service-user-api/pendingtransfer',
  ConsolidatedTransferResponse: '/consolated-transfer-response-api/consolatedtransferresponse',
  ConsolidatedTransferRequest: '/consolated-transfer-response-api/consolatedtransferrequest',
  DRUGTESTPROFILE: '/drug-test-profile-api/drugtestprofile',
  UpwAdjustment: '/upw-adjustment-api/upwadjustment',
  institutionalReport: '/institutional-report-api/institutionalreport',
  CourtWork: '/court-work-api/courtwork',
  DRUGTEST: '/drug-test-api/drugtest',
  DRUGSTESTRESULT: '/drug-test-result-api/drugtestresult',
  DOCUMENTSTORE: '/drs-api',
  OFFLOCREQUEST: '/offloc-request-api/offlocrequest',
  OFFLOCRESPONSE: '/offloc-request-api/offlocresponse',
  NationalSearch:  '/national-search-api/nationalsearch',
 NationalSearchResponseHeader:  '/national-search-api/nationalsearchresponseheader',
 NationalSearchResponseDetail:  '/national-search-api/nationalsearchresponsedetail',
 NationalSearchResponseRegistration:  '/national-search-api/nationalsearchresponseregistration',
 NationalSearchResponseCircumstance:  '/national-search-api/nationalsearchresponsecircumstance',
 NationalSearchResponseEvent:  '/national-search-api/nationalsearchresponseevent',
  LASURESTRICTION: '/service-user-api/lasu/restriction',
  LASUEXCLUSION: '/service-user-api/lasu/exclusion',

  CMS: 'cms',
  DRS: 'drs'
};

export function ServerUrl(apiName){
  let config = Config.getInstance();
  return config[apiName];
}