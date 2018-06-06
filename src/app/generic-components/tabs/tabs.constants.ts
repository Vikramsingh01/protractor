export const TabsData = [
    {
        structure: "ServiceUsers",
        parentLinkRegex: "",
        tabs: [
            {
                label: "My Service Users",
                link: "/offenderprofile"
            },
            {
                label: "Team Service Users",
                link: "/team-demo"
            },
            {
                 label: "CRC Service Users",
                 link: "/crc-demo"
            }
        ]
    },
    {
        structure: "Profile",
        parentLinkRegex: "/offenderprofile/:profileId",
        tabs: [
            {
                label: "Profile",
                link: ""
            },
            {
                label: "Events",
                link: "event"
            },
            {
                 label: "SU Activities",
                 link: "plan"
            }
        ]
    },
    {
        structure: "SU",
        parentLinkRegex: "/$$SU_TYPE$$/:profileId/profile",
        tabs: [
            {
                label: "SU Details",
                link: ""
            },
            {
                label: "Identifiers",
                link: "identifier"
            },
            {
                label: "Key Contacts",
                link: "contact-information"
            },
            {
                label: "Personal Circumstances",
                link: "personalcircumstance"
            },
            {
                label: "Accessibility",
                link: "offender-disability"
            },
            {
                label: "Equality & Diversity",
                link: "protected-characteristics"
            },
            {
                label: "Transfers",
                link: "transfers"
            },
            {
                label: "Interventions",
                link: "process-contact"
            },
            {
                label: "Documents",
                link: "document-store"
            },
            {
                label: "SU Mgmt.",
                link: "component-management"
            },
        ],
    },


    {
        structure: "Event",
        parentLinkRegex: "/$$SU_TYPE$$/:profileId/event/:eventId",
        tabs: [
            {
                label: "Event Details",
                link: "event-details"
            },
            {
                label: "Court Appearances",
                link: "court-appearance"
            },
            {
                label: "Additional Sentences",
                link: "offender-additional-sentence"
            },
            {
                label: "Additional Offences",
                link: "additional-offence"
            },
            {
              label: "Search DSS",
              link: "offloc"
            },
            {
                label: "Referral",
                link: "referral"
            },
            {
                label: "Court Work",
                link: "court-work"
            },
            {
                label: "Court Reports",
                link: "court-report"
            },
            {
                label: "Through The Gate",
                link: "ThroughCare"
                
            }
        ],
    },
    {
        structure: "Throughcare",
        parentLinkRegex: "/$$SU_TYPE$$/:profileId/event/:eventId/ThroughCare",
        tabs: [
            {
                label: "Details",
                link: ""
            },
            {
                label: "Institutional Report",
                link: "institutional-report"
            },
            {
                label: "Release",
                link: "release"
            },
            {
                label: "Recall",
                link: "recall"
            },
             {
                label:"PSS",
                link: "custody-pss"
            }
        ],
    },
    {
        structure: "Plan",
        parentLinkRegex: "/$$SU_TYPE$$/:profileId/plan",
        tabs: [
            {
                label: "Entries",
                link: ""
            },
            {
                label: "NS Summary",

                link: "ns-summary"
            },
            {
                label: "Schedule Appointments",
                link: "schedule-appointments",
                disabled: true
            },
            {
                label: "Community Payback",
                link: "upw"
            }
        ],
    },
    {
        structure: "PendingTransfer",
        parentLinkRegex: "/pending-transfer/:profileId/:transferRequestId",
        tabs: [{
                label: "Allocation",
                link: ""
            },
            {
                label: "Details",
                link: "details"
            },
            {
                 label: "Documents",
                 link: "document-list"
            }
        ]
    },
    {
        structure: "cmaction",
        parentLinkRegex: "/cm-actions",
        tabs: [
            {
                label: "Planned Appointments",
                link: ""
            } ,
            {
                label: "Refer To Case Manager",
                link: "refer-to-casemanager"

            },

            // {
            //      label: "Outstanding Breaches",
            //      link: "plan-appointment"
            // },
            {
                 label: "Alerts",
                 link: "alert"
            },
            // {
            //      label: "Releases",
            //      link: "plan-appointment"
            // },
             {
                  label: "Register Reviews",
                  link: "register-review"
             },{
                label: "Recent Allocations",
                link: "recent-allocations"
             }
        ]
    },
    
]