<template>
    <v-app-bar color="teal darken-4" dark fixed>
        <v-app-bar-nav-icon @click="value = true"></v-app-bar-nav-icon>
        <v-toolbar-title>Steacop</v-toolbar-title>
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
