export const MENU_OPTIONS_ADMIN = [
    {
        title: "User management",
        icon: "mdi-account-group",
        multiple: true,
        menuOptions: [
            {
                title: "Students",
                icon: "mdi-account-school",
                to: "viewStudents"
            },
            {
                title: "Supervisors",
                icon: "mdi-account-supervisor",
                to: "viewSupervisors"
            }
        ]
    },
];

export const PROJECT_DETAILS_TABS = [
    {
        to: { name: 'projectStatistics' },
        name: 'Statistics'
    },
    {
        to: { name: 'projectMeetings' },
        name: 'Meetings'
    },
    {
        to: { name: 'projectAssignments' },
        name: 'Assignments'
    },
    {
        to: { name: 'projectFunctionalities' },
        name: 'Functionalities'
    },
];

export const SETTINGS_TABS = [
    {
        to: { name: 'generalSettings' },
        name: 'General settings'
    },
    {
        to: { name: 'weights' },
        name: 'Scores'
    },
    {
        to: { name: 'supervisoryPlan' },
        name: 'Supervisory plan'
    }
];

