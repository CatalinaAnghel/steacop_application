<template>
    <v-card>
        <v-data-table :headers="headers" :items="items" :search="search" :items-per-page="itemsPerPage" :loading="loading? 'secondary': false"
            :loading-text="loadingMessage" :show-expand="expandable" :single-expand="singleExpandable"
            :expanded.sync="expanded">
            <template v-slot:progress></template>
            <template v-if="expandable" v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <slot name="expandContent" v-bind="item" :props="item"></slot>
                </td>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>{{ title }}</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                        hide-details></v-text-field>
                    <slot name="toolbarCustomButtons"></slot>
                </v-toolbar>
                <slot name="dialogContent"></slot>
            </template>


            <template v-slot:[`item.actions`]="{ item }">
                <slot name="itemActions" v-bind="item" :props="item"></slot>
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
        },
        title: {
            type: String,
            required: true
        },
        hasDialog: {
            type: Boolean,
            required: false,
            default: false
        },
    },
    data() {
        return {
            search: '',
            expanded: [],
        }
    },
});
</script>