<template>
  <v-row class="my-lg-10" justify="center" align="center">
    <v-col cols="12" sm="12" md="12" lg="4" xl="4">
      <v-img  class="mx-auto" :src="require('@/assets/logo1.svg')" max-height="150" max-width="150" contain></v-img>
      <h2 class="text-center"><span class="primary--text">Thesis Coordination Platform</span></h2>
      <v-btn v-if="!loggedIn" class="mx-lg-auto mt-2" color="secondary" elevation="2" @click="$router.push({ name: 'login' })">Log
        in</v-btn>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="8" xl="8">
      <img :src="require('@/assets/home/team_collaboration_blue_background.svg')" width="100%" />
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