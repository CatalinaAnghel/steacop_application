<template>
  <v-app>
    <the-navbar :drawer="drawer" @update:drawerValue="updateDrawerValue"></the-navbar>
    <the-navigation-drawer :drawer="drawer" @update:drawerValue="updateDrawerValue"></the-navigation-drawer>
    <v-main id="main-container">
      <v-row no-gutters justify="center" class="pt-5">
        <v-col cols="11" sm="11" md="10" lg="10" xl="10">
          <router-view />
        </v-col>
      </v-row>
    </v-main>
    <the-footer></the-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TheNavbar from './components/navbar/TheNavbar.vue';
import TheNavigationDrawer from './components/navbar/TheNavigationDrawer.vue';
import TheFooter from './components/TheFooter.vue';

export default defineComponent({
  name: 'App',
  data: () => {
    return {
      drawer: false,
      group: null,
      overlay: false
    }
  },
  components: {
    TheNavbar,
    TheNavigationDrawer,
    TheFooter
  },
  computed: {
    homePage: function (): boolean {
      return this.$route.name === 'home';
    }
  },
  methods: {
    updateDrawerValue: function (value: boolean) {
      this.drawer = value;
    }
  },
  mounted: function(){
    document.title = 'Thesico';
  }
});
</script>

<style>
html {
  overflow: auto !important;
}
</style>