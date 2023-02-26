<template>
    <data-table></data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DataTable from '@/components/students/DataTable.vue';
export default defineComponent({
    components: {
        DataTable
    }
});
</script>