<template>
  <base-tabs :tabs="tabs"></base-tabs>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import BaseTabs from '@/components/base/BaseTabs.vue';
import { PROJECT_DETAILS_TABS } from '@/common/menus';

export default defineComponent({
  components: {
    BaseTabs
  },
  data: () => {
    return {
      tabs: PROJECT_DETAILS_TABS
    };
  }
});
</script>