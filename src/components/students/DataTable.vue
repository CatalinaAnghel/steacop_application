<template>
    <base-data-table :items="students"></base-data-table>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import BaseDataTable from '../base/BaseDataTable.vue';

export default defineComponent({
    components: {
        BaseDataTable
    },
    data() {
        return {
            
        }
    },
    computed: {
        students() {
            
        }
    }
});
    
</script>