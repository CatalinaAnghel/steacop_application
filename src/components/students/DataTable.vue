<template>
    <base-data-table :headers="headers" :items="students" :items-per-page="itemsPerPage" :loading="loading"
        expandable></base-data-table>
</template>
<script lang="ts">
import { DATA_TABLE_DEFAULT_ITEMS_PER_PAGE } from '@/common/constants';
import { DataTableHeadersInterface } from '@/modules/common';
import { StudentInterface } from '@/modules/student';
import { storeService } from '@/store';
import { defineComponent } from 'vue';
import BaseDataTable from '../base/BaseDataTable.vue';

export default defineComponent({
    components: {
        BaseDataTable
    },
    data() {
        return {
            itemsPerPage: DATA_TABLE_DEFAULT_ITEMS_PER_PAGE,
            loading: false,
        }
    },
    computed: {
        students(): StudentInterface[] {
            return storeService.students.getStudents();
        },
        headers(): DataTableHeadersInterface[] {
            return storeService.students.getHeaders();
        }
    },
    created() {
        this.toggleLoader();
        storeService.students.load().then(() => {
            this.toggleLoader();
        });

    },
    methods: {
        toggleLoader(): void {
            this.loading = !this.loading;
        }
    }
});

</script>