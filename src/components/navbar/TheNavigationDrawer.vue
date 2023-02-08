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
                 <base-dropdown v-for="menu in admin" :key="menu.title" :menuOptions="menu.menuOptions"
            :title="menu.title"></base-dropdown>
        </div>

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
import AuthService from '@/services/AuthService';
import { Roles, ROLE_ADMIN } from '@/common/roles';
import BaseDropdown from "./BaseDropdown.vue";

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
          title: "System configuration",
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
  created: async function () {
    const role = await AuthService.isAuthorized();
    console.log(role);
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
    }
  }
});
</script>