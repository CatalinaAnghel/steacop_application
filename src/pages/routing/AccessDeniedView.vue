<template>
    <v-row justify="center" class="py-16">
        <v-col cols="10" sm="10" md="12" lg="6" xl="6">
            <v-card elevation="3">
                <v-card-title><v-icon medium color="red darken-2">
                        mdi-cancel
                    </v-icon>{{ title }}</v-card-title>
                <v-card-text>{{ body }}</v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data: () => {
        return {
            title: "Access denied",
            body: "You do not have access to this page."
        }
    }
});
</script>
