<template>
    <supervisee-data-table></supervisee-data-table>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SuperviseeDataTable from '@/components/students/SuperviseeDataTable.vue';

export default defineComponent({
  components: { SuperviseeDataTable },
    name: "Supervisees-View",
    data: () => {
        return {
        }
    }
});
</script>