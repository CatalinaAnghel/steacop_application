<template>
    <v-container fluid>
        <v-layout justify-center align-center>
            <v-flex shrink>
                <h3 class="text-center">Not found</h3>
                <img class="not-found-image" alt="Not found image" :src="require('@/assets/not_found.svg')" />
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({

});
</script>

<style lang="scss">
@import '~vuetify/src/styles/settings/_variables';
@import '@/style/helpers.scss';

.not-found-image {
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