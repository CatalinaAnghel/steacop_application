<template>
    <v-app-bar color="teal darken-4" dark fixed app>
        <v-app-bar-nav-icon @click="value = true"></v-app-bar-nav-icon>
        <v-toolbar-title><router-link :to="{name:'home'}" class="logo-link">Steacop</router-link></v-toolbar-title>
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
.logo-link{
    text-decoration: none;
    color: white;
    &:hover{
        cursor: pointer;
    }
}
</style>