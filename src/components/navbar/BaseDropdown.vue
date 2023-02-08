<template>
    <v-list-group :value="true" prepend-icon="mdi-account-supervisor">
        <template v-slot:activator>
            <v-list-item-title>{{ title }}</v-list-item-title>
        </template>
        <v-list-item v-for="option in menuOptions" :key="option.title" link>
            <v-list-item-title><router-link :to="{ name: option.link }">{{
                option.title
            }}</router-link></v-list-item-title>

            <v-list-item-icon>
                <v-icon v-text="option.icon"></v-icon>
            </v-list-item-icon>
        </v-list-item>
    </v-list-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MenuOptionDto from '@/dtos/MenuOptionDto';

export default defineComponent({
    props: {
        menuOptions: Array as () => MenuOptionDto[],
        title: String
    },
})
</script>
