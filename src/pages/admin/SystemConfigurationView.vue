<template>
    <v-row justify="center" class="py-16">
        <v-col cols="10" sm="10" md="12" lg="6" xl="6">
            <router-view></router-view>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data: () => {
        return {
            loading: false,
        }
    }
});
</script>