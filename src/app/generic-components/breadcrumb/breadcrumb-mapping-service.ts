import { Injectable } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service'



@Injectable()
export class BreadcrumbMappingService {

        constructor(private breadcrumbService: BreadcrumbService) {
                //this.constructBreadcrumbMapping();
        }
        constructBreadcrumbMapping() {

                //Service User Breadcrumb Mapping
                this.breadcrumbService.hideRoute('/error');
                this.breadcrumbService.hideRoute('/change-password');

                this.breadcrumbService.hideRouteRegex('^/lasu/([0-9]*)$');
                this.breadcrumbService.hideRouteRegex('^/lasu/([0-9]*)/([a-zA-Z0-9]*)$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/lasu/([0-9]*)/restriction/new$', 'Add Restriction');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/lasu/([0-9]*)/exclusion/new$', 'Add Exclusion');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/lasu/([0-9]*)/restriction/edit$', 'Edit Restriction');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/lasu/([0-9]*)/exclusion/edit$', 'Edit Exclusion');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/lasu/([0-9]*)/restriction/detail$', 'View Restriction');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/lasu/([0-9]*)/exclusion/detail$', 'View Exclusion');

                this.breadcrumbService.addFriendlyNameForRoute('/national-search', 'National Search');
                this.breadcrumbService.hideRouteRegex('^/national-search/([0-9]*)$');
                this.breadcrumbService.hideRouteRegex('^/national-search/([0-9]*)/([0-9]*)$');
                //     //  this.breadcrumbService.hideRoute('^/national-search/([0-9]*)$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/national-search/([0-9]*)/([0-9]*)/([a-zA-Z0-9]*)$', 'View National Search');


                this.breadcrumbService.addFriendlyNameForRoute('/my-service-user', 'My Service Users');
                this.breadcrumbService.addFriendlyNameForRoute('/team-service-user', 'Team Service Users');
                this.breadcrumbService.addFriendlyNameForRoute('/crc-service-user', 'CRC\ Service Users');
                this.breadcrumbService.hideRouteRegex('/.*-service-user/([0-9]*)$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('/.*-service-user/([0-9]*)/profile$', 'Profile');
                this.breadcrumbService.hideRouteRegex('/.*-service-user/([0-9]*)/profile/event$');
                this.breadcrumbService.hideRouteRegex('/.*-service-user/([0-9]*)/profile/event/([0-9]*)$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('/.*-service-user/([0-9]*)/profile/event/([0-9]*)/event-details$', 'Event Details');

                this.breadcrumbService.addFriendlyNameForRoute('/offenderprofile', 'My Service Users');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/offenderprofile/([0-9]*)$', 'Profile');

                this.breadcrumbService.addFriendlyNameForRoute('/service-provider', 'Service Provider');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/service-provider/([0-9]*)$', 'View Service Provider');
                this.breadcrumbService.hideRouteRegex('^/service-provider/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/service-provider/edit/([0-9]*)$', 'Edit Service Provider');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/service-provider/new$', 'Add Service Provider');


                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier$', 'Identifiers');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/edit$', 'Edit Identifiers');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/alias$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/alias/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/alias/new$', 'Add Alias');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/alias/edit/([0-9]*)$', 'Edit Alias');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/alias/([0-9]*)$', 'View Alias');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/protected-characteristics/new$', 'Add Equality & Diversity');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/protected-characteristics/edit$', 'Edit Equality & Diversity');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/protected-characteristics$', 'Equality & Diversity');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/personalcircumstance/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/personalcircumstance$', 'Personal Circumstance');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/personalcircumstance/new$', 'Add Personal Circumstance');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/personalcircumstance/edit/([0-9]*)$', 'Edit Personal Circumstance');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/personalcircumstance/([0-9]*)$', 'View Personal Circumstance');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/rate-card-intervention$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/rate-card-intervention/new$', 'Add Rate Card Intervention');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/rate-card-intervention/([0-9]*)$', 'Rate Card Intervention');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/additionalidentifier$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/additionalidentifier/new$', 'Add Additional Identifier');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/additionalidentifier/([0-9]*)$', 'View Additional Identifier');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/additionalidentifier/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/identifier/additionalidentifier/edit/([0-9]*)$', 'Edit Additional Identifier');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/transfers$', 'Transfer Out Request');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/transfers/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/transfers/edit/([0-9]*)$', 'Edit/Withdraw Transfer Out Request');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/offenderaddress$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/offenderaddress/new$', 'Add Offender Address');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/offenderaddress/([0-9]*)$', 'Offender Address');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/case-chronology$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/case-chronology/new$', 'Add Case Chronology');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/case-chronology/([0-9]*)$', 'Case Chronology');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/registration$', 'Registrations');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/new$', 'Add Registrations');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/edit/([0-9]*)$', 'Edit Registrations');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/([0-9]*)$', 'View Registrations');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/([0-9]*)/deregistration$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/deregistration/new$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/deregistration$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/([0-9]*)/deregistration/([0-9]*)$', 'View Deregistration');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/deregistration/new/([0-9]*)$', 'Add Deregistration');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/([0-9]*)/registration-review$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/([0-9]*)/registration-review/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/([0-9]*)/registration-review/new$', 'Add Registration Review');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/([0-9]*)/registration-review/edit/([0-9]*)$', 'Edit Registration Review');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/registration/([0-9]*)/registration-review/([0-9]*)$', 'View Registration Review');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/documents/([0-9]*)$', 'Documents');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/document-store$', 'Documents');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/document-store/new$', 'Add Document');
                // Event Breadcrumb Mapping
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event$', 'Events');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/edit$', 'Edit Event');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details$', 'Event Details');

                // Enablers Breadcrumb Mapping
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/enablers/referral$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/enablers/referral/new$', 'Add Referral');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/enablers/referral/([0-9]*)$', 'Referral');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/enablers/referral/([0-9]*)/assessment$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/enablers/referral/([0-9]*)/assessment/new$', 'Add assessment');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/enablers/referral/([0-9]*)/assessment/([0-9]*)$', 'Assessment');


                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/approvedpremisesreferral$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/approvedpremisesreferral/new$', 'Add approved premises referral');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/approvedpremisesreferral/([0-9]*)$', 'Approved Premises Referral');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/approvedpremisesreferral/([0-9]*)/approved-premises-residence$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/approved-premises-residence/new$', 'Add approved premises residence');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/approvedpremisesreferral/([0-9]*)/approved-premises-residence/([0-9]*)$', 'Approved Premises Residence');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/community-requirement$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/community-requirement/([0-9]*)$', 'Requirement Details');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/pss-requirement$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/pss-requirement/new$', 'Add PSS requirement');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/pss-requirement/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/pss-requirement/edit/([0-9]*)$', 'Edit PSS requirement');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/pss-requirement/([0-9]*)$', 'View PSS Requirement');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/pss-requirement/([0-9]*)/pss-requirement-manager$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/pss-requirement-manager/new$', 'Add PSS requirement manager');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/pss-requirement/([0-9]*)/pss-requirement-manager/([0-9]*)$', 'PSS Requirement Manager');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/additionaloffence$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/additional-offence', 'additional offence');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/additional-offence/([0-9]*)$', 'View Additional Offence');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/courtappearance$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-appearance', ' court appearance');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-appearance/([0-9]*)$', 'view court appearance');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/offenderadditionalsentence$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/offender-additional-sentence', 'additional sentence');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/offender-additional-sentence/([0-9]*)$', 'view additional sentence');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/cohort$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/cohort/new$', 'Add cohort');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/cohort/([0-9]*)$', 'Cohort');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ordermanager$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ordermanager/new$', 'Add order manager');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ordermanager/([0-9]*)$', 'Order Manager');


                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/recall$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/recall/new$', 'Add recall');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/recall/([0-9]*)$', 'Recall');


                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/drug-test$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/drug-test/new$', 'Add drug test');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/drug-test/([0-9]*)$', 'Drug Test');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/drug-test/([0-9]*)/drug-test-result$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/drug-test/([0-9]*)/drug-test-result/new$', 'Add drug test result');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/drug-test/([0-9]*)/drug-test-result/([0-9]*)$', 'Drug Test result');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/psscontact$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/psscontact/new$', 'Add pss contact');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/psscontact/([0-9]*)$', 'Pss Contact');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/licence-condition$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/licence-condition/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/licence-condition/new$', 'Add Licence Condition');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/licence-condition/edit/([0-9]*)$', 'Edit Licence Condition');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/licence-condition/([0-9]*)$', 'View Licence Condition');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/licence-condition/([0-9]*)/licence-condition-manager/([0-9]*)$', 'Licence Condition Manager');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/licence-condition/([0-9]*)/licence-condition-manager$');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/community-requirement$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/community-requirement/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/community-requirement/edit/([0-9]*)$', 'Edit Requirement');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/event-details/community-requirement/([0-9]*)$', 'View Requirement');

                // UPW Breadcrumb Mapping
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/upw/upwappointment$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/upw/upwappointment/new$', 'Add Community Payback Appointment');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/upw/upwappointment$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/upw/upwappointment/([0-9]*)$', 'Community Payback Appointment');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/upw/upwAdjustment$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/upw/upwAdjustment/new$', 'Add Community Payback Appointment');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/upw/upwAdjustment/([0-9]*)$', 'Community Payback Adjustment');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/upw/upwdetails$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/upw/upwdetails/new$', 'Add Community Payback details');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/upw/upwdetails/([0-9]*)$', 'Community Payback details');

                // court-and-custody Breadcrumb Mapping
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody$', 'court & custody');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody/institutional-report$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody/institutional-report/new$', 'Add Institutional Report');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody/institutional-report/([0-9]*)$', 'Institutional Report');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody/custodykeydate$');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody/custodykeydate/new$', ' Add Custody Key Date');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody/custodykeydate/([0-9]*)$', 'Custody Key Date');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody/courtappearance/([0-9]*)/court-report$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody/courtappearance/([0-9]*)/court-report/new$', 'Add Court Reports');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody/courtappearance/([0-9]*)/court-report/([0-9]*)$', 'court reports');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody/courtappearance/([0-9]*)/court-report/([0-9]*)/proposedrequirement$');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody/courtappearance/([0-9]*)/court-report/([0-9]*)/proposedrequirement/([0-9]*)$', 'proposed requirement');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody/custodylocation/([0-9]*)$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-and-custody/custodylocation/([0-9]*)$', 'Custody location');

                //--- Event Breadcrumb Mapping End---

                // health-and-availability Breadcrumb Mapping
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/health-and-availability$', 'health & availability');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/offender-disability$', 'Accessibility');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/offender-disability/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/offender-disability/new$', 'Add Accessibility');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/offender-disability/edit/([0-9]*)$', 'Edit Accessibility');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/offender-disability/([0-9]*)$', 'View Accessibility');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/offender-disability/([0-9]*)/provision$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/offender-disability/([0-9]*)/provision/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/offender-disability/([0-9]*)/provision/new$', 'Add Accessibility Provision');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/offender-disability/([0-9]*)/provision/edit/([0-9]*)$', 'Edit Accessibility Provision');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/offender-disability/([0-9]*)/provision/([0-9]*)$', 'View Accessibility Provision');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/health-and-availability/offender-disability/([0-9]*)/provision$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/health-and-availability/offender-disability/([0-9]*)/provision/new$', 'Add Accessibility provision');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/health-and-availability/offender-disability/([0-9]*)/provision/([0-9]*)$', 'Accessibility provision');
                //--- health-and-availability Breadcrumb Mapping End---

                //contcat-information

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information$', 'Key Contacts');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/edit$', 'Edit Key Contacts');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/new$', 'Add Key Contacts');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/edit/([0-9]*)$', 'Edit Key Contacts');


                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/address/([0-9]*)/address-assessment$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/address/([0-9]*)/address-assessment/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/address/([0-9]*)/address-assessment/new$', 'Add Address Assessment');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/address/([0-9]*)/address-assessment/edit/([0-9]*)$', 'Edit Address Assessment');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/address/([0-9]*)/address-assessment/([0-9]*)$', 'View Address Assessment');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/address/([0-9]*)/address-assessment$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/address/([0-9]*)/address-assessment/new$', 'Add Address Assessment');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/address/([0-9]*)/address-assessment/([0-9]*)$', 'View Address Assessment');

                // contact-information Breadcrumb Mapping

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information$', 'Key Contacts');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/plan$', 'SU Activities');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/plan/contact$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/plan/contact/edit$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/plan/contact/generate-letter$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/plan/contact/new$', 'Add Plan Entry');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/plan/contact/([0-9]*)$', 'View Plan Entry');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/plan/contact/edit/([0-9]*)$', 'Edit Plan Entry');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/plan/contact/generate-letter/([0-9]*)$', 'Generate Letter');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/network$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/network/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/network/new$', 'Add Network');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/network/edit/([0-9]*)$', 'Edit Network');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/network/([0-9]*)$', 'View Network');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/address$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/address/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/address/new$', 'Add address');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/address/edit/([0-9]*)$', 'Edit address');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/address/([0-9]*)$', 'View address');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/offenderaddress/([0-9]*)/address-assessment$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/offenderaddress/([0-9]*)/address-assessment/new$', 'Add address assessment');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/offenderaddress/([0-9]*)/address-assessment/([0-9]*)$', 'address-assessment');

                //--- contact-information Breadcrumb Mapping End---

                // additional-context Breadcrumb Mapping
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/additional-context$', 'additional context');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/additional-context/process-contact/new$', 'Add process contact');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/additional-context/process-contact$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/additional-context/process-contact/([0-9]*)$', 'process contact');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/additional-context/allocateprocess/new$', 'Add allocate process');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/additional-context/allocateprocess$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/additional-context/allocateprocess/([0-9]*)$', 'allocate process');

                //--- additional-context Breadcrumb Mapping End---
                //--- Service User Breadcrumb Mapping End---

                  //Pending Transfer Breadcrumb Mapping
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/pending-transfer$', 'Pending Transfers');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/pending-transfer-out$', 'Transfer Out Requests');
                //        this.breadcrumbService.addFriendlyNameForRouteRegex('^/pending-transfer/([0-9]*)/([0-9]*)/allocation$', 'Components to Allocate');
                this.breadcrumbService.hideRouteRegex('^/pending-transfer/([0-9]*)$')
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/pending-transfer/([0-9]*)/([0-9]*)$', 'Components to Allocate')
                //this.breadcrumbService.addFriendlyNameForRouteRegex('^/pending-transfer/([0-9]*)/([0-9]*)/allocation$', 'Components to Allocate');
                this.breadcrumbService.hideRouteRegex('^/pending-transfer/([0-9]*)/([0-9]*)/([0-9]*)$');
                this.breadcrumbService.hideRouteRegex('^/pending-transfer/([0-9]*)/([0-9]*)/([0-9]*)/([0-9]*)/([0-9]*)$')
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/pending-transfer/([0-9]*)/([0-9]*)/([0-9]*)/([0-9]*)', 'Allocation');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/pending-transfer/([0-9]*)/([0-9]*)$', 'View Pending Transfer');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/pending-transfer/([0-9]*)/([0-9]*)/document-list$', 'Documents');
                // this.breadcrumbService.hideRouteRegex('^/pending-transfer/([0-9]*)/([0-9]*)/allocation$')



                this.breadcrumbService.hideRouteRegex('^/pending-transfer/([0-9]*)/case-manager-allocation$');
                this.breadcrumbService.hideRouteRegex('^/pending-transfer/([0-9]*)/([0-9]*)/case-manager-allocation$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/pending-transfer/([0-9]*)/([0-9]*)/case-manager-allocation/([0-9]*)$', 'case manager allocation');
                this.breadcrumbService.hideRouteRegex('^/pending-transfer/([0-9]*)/([0-9]*)/allocation/([0-9]*)/([0-9]*)/([0-9]*)');
                this.breadcrumbService.hideRouteRegex('^/pending-transfer/([0-9]*)/engagement-history$')
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/pending-transfer/([0-9]*)/engagement-history/([0-9]*)$', 'engagement history');
                //---Pending Transfer Breadcrumb Mapping End---
                //InstitutionalReport



                this.breadcrumbService.addFriendlyNameForRouteRegex('/ThroughCare', 'Through The Gate');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/release/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/release$', 'release');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/release/new$', 'Add Release');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/release/edit/([0-9]*)$', 'Edit Release');

                this.breadcrumbService.addFriendlyNameForRouteRegex('/ThroughCare', 'Through The Gate');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/recall/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/recall$', 'Recall');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/recall/([0-9]*)$', 'View Recall');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/recall/new$', 'Add Recall');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/recall/edit/([0-9]*)$', 'Edit Recall');

                this.breadcrumbService.addFriendlyNameForRouteRegex('/ThroughCare', 'Through The Gate');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/custody-pss/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/custody-pss$', 'PSS');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/custody-pss/([0-9]*)$', 'View PSS');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/custody-pss/new$', 'Add PSS');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/custody-pss/edit/([0-9]*)$', 'Edit PSS');

                //         this.breadcrumbService.addFriendlyNameForRouteRegex('/custody-key-date', 'Key Dates');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/custody-key-date$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/custody-key-date/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/custody-key-date/new$', 'Add Key Date');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/custody-key-date/([0-9]*)$', 'View Key Date');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/custody-key-date/edit/([0-9]*)$', 'Edit Key Date');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/contact-information/edit$', 'Edit key date');
                //---Service Provider Contact Breadcrumb Mapping ---
                this.breadcrumbService.addFriendlyNameForRoute('/service-provider-contact', 'Service Provider Contact');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/service-provider-contact/([0-9]*)$', 'View Service Provider Contact');
                this.breadcrumbService.hideRouteRegex('^/service-provider-contact/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/service-provider-contact/edit/([0-9]*)$', 'Edit Service Provider Contact');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/service-provider-contact/new$', 'Add Service Provider Contact');
                //---Service Provider Contact Breadcrumb Mapping End---


                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare$', 'Through The Gate');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/custody-location/edit$');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/custody-location$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/custody-location/edit/([0-9]*)$', 'Edit Location');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/new$', 'Add Referral');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/edit/([0-9]*)$', 'Edit Referral');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)$', 'View Referral');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/assessment$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/assessment/new$', 'Add assessment');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/assessment/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/assessment/edit/([0-9]*)$', 'Edit Assessment');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/assessment/([0-9]*)$', 'View Assessment');

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/drugTestProfile$');
                //this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/drugTestProfile/([0-9]*)/new$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/drugTestProfile/([0-9]*)$', 'Edit Drug Test Profile');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/drugTestProfile/new$', 'Add Drug Test Profile');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/drug-test$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/drug-test/new$', 'Add Drug Test');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/drug-test/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/drug-test/edit/([0-9]*)$', 'Edit Drug Test');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/referral/([0-9]*)/drug-test/([0-9]*)$', 'View Drug Test');
                //--- Referral and Assessment drug test profile and drug test Breadcrumb Mapping End---

                //--- UPW project Breadcrumb Mapping ---
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/upw-project$', 'Community Payback Project');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/upw-project/([0-9]*)$', 'Project Details');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/upw-project/new$', 'Add Community Payback Project');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/upw-project/edit/([0-9]*)$', 'Edit Community Payback Project');
                this.breadcrumbService.hideRouteRegex('^/upw-project/edit$');
                this.breadcrumbService.hideRouteRegex('^/upw-project/project-attendance$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/upw-project/project-attendance/([0-9]*)$', 'Project Attendance List');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/upw-project/project-attendance/bulk-update/([0-9]*)$', 'Community Payback Session Project Outcome');
                this.breadcrumbService.hideRouteRegex('^/upw-project/project-attendance/bulk-update$');



                //--- UPW project Breadcrumb Mapping End---

                //InstitutionalReport
                this.breadcrumbService.addFriendlyNameForRouteRegex('/ThroughCare', 'Through The Gate');
                this.breadcrumbService.addFriendlyNameForRouteRegex('/institutional-report', 'institutional report');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/institutional-report/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/institutional-report/new$', 'Add Institutional Report');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/institutional-report/([0-9]*)$', 'View Institutional Report');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/ThroughCare/institutional-report/edit/([0-9]*)$', 'Edit Institutional Report');
                //this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/edit$', 'Edit institutional-report');
                //InstitutionalReport

                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/enablers/institutional-report$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/enablers/institutional-report/new$', 'Add institutional-report');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/enablers/institutional-report/([0-9]*)$', 'institutional-report');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/edit/([0-9]*)$', 'Edit institutional-report');
                //this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/contact-information/edit$', 'Edit institutional-report');

                this.breadcrumbService.addFriendlyNameForRouteRegex('/court-work', 'court work');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-work/new$', 'Add Court Work');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-work/edit/([0-9]*)$', 'Edit Court Work');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-work/([0-9]*)$', 'View Court Work');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/court-work/edit$', 'Edit Court Work');

                this.breadcrumbService.addFriendlyNameForRouteRegex('/court-report', 'court reports');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-report$', 'court reports');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-report/new$', 'Add court reports');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-report/edit/([0-9]*)$', 'Edit court reports');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-report/([0-9]*)$', 'View court reports');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/court-report/edit$');

                this.breadcrumbService.addFriendlyNameForRoute('/admin-court-work', 'Court Work');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/admin-court-work/([0-9]*)/([0-9]*)/edit/([0-9]*)$', 'Edit Court Work');
                this.breadcrumbService.hideRouteRegex('^/admin-court-work/([0-9]*)/([0-9]*)/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/admin-court-work/([0-9]*)/([0-9]*)/([0-9]*)$', 'View Court Work');
                this.breadcrumbService.hideRouteRegex('^/admin-court-work/$');
                this.breadcrumbService.hideRouteRegex('^/admin-court-work/([0-9]*)$');
                this.breadcrumbService.hideRouteRegex('^/admin-court-work/([0-9]*)/([0-9]*)$');

                this.breadcrumbService.addFriendlyNameForRouteRegex('/.*-service-user/([0-9]*)/plan/ns-summary$', 'NS Summary');

                this.breadcrumbService.addFriendlyNameForRouteRegex('/.*-service-user/([0-9]*)/plan/upw$', 'Community Payback Summary');
                this.breadcrumbService.addFriendlyNameForRouteRegex('/.*-service-user/([0-9]*)/plan/upw/upw-detail/([0-9]*)/event/([0-9]*)$', 'View Community Payback Details');
                this.breadcrumbService.addFriendlyNameForRouteRegex('/.*-service-user/([0-9]*)/plan/upw/upw-detail/edit/([0-9]*)$', 'Edit Community Payback Details');
                this.breadcrumbService.hideRouteRegex('/.*-service-user/([0-9]*)/plan/upw/upw-detail/edit$');
                this.breadcrumbService.hideRouteRegex('/.*-service-user/([0-9]*)/plan/upw/upw-detail/([0-9]*)$');
                this.breadcrumbService.hideRouteRegex('/.*-service-user/([0-9]*)/plan/upw/upw-detail/([0-9]*)/event/([0-9]*)/upw-appointment$');
                this.breadcrumbService.hideRouteRegex('/.*-service-user/([0-9]*)/plan/upw/upw-detail$');
                this.breadcrumbService.hideRouteRegex('/.*-service-user/([0-9]*)/plan/upw/upw-detail/([0-9]*)/event$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('/.*-service-user/([0-9]*)/plan/upw/upw-detail/([0-9]*)/event/([0-9]*)/upw-appointment/recurring$', 'Schedule Recurring Community Payback Appointment');
                this.breadcrumbService.addFriendlyNameForRouteRegex('/.*-service-user/([0-9]*)/plan/upw/upw-detail/([0-9]*)/event/([0-9]*)/upw-appointment/single$', 'Schedule Community Payback appointment');
                this.breadcrumbService.addFriendlyNameForRouteRegex('/.*-service-user/([0-9]*)/plan/upw/upw-detail/([0-9]*)/event/([0-9]*)/upw-appointment/([0-9]*)$', 'View Community Payback appointment');
                this.breadcrumbService.addFriendlyNameForRouteRegex('/.*-service-user/([0-9]*)/plan/upw/upw-detail/([0-9]*)/event/([0-9]*)/upw-appointment/edit/([0-9]*)$', 'Edit Community Payback appointment');
                this.breadcrumbService.hideRouteRegex('/.*-service-user/([0-9]*)/plan/upw/upw-detail/([0-9]*)/event/([0-9]*)/upw-appointment/edit$');

                this.breadcrumbService.addFriendlyNameForRoute('/enforcement', 'Enforcements');
                this.breadcrumbService.hideRouteRegex('^/enforcement/([0-9]*)/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/enforcement/([0-9]*)/edit/([0-9]*)$', 'Edit Plan Entry');
                this.breadcrumbService.hideRouteRegex('^/enforcement/([0-9]*)/contact$');
                this.breadcrumbService.hideRouteRegex('^/enforcement/([0-9]*)$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/enforcement/([0-9]*)/contact/([0-9]*)$', 'View Plan Entry');
                this.breadcrumbService.hideRouteRegex('^/enforcement/$');


                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/component-management$', 'SU Management');



                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/component-management$', 'SU Management');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/component-management$', 'SU Management');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/process-contact/new$', 'Add Interventions');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/process-contact/edit/([0-9]*)$', 'Edit Interventions');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/process-contact/([0-9]*)$', 'View Interventions');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/process-contact$', 'Interventions');
                this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/process-contact/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/process-contact/new$', 'Add Interventions');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/process-contact/edit/([0-9]*)/([0-9]*)$', 'Edit Interventions');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/profile/process-contact/([0-9]*)/([0-9]*)$', 'View Interventions');
                  this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/process-contact/([0-9]*)$');
                   this.breadcrumbService.hideRouteRegex('^/.*-service-user/([0-9]*)/profile/process-contact/edit/([0-9]*)$');

                //for search DSS
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/offloc$', 'Search DSS');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-service-user/([0-9]*)/event/([0-9]*)/offloc/([0-9]*)$', 'DSS Comparison');

                //cm-actions


                // this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/refer-to-casemanager$', 'Refer To Casemanager');
                // this.breadcrumbService.hideRouteRegex('^/.*-actions/refer-to-casemanager/([0-9]*)$');
                // this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/refer-to-casemanager/([0-9]*)/([0-9]*)[?*]profileLoc=([0-9]*)', 'View Plan Appointment');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/plan-appointment$', 'Plan Appointment');
                this.breadcrumbService.hideRouteRegex('^/.*-actions/([0-9]*)$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/([0-9]*)/([0-9]*)[?*]profileLoc=([0-9]*)', 'View Plan Appointment');
                this.breadcrumbService.hideRouteRegex('^/.*-actions/([0-9=?]*)/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/([0-9=?]*)/edit/([0-9]*)[?*]profileLoc=([0-9]*)$', 'Edit Plan Appointment');

                // this.breadcrumbService.hideRouteRegex('^/.*-actions/refer-to-casemanager/([0-9=?]*)/edit$');
                // this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/refer-to-casemanager/([0-9=?]*)/edit/([0-9]*)[?*]profileLoc=([0-9]*)$', 'Edit Plan Appointment');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/refer-to-casemanager$', 'Refer To Casemanager');
                this.breadcrumbService.hideRouteRegex('^/.*-actions/refer-to-casemanager/([0-9]*)$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/refer-to-casemanager/([0-9]*)/([0-9]*)[?*]profileLoc=([0-9]*)', 'View Plan Appointment');
                this.breadcrumbService.hideRouteRegex('^/.*-actions/refer-to-casemanager/([0-9=?]*)/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/refer-to-casemanager/([0-9=?]*)/edit/([0-9]*)[?*]profileLoc=([0-9]*)$', 'Edit Plan Appointment');


                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/alert$', 'Alert');

                this.breadcrumbService.hideRouteRegex('^/.*-actions/alert/([0-9]*)$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/alert/([0-9]*)/([0-9]*)[?*]profileLoc=([0-9]*)', 'View Plan Appointment');
                this.breadcrumbService.hideRouteRegex('^/.*-actions/alert/([0-9=?]*)/edit$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/alert/([0-9=?]*)/edit/([0-9]*)[?*]profileLoc=([0-9]*)$', 'Edit Plan Appointment');


                //Recently Allocated
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/recently-allocated', 'Recently Allocated');

                this.breadcrumbService.addFriendlyNameForRoute('/lasu', 'LASU');

                this.breadcrumbService.addFriendlyNameForRoute('/recently-viewed', 'Recently Viewed');

                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/register-review$', 'Register Review');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/register-review/([0-9]*)/([0-9]*)[?*]profileLoc=([0-9]*)','View Registrations');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/register-review/([0-9=?]*)/edit/([0-9=?]*)/([0-9]*)[?*]profileLoc=([0-9]*)$', 'Edit Registrations Review');
                this.breadcrumbService.hideRouteRegex('^/.*-actions/register-review/edit$');
                this.breadcrumbService.hideRouteRegex('^/.*-actions/register-review/([0-9]*)$');
                this.breadcrumbService.hideRouteRegex('^/.*-actions/register-review/([0-9=?]*)/edit$');
                this.breadcrumbService.hideRouteRegex('^/.*-actions/register-review/([0-9=?]*)/edit/([0-9]*)$');
                this.breadcrumbService.addFriendlyNameForRouteRegex('^/.*-actions/recent-allocations$', 'Recent Allocation');
}
}
