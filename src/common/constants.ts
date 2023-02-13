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
        to: ""
      },
      {
        title: "Supervisors",
        icon: "mdi-account-supervisor",
        to: ""
      }
    ]
  },
  {
    title: "System settings",
    icon: "mdi-cogs",
    multiple: true,
    menuOptions: [
      {
        title: "Supervisory plans",
        icon: "mdi-notebook",
        to: ""
      }
    ]
  }
];