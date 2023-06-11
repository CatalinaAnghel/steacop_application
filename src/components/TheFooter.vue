<template>
    <v-footer
    class="mt-16"
      color="primary darken-4"
      padless
    >
      <v-row
        justify="center"
        no-gutters
      >
        <v-btn
          v-for="link in links"
          :key="link.route.name"
          color="white"
          text
          rounded
          class="my-2"
          @click="$router.push(link.route)"
        >
          {{ link.text }}
        </v-btn>
        <v-col
          class="primary darken-4 py-4 text-center white--text"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>Steacop</strong>
        </v-col>
      </v-row>
    </v-footer>
  </template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    data: () => ({
        links: [
            {
                text: "Home",
                route: {
                    name: "home"
                }
            },
            {
                text: "Contact us",
                route: {
                    name: "contact"
                }
            }
        ],
    }),
});
</script>