<template>
  <v-navigation-drawer v-model="value" temporary app>
    <template v-slot:prepend>
      <v-list-item two-line v-if="loggedIn">
        <v-list-item-avatar>
          <img :src="avatarURL">
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ fullName }}</v-list-item-title>
          <v-list-item-subtitle>Logged In</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-divider v-if="loggedIn"></v-divider>
    <v-list nav dense>
      <v-list-item-group v-model="group">
        <v-list-item exact :to="{name: dashboardRoute}" v-if="loggedIn">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <the-admin-navigation-options v-if="isAdmin" />
        <the-teacher-navigation-options v-else-if="isSupervisor" />
        <the-student-navigation-options v-else-if="isStudent" />
        <v-divider v-if="loggedIn"></v-divider>
        <v-list-item v-if="loggedIn" @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Log out</v-list-item-title>
        </v-list-item>
        <v-list-item v-else :to="{ name: 'login' }">
          <v-list-item-icon>
            <v-icon>mdi-login-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Log in</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'contact' }">
          <v-list-item-icon>
            <v-icon>mdi-phone</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Contact us</v-list-item-title>
        </v-list-item>

      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins";
import AuthService from '@/services/auth-service';
import BaseMenuDropdown from "./BaseMenuDropdown.vue";
import { eventBus } from "@/main";
import { EVENT_BUS_AUTH } from '@/common/constants';
import { MENU_OPTIONS_ADMIN } from '@/common/menus';
import RoleMixin from "../mixins/RoleMixin.vue";
import TheAdminNavigationOptions from "./TheAdminNavigationOptions.vue";
import TheTeacherNavigationOptions from "./TheTeacherNavigationOptions.vue";
import TheStudentNavigationOptions from "./TheStudentNavigationOptions.vue";

export default mixins(RoleMixin).extend({
  props: {
    drawer: Boolean
  },
  components: {
    BaseMenuDropdown,
    TheAdminNavigationOptions,
    TheTeacherNavigationOptions,
    TheStudentNavigationOptions
  },
  data() {
    return {
      group: null,
      admin: MENU_OPTIONS_ADMIN,
    };
  },
  computed: {
    value: {
      get(): boolean {
        return this.drawer;
      },
      set(value: boolean) {
        this.$emit('update:drawerValue', value);
      }
    },
    loggedIn(): boolean {
      return this.isAdmin || this.isStudent || this.isSupervisor;
    },
    dashboardRoute(): string {
      return this.isAdmin? 'adminDashboard': 'dashboard';
    }
  },
  methods: {
    logout: function (): void {
      AuthService.logout();
      this.setProperties();
      this.fullName = "";
      this.avatarURL = "https://ui-avatars.com/api/?name=";
      this.$router.push({ name: 'login' });
    },

  },
  created: function () {
    this.setProperties();
  },
  mounted: function () {
    eventBus.$on(EVENT_BUS_AUTH, () => {
      this.setProperties();
    });
  },
  destroyed: function () {
    eventBus.$off(EVENT_BUS_AUTH);
  }
});
</script>