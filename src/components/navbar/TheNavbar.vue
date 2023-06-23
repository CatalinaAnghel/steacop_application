<template>
    <v-app-bar class="navbar-element" color="primary darken-4" fixed app elevate-on-scroll dark
        scroll-target="#main-container">
        <v-app-bar-nav-icon @click="value = true"></v-app-bar-nav-icon>
        <v-toolbar-title>
            <router-link :to="{ name: 'home' }" class="logo-link">
                <v-avatar>
                    <v-img contain :src="require('@/assets/logo1.svg')" max-height="45" max-width="45" />
                </v-avatar>
            </router-link>
        </v-toolbar-title>
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