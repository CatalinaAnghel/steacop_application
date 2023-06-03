<template>
  <v-card class="mx-auto w-100">
    <v-img contain :src="require(`@/assets/${image}`)" height="250px"></v-img>

    <v-card-title>
      {{ title }}
    </v-card-title>

    <v-card-subtitle>
      {{ subtitle }}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn color="secondary" text :to="{ name: pathName }">
        {{ buttonText }}
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    image: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: false,
      default: ""
    },
    pathName: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      required: false,
      default: "View details"
    }
  }
});
</script>
