<template>
    <v-col cols="12" sm="12" xs="12" md="12" lg="4" xl="4">
        <v-card>
            <v-card-title>
                <span class="text-h6 px-2 primary--text text--darken-3">
                    Details
                </span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-avatar :color="icon.color" rounded class="mx-2" size="25px">
                                <v-icon small dark>
                                    {{ icon.name }}
                                </v-icon>
                            </v-avatar>
                            <span>
                                Type:
                            </span>
                        </v-col>
                        <v-col cols="6">
                            <span class="text-subtitle-2">
                                {{ functionalityDetails.type.name }}
                            </span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-avatar :color="statusIcon.color" rounded class="mx-2" size="25px">
                                <v-icon small dark>
                                    {{ statusIcon.name }}
                                </v-icon>
                            </v-avatar>
                            <span>
                                Status:
                            </span>
                        </v-col>
                        <v-col cols="6">
                            <span class="text-subtitle-2">
                                {{ functionalityDetails.status.name }}
                            </span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-avatar color="primary" rounded class="mx-2" size="25px">
                                <v-icon small dark>
                                    mdi-calendar-plus
                                </v-icon>
                            </v-avatar>
                            <span>
                                Created at:
                            </span>
                        </v-col>
                        <v-col cols="6">
                            <span class="text-subtitle-2">
                                {{ (new Date(functionalityDetails.createdAt)).toLocaleDateString() + ' ' +
                                    (new Date(functionalityDetails.createdAt)).toLocaleTimeString() }}
                            </span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-avatar color="primary" rounded class="mx-2" size="25px">
                                <v-icon small dark>
                                    mdi-calendar-edit
                                </v-icon>
                            </v-avatar>
                            <span>
                                Updated at:
                            </span>
                        </v-col>
                        <v-col cols="6">
                            <span class="text-subtitle-2">
                                {{ (new Date(functionalityDetails.updatedAt)).toLocaleDateString() + ' ' +
                                    (new Date(functionalityDetails.updatedAt)).toLocaleTimeString() }}
                            </span>
                        </v-col>
                    </v-row>
                    <v-row v-if="typeof functionalityDetails.dueDate !== 'undefined'">
                        <v-col cols="6">
                            <v-avatar color="primary" rounded class="mx-2" size="25px">
                                <v-icon small dark>
                                    mdi-calendar-clock
                                </v-icon>
                            </v-avatar>
                            <span>
                                Due date:
                            </span>
                        </v-col>
                        <v-col cols="6">
                            <span class="text-subtitle-2">
                                {{ (new Date(functionalityDetails.dueDate)).toLocaleDateString() }}
                            </span>
                        </v-col>
                    </v-row>
                    <v-row justify="space-between">
                        <v-col cols="12">
                            <v-btn block :disabled="!editable" color="secondary" outlined class="mb-2" @click="openDialog">
                                <v-icon medium color="secondary">
                                    mdi-pencil
                                </v-icon>
                                Edit
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script lang="ts">
import { FunctionalityInterface } from "@/store/functionalities/types";
import { defineComponent } from "vue";
import { getIcon, getStatusIcon, IconInterface } from "@/modules/project";

export default defineComponent({
    emits: ['forceRefresh:component', 'open:dialog'],
    props: {
        functionalityDetails: {
            type: Object as () => FunctionalityInterface,
            required: true
        },
        editDialog: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data: function () {
        return {
            editDialogOpen: false as boolean
        };
    },
    watch: {
        editDialog: function (value: boolean): void {
            this.editDialogOpen = value;
        }
    },
    computed: {
        icon: function (): IconInterface {
            return getIcon(this.functionalityDetails.type.name);
        },
        statusIcon: function (): IconInterface {
            return getStatusIcon(this.functionalityDetails.status.name);
        },
        editable: function (): boolean {
            return this.functionalityDetails.status.name !== 'Done';
        }
    },
    methods: {
        forceRefresh: function (): void {
            this.$emit('forceRefresh:component');
        },
        openDialog: function (): void {
            this.editDialogOpen = true;
            this.$emit("open:dialog");
        }
    }
});
</script>