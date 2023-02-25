<template>
    <v-card>
        <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="items" :search="search" :items-per-page="5"></v-data-table>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DataTableHeadersInterface, DataTableItemInterface } from '@/modules/common/index';

export default defineComponent({
    props: {
        headers: Array as () => DataTableHeadersInterface[],
        items: Array as () => DataTableItemInterface[],
        itemsPerPage: Number
    },
    data() {
        return {
            search: ''
        }
    }
});
</script>