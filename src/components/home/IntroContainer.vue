<template>
  <v-row class="my-lg-16 py-lg-16" justify="center">
    <v-col cols="12" sm="12" md="12" lg="6" xl="6">
      <h1 class="primary--text">Steacop</h1>
      <h3><span class="primary--text">S</span>tudent-<span class="primary--text">Tea</span>cher <span
          class="primary--text">Co</span>llaboration <span class="primary--text">P</span>latform</h3>
      <v-btn v-if="!loggedIn" class="mx-lg-auto mt-2" color="secondary" elevation="2" @click="$router.push({ name: 'login' })">Log
        in</v-btn>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="6" xl="6">
      <img :src="require('@/assets/home/team_collaboration.svg')" width="100%" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import AuthService from "@/services/auth-service";
import { defineComponent } from "vue";

export default defineComponent({
  computed: {
    loggedIn: function(): boolean{
      return AuthService.isLoggedIn();
    }
  }
});
</script>

<style lang="scss" scoped>
.main-container {
  padding: unset !important;
}
</style>