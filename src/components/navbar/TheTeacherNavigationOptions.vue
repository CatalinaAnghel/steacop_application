<template>
    <v-list-item :to="{ name: 'supervisees' }">
        <v-list-item-icon>
            <v-icon>mdi-account-school</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Supervisees</v-list-item-title>
    </v-list-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
});
</script>