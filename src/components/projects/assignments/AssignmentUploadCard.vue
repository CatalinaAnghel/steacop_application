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
                            
                            <assignment-upload-form v-if="editable" :assignment-details="assignmentDetails"
                                @toggled:loader="toggleLoader" @updated:assignment="response => handleUpdateAssignmentDetails(response)"
                                @refresh:documents="refreshDocuments"/>
                            <v-btn v-if="!checkStatus && showForm && !graded" color="neutral" block @click="unsubmit" large class="my-3">Unsubmit</v-btn>
                            <assignment-upload-list v-if="assignmentDetails.documents.length"
                                :assignmentDetails="assignmentDetails" :deletable="editable"
                                @refresh:documents="refreshDocuments"></assignment-upload-list>
                            <div v-else>
                                <v-icon medium color="warning">
                                    mdi-book-alert-outline
                                </v-icon>
                                <span class="text-center subtitle-1">
                                    The assignment was not turned in
                                </span>
                            </div>
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
import AssignmentUploadList from "./AssignmentUploadList.vue";
import AssignmentService from "@/services/assignment-service";

export default defineComponent({
    emits: ["updated:assignment", "refresh:documents"],
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
        AssignmentUploadForm,
        AssignmentUploadList
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
            return getStatus(this.assignmentDetails.grade, new Date(this.assignmentDetails.dueDate), this.assignmentDetails.turnedInDate);
        },
        checkStatus: function (): boolean {
            return this.status.status === AssignmentStatus.Assigned || this.status.status === AssignmentStatus.NotTurnedIn;
        },
        editable: function(): boolean{
            return this.showForm && this.checkStatus;
        },
        graded: function(): boolean{
            return this.status.status === AssignmentStatus.Graded;
        }
    },
    methods: {
        toggleLoader: function (): void {
            this.loading = !this.loading;
        },
        unsubmit: async function(): Promise<void>{
            this.toggleLoader();
            const response = await AssignmentService.setStatusAssignment(this.assignmentDetails.id, false);
            this.handleUpdateAssignmentDetails(response);
            this.toggleLoader();
        },
        handleUpdateAssignmentDetails: function(response: AssignmentInterface|null): void{
            this.$emit("updated:assignment", response);
        },
        refreshDocuments: function(): void{
            this.$emit("refresh:documents");
        }
    }
})
</script>