<template>
  <v-navigation-drawer v-model="value" absolute temporary>
    <v-list nav dense>
      <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title><router-link :to="{ name: 'home' }">Home</router-link></v-list-item-title>
        </v-list-item>

        <div v-if="isAdmin">
          <base-dropdown v-for="menu in admin" :key="menu.title" :menuOptions="menu.menuOptions" :icon="menu.icon"
            :title="menu.title"></base-dropdown>
        </div>
        <v-list-item v-else>
          <v-list-item-icon>
            <v-icon>mdi-login-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title><router-link :to="{ name: 'login' }">Log in</router-link></v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isAdmin || isStudent || isSupervisor">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title @click="logout">Log out</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-information-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title><router-link :to="{ name: 'about' }">About us</router-link></v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AuthService from '@/services/auth-service';
import { Roles } from '@/common/roles';
import BaseDropdown from "./BaseDropdown.vue";
import { eventBus } from "@/main";
import { EVENT_BUS_AUTH_EVENT } from '@/common/constants';

export default defineComponent({
  props: {
    drawer: Boolean
  },
  components: {
    BaseDropdown
  },
  emits: ["update:drawerValue"],
  data() {
    return {
      group: null,
      isAdmin: false,
      isStudent: false,
      isSupervisor: false,
      admin: [
        {
          title: "User management",
          icon: "mdi-account-group",
          menuOptions: [
            {
              title: "Students",
              icon: "mdi-account-school",
              link: ""
            },
            {
              title: "Supervisors",
              icon: "mdi-account-supervisor",
              link: ""
            }
          ]
        },
        {
          title: "System settings",
          icon: "mdi-cogs",
          menuOptions: [
            {
              title: "Students",
              icon: "mdi-account-school",
              link: ""
            },
            {
              title: "Supervisors",
              icon: "mdi-account-supervisor",
              link: ""
            }
          ]
        }
      ]
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
    eventBus.$on(EVENT_BUS_AUTH_EVENT, () => {
      this.setProperties();
    });
  },
  destroyed: function () {
    eventBus.$off(EVENT_BUS_AUTH_EVENT);
  }
});
</script>