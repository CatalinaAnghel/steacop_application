<template>
    <v-app-bar class="navbar-element" color="primary darken-4" fixed app elevate-on-scroll dark scroll-target="#main-container">
        <v-app-bar-nav-icon @click="value = true"></v-app-bar-nav-icon>
        <v-img contain :src="require('@/assets/thesico_logo.svg')" max-height="40" max-width="40" class="mx-2"></v-img>
        <v-toolbar-title>
            <router-link :to="{ name: 'home' }" class="logo-link">Thesico</router-link></v-toolbar-title>
    </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
    props: ['drawerValue'],
    emits: ['update:drawerValue'],
    data: () => {
        return {
        }
    },
    computed: {
        value: {
            get(): boolean {
                return this.drawerValue;
            },
            set(value: boolean) {
                this.$emit('update:drawerValue', value);
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.logo-link {
    text-decoration: none;
    color: var(--v-neutral-base);

    &:hover {
        cursor: pointer;
        color: var(--v-secondary-lighten4);
    }
}
</style>