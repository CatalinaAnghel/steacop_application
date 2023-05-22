<template>
    <div>
        <base-tabs :tabs="tabs"></base-tabs>
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