<template>
    <v-list-group no-action color="neutral darken-4">
        <v-icon slot="prependIcon">{{ icon }}</v-icon>
        <template v-slot:activator>
            <v-list-item-title>{{ title }}</v-list-item-title>
        </template>
        <v-list-item v-for="option in menuOptions" :key="option.title" link :to="{ name: option.to }">
            <v-list-item-title class="black--text text--lighten-4">{{
                option.title
            }}</v-list-item-title>
            <v-list-item-icon class="black--text text--lighten-4">
                <v-icon v-text="option.icon"></v-icon>
            </v-list-item-icon>
        </v-list-item>
    </v-list-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { MenuOption } from '@/modules/menu';

export default defineComponent({
    props: {
        menuOptions: Array as () => MenuOption[],
        title: String,
        icon: String
    },
})
</script>
