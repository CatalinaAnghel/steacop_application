<template>
    <v-card>
        <v-data-table :headers="headers" :items="items" :search="search" :items-per-page="itemsPerPage" :loading="loading"
            :loading-text="loadingMessage" :show-expand="expandable" :single-expand="singleExpandable"
            :expanded.sync="expanded">
            <template v-if="expandable" v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    {{ item.expanded }}
                </td>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>{{ title }}</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                        hide-details></v-text-field>
                    <v-dialog v-if="hasDialog" v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                {{ buttonText }}
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col col="12" sm="12" md="12">
                                            <slot name="dialogContent"></slot>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">
                                    Cancel
                                </v-btn>
                                <v-btn color="blue darken-1" text @click="save">
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
        </v-data-table>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DataTableHeadersInterface, DataTableItemInterface } from '@/modules/common';

export default defineComponent({
    emits: ['save:dialog'],
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
        formTitle: {
            type: String,
            required: false
        },
        hasDialog: {
            type: Boolean,
            required: false,
            default: false
        },
        buttonText: {
            type: String,
            required: false,
            default: 'Import'
        }
    },
    data() {
        return {
            search: '',
            expanded: [],
            dialog: false,
        }
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    methods: {
        close() {
            this.dialog = false;
        },
        save() {
            this.$emit('save:dialog');
            this.close();
        }
    }
});
</script>