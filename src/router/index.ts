import AuthService from '@/services/auth-service';
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { Roles } from '../common/roles';
import { storeService } from '@/store';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/access-denied',
    name: 'access_denied',
    component: () => import('../pages/routing/AccessDeniedView.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/contact-us',
    name: 'contact',
    component: () => import('../pages/ContactView.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/LoginView.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/cms/settings',
    name: 'settings',
    redirect: { name: 'generalSettings' },
    component: () => import('../pages/admin/SystemConfigurationView.vue'),
    meta: {
      requiresAuth: true,
      roles: [
        Roles.ROLE_ADMIN
      ]
    },
    children: [
      {
        path: '',
        name: 'generalSettings',
        component: () => import('../components/settings/GeneralSettingsForm.vue'),
        meta: {
          requiresAuth: true,
          roles: [
            Roles.ROLE_ADMIN
          ]
        }
      },
      {
        path: 'weights',
        name: 'weights',
        component: () => import('../components/settings/CollaborationWeightsForm.vue'),
        meta: {
          requiresAuth: true,
          roles: [
            Roles.ROLE_ADMIN
          ]
        }
      },
      {
        path: 'supervisory-plan',
        name: 'supervisoryPlan',
        component: () => import('../components/settings/SupervisoryPlanForm.vue'),
        meta: {
          requiresAuth: true,
          roles: [
            Roles.ROLE_ADMIN
          ]
        }
      },
    ]
  },
  {
    path: '/cms/students',
    name: 'viewStudents',
    component: () => import('../pages/admin/StudentsManagementView.vue'),
    meta: {
      requiresAuth: true,
      roles: [
        Roles.ROLE_ADMIN
      ]
    },
  },
  {
    path: '/cms/supervisors',
    name: 'viewSupervisors',
    component: () => import('../pages/admin/SupervisorsManagementView.vue'),
    meta: {
      requiresAuth: true,
      roles: [
        Roles.ROLE_ADMIN
      ]
    },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomeView.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/supervisees',
    name: 'supervisees',
    component: () => import('../pages/supervisor/SuperviseesView.vue'),
    meta: {
      requiresAuth: true,
      roles: [
        Roles.ROLE_TEACHER
      ]
    }
  },
  {
    path: '/project/:id',
    name: 'project',
    props: true,
    redirect: { name: 'projectStatistics' },
    component: () => import('../pages/common/ProjectDetailsView.vue'),
    meta: {
      requiresAuth: true,
      roles: [
        Roles.ROLE_TEACHER,
        Roles.ROLE_STUDENT
      ]
    },
    beforeEnter: async (to, _, next) => {
      if (!AuthService.isLoggedIn()) {
        // the user is not logged in
        next('login');
      } else {
        let userData = storeService.user.getUser();

        if (null === userData) {
          const token = AuthService.getAccessToken();
          storeService.user.load(AuthService.parseToken(token));
          userData = storeService.user.getUser();
        }

        if (userData.projects.length > 0 && 
          typeof userData.projects.find(element=> element.id === Number(to.params.id)) !== 'undefined') {
          next();
        } else {
          next('NotFound');
        }
      }
    },
    children: [
      {
        path: '',
        name: 'projectStatistics',
        component: () => import('../components/projects/statistics/StatisticsView.vue'),
      },
      {
        path: 'meetings',
        name: 'projectMeetings',
        component: () => import('../components/projects/meetings/MeetingsCalendar.vue'),
      },
      {
        path: 'assignments',
        name: 'projectAssignments',
        component: () => import('../components/projects/assignments/AssignmentsView.vue')
      },
      {
        path: 'functionalities',
        name: 'projectFunctionalities',
        component: () => import('../pages/common/FunctionalitiesView.vue'),
      },
    ]
  },
  {
    path: '/functionality/:id',
    name: 'functionality',
    props: true,
    component: () => import('../pages/common/FunctionalityDetailsView.vue'),
    meta: {
      requiresAuth: true,
      roles: [
        Roles.ROLE_TEACHER,
        Roles.ROLE_STUDENT
      ]
    },
  },
  {
    path: '/assignment/:id',
    name: 'assignment',
    props: true,
    component: () => import('../pages/common/AssignmentDetailsView.vue'),
    meta: {
      requiresAuth: true,
      roles: [
        Roles.ROLE_TEACHER,
        Roles.ROLE_STUDENT
      ]
    },
  },
  {
    path: '/cms/dashboard',
    name: 'adminDashboard',
    component: () => import('../pages/admin/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      roles: [
        Roles.ROLE_ADMIN
      ]
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../pages/common/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      roles: [
        Roles.ROLE_STUDENT,
        Roles.ROLE_TEACHER
      ]
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/routing/NotFoundView.vue')
  },
];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const authorize = to.meta?.requiresAuth;
  const token = AuthService.getAccessToken();

  if (authorize) {
    if (token === null || !(await AuthService.isLoggedIn())) {
      // not logged in so redirect to login page with the return url
      AuthService.logout();
      return next({ name: 'login', query: { returnUrl: to.path } });
    }
    const userInfo = AuthService.parseToken(token);
    const roles = to.meta?.roles;

    // check if route is restricted by role
    if (userInfo == null) {
      // role not authorised so redirect to home page
      return next({ name: 'home' });
    }

    if (!roles.includes(userInfo.roles[0])) {
      return next({ name: 'access_denied' });
    }
  }

  next();
})

export default router
