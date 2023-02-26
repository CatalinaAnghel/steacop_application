export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';
export const REFRESH_TOKEN_EXPIRATION = 'refresh_token_exp';

export const EVENT_BUS_AUTH = 'auth_event';
export const SUCCESS_UPDATE_MESSAGE = 'Successfully updated';

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

export const DATA_TABLE_DEFAULT_ITEMS_PER_PAGE = 10;