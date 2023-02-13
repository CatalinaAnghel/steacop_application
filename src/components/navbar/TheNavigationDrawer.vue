<template>
  <v-navigation-drawer v-model="value" absolute temporary>
    <v-list nav dense>
      <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
        <v-list-item :to="{ name: 'home' }" v-if="isAdmin || isStudent || isSupervisor">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isAdmin || isStudent || isSupervisor" @click="logout">
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
        <v-divider></v-divider>

        <div v-if="isAdmin">
          <base-menu-dropdown v-for="menu in admin" :key="menu.title" :menuOptions="menu.menuOptions" :icon="menu.icon"
            :title="menu.title"></base-menu-dropdown>
        </div>
        <v-divider></v-divider>
        <v-list-item :to="{ name: 'about' }">
          <v-list-item-icon>
            <v-icon>mdi-information-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>About us</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AuthService from '@/services/auth-service';
import { Roles } from '@/common/roles';
import BaseMenuDropdown from "./BaseMenuDropdown.vue";
import { eventBus } from "@/main";
import { EVENT_BUS_AUTH, MENU_OPTIONS_ADMIN } from '@/common/constants';


export default defineComponent({
  props: {
    drawer: Boolean
  },
  components: {
    BaseMenuDropdown
  },
  emits: ["update:drawerValue"],
  data() {
    return {
      group: null,
      isAdmin: false,
      isStudent: false,
      isSupervisor: false,
      admin: MENU_OPTIONS_ADMIN
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
    }
  },
  methods: {
    logout: function (): void {
      AuthService.logout();
      this.setProperties();
      this.$router.push({ name: 'login' });
    },
    setProperties: function () {
      const role = AuthService.isAuthorized();
      if (role !== null) {
        switch (role) {
          case Roles.ROLE_ADMIN:
            this.isAdmin = true;
            break;
          case Roles.ROLE_STUDENT:
            this.isStudent = true;
            break;
          default:
            this.isSupervisor = true;
        }
      } else {
        this.isAdmin = false;
        this.isStudent = false;
        this.isSupervisor = false;
      }
    }
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