<template>
    <v-card>
        <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="items" :search="search" :items-per-page="itemsPerPage" :loading="loading"
            :loading-text="loadingMessage" :show-expand="expandable" :single-expand="singleExpandable"
            :expanded.sync="expanded">
            <template v-if="expandable" v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    {{ item.expanded }}
                </td>
            </template>
        </v-data-table>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DataTableHeadersInterface, DataTableItemInterface } from '@/modules/common';

export default defineComponent({
    props: {
        headers: {
            type: Array as () => DataTableHeadersInterface[],
            required: true
        },
        items: {
            type: Array as () => DataTableItemInterface[],
            required: true
        },
        itemsPerPage: {
            type: Number,
            required: false,
            default: 15,
            validator: (itemsPerPage: number) => itemsPerPage >= 5 && itemsPerPage <= 100
        },
        loadingMessage: {
            type: String,
            required: false,
            default: "Loading... Please wait"
        },
        loading: {
            type: Boolean,
            required: false,
            default: false
        },
        expandable: {
            type: Boolean,
            required: false,
            default: false
        },
        singleExpandable: {
            type: Boolean,
            required: false,
            default: false
        }

    },
    data() {
        return {
            search: '',
            expanded: []
        }
    }
});
</script>