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
      <v-list-item-group v-model="group" active-class="secondary lighten-5">
        <v-list-item exact :to="{ name: 'home' }" v-if="isAdmin || isStudent || isSupervisor">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'settings' }" v-if="isAdmin">
          <v-list-item-icon>
            <v-icon>mdi-cogs</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <div v-if="isAdmin">
          <base-menu-dropdown v-for="menu in admin" :key="menu.title" :menuOptions="menu.menuOptions" :icon="menu.icon"
            :title="menu.title"></base-menu-dropdown>
        </div>
        <template v-if="isSupervisor">
          <v-list-item :to="{ name: 'supervisees' }">
            <v-list-item-icon>
              <v-icon>mdi-account-school</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Supervisees</v-list-item-title>
          </v-list-item>
        </template>
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
import { EVENT_BUS_AUTH } from '@/common/constants';
import { MENU_OPTIONS_ADMIN } from '@/common/menus';

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
      admin: MENU_OPTIONS_ADMIN,
      fullName: "",
      avatarURL: "https://ui-avatars.com/api/?name="
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
    setProperties: function () {
      const role = AuthService.getRole();
      if (role !== null) {
        const parsedToken = AuthService.parseToken(AuthService.getAccessToken());
        if(parsedToken !== null && typeof parsedToken.username !== 'undefined'){
          this.fullName = parsedToken.fullName;
          const processedFullName = this.fullName.includes(" ")? this.fullName.replace(" ", "+"): this.fullName;
          this.avatarURL = this.avatarURL + processedFullName;
        }
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