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
    {
        title: "System settings",
        icon: "mdi-cogs",
        multiple: true,
        menuOptions: [
            {
                title: "Details",
                icon: "mdi-notebook",
                to: "details"
            },
            {
                title: "Supervisory plans",
                icon: "mdi-notebook",
                to: "supervisoryPlan"
            },
            {
                title: "Compatibility weights",
                icon: "mdi-notebook",
                to: "weights"
            }
        ]
    }
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