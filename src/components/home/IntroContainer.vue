<template>
  <v-row class="my-lg-10" justify="center">
    <v-col cols="12" sm="12" md="12" lg="4" xl="4">
      <h1 class="primary--text pt-16 mt-10">Thesico</h1>
      <h3><span class="primary--text">Thesico (Thesis Coordination Platform)</span></h3>
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