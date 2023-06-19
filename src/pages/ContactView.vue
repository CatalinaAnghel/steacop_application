<template>
  <v-row justify="center" class="py-16">
    <v-col cols="12" sm="12" md="12" lg="10" xl="10">
      <v-card elevation="3">
        <v-row justify="center" class="pt-3">
          <v-col cols="auto">
            <h2 class="primary--text">Contact us</h2>
          </v-col>
        </v-row>
        <v-row class="pb-5">
          <v-col cols="12" md="12" lg="6" xl="6">
            <v-img :src="require('../assets/contact.svg')" class="my-3 mx-3" contain height="300" />
          </v-col>
          <v-col lg="1" xl="1" class="hidden-md-and-down">
            <v-divider vertical></v-divider>
          </v-col>
          <v-col cols="12" md="12" lg="5" xl="5">
            <v-list>
              <v-list-item v-for="item in items" :key="item.name">
                <v-list-item-avatar>
                  <v-icon class="secondary" dark>
                    {{ item.icon }}
                  </v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-if="item.mailto"><a :href="`mailto:${item.value}`">{{ item.value }}</a></v-list-item-title>
                  <v-list-item-title v-else>{{ item.value }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data: function () {
    return {
      items: [
        {
          name: "Phone",
          icon: "mdi-phone",
          value: "0722222222",
          mailto: false
        },
        {
          name: "Email",
          icon: "mdi-email",
          value: "support@thesico.com",
          mailto: true
        }
      ]
    };
  }
});
</script>