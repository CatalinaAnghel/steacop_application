import AuthService from '@/services/AuthService';
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { Roles } from '../common/roles';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/access-denied',
    name: 'access_denied',
    component: () => import('../pages/AccessDeniedView.vue'),
    meta: {
      requiresAuth: false
    }
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
    path: '/about',
    name: 'about',
    component: () => import('../pages/AboutView.vue'),
    meta: {
      requiresAuth: true,
      roles: [
        Roles.ROLE_ADMIN
      ]
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
          return next({ name: 'login', query: { returnUrl: to.path } });
      }
      const userInfo = AuthService.parseToken(token);
      const roles = to.meta?.roles;

      // check if route is restricted by role
      if (userInfo == null) {
        // role not authorised so redirect to home page
        return next({ name: 'home' });
      }

      if(!roles.includes(userInfo.roles[0])) {
        return next({ name: 'access_denied' });
      }
  }

  next();
})

export default router
