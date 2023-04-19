<template>
    <v-col cols="12" sm="12" xs="12" md="12" lg="4" xl="4">
        <v-card :loading="loading" class="mb-5">
            <v-card-title>
                <v-row>
                    <v-col cols="6">
                        <h5>Attached work</h5>
                    </v-col>
                    <v-col cols="6">
                        <span class="subtitle-1 float-right" :class="status.color + '--text'">{{ status.message }}</span>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col col="12" sm="12" md="12">
                            <assignment-upload-form v-if="checkStatus" :assignment-details="assignmentDetails" @toggled:loader="toggleLoader"/>
                            
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script lang="ts">
import { AssignmentInterface, AssignmentStatus, AssignmentStatusInterface } from "@/modules/assignment";
import { defineComponent } from "vue";
import { getStatus } from "@/modules/assignment";
import AssignmentUploadForm from "./AssignmentUploadForm.vue";

export default defineComponent({
    props: {
        assignmentDetails: {
            type: Object as () => AssignmentInterface,
            required: true
        },
        showForm: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    components: {
        AssignmentUploadForm
    },
    data: function () {
        return {
            selectedFiles: [],
            valid: false,
            loading: false
        }
    },
    computed: {
        status: function (): AssignmentStatusInterface {
            return getStatus(new Date(this.assignmentDetails.dueDate), this.assignmentDetails.turnedInDate);
        },
        checkStatus: function (): boolean{
            return this.showForm && (this.status.status === AssignmentStatus.Assigned || this.status.status === AssignmentStatus.NotTurnedIn);
        }
    },
    methods: {
        toggleLoader: function (): void {
            this.loading = !this.loading;
        }
    }
})
</script>