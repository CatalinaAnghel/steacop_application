<template>
    <v-container fluid>
        <v-layout justify-center align-center>
            <v-flex shrink>
                <h3 class="text-center">Oh, no! You cannot access that page... Access denied</h3>
                <img class="access-denied-image" alt="Access denied image" :src="require('@/assets/access_denied.svg')" />
            </v-flex>
        </v-layout>
    </v-container>
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

<style lang="scss">
@import '~vuetify/src/styles/settings/_variables';
@import '@/style/helpers.scss';

.access-denied-image {
    max-width: rem(500);
    width: auto;

    @media #{map-get($display-breakpoints, 'md-and-down')} {
        & {
            width: rem(300);
        }
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
        & {
            width: rem(160);
        }
    }
}
</style>
