<template>
    <v-overlay
      :z-index="zIndex"
      :value="overlay"
    >
    <v-progress-circular
      indeterminate
      :color="color"
    ></v-progress-circular>
    </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        zIndex: {
            type: Number, 
            required: false,
            default: 1000
        },
        overlay: {
            type: Boolean, 
            required: false,
            default: false
        },
        color: {
            type: String, 
            required: false,
            default: "accent"
        }
    }
});
</script>