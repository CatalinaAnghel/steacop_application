<template>
    <div>
        <v-list-item :to="{ name: 'settings' }">
            <v-list-item-icon>
                <v-icon>mdi-cogs</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <base-menu-dropdown v-for="menu in admin" :key="menu.title" :menuOptions="menu.menuOptions" :icon="menu.icon"
            :title="menu.title"></base-menu-dropdown>
    </div>
</template>

<script lang="ts">
import BaseMenuDropdown from "./BaseMenuDropdown.vue";
import { MENU_OPTIONS_ADMIN } from '@/common/menus';
import { defineComponent } from "vue";

export default defineComponent({
    components: {
        BaseMenuDropdown
    },
    data() {
        return {
            admin: MENU_OPTIONS_ADMIN,
        };
    }
});
</script>