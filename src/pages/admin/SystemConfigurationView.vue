<template>
    <div>
        <base-tabs :tabs="tabs"></base-tabs>
        <!-- <v-row justify="center" class="py-16">
            <v-col cols="10" sm="10" md="12" lg="6" xl="6">
                <router-view></router-view>
            </v-col>
        </v-row> -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseTabs from '@/components/base/BaseTabs.vue';
import { SETTINGS_TABS } from '@/common/menus';

export default defineComponent({
    components: {
        BaseTabs
    },
    data: () => {
        return {
            tabs: SETTINGS_TABS
        };
    }
});
</script>