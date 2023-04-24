<template>
    <v-form @submit.prevent="submit" v-model="valid">
        <v-file-input multiple v-model="selectedFiles" counter></v-file-input>
        <v-btn :disabled="disabled || processing" color="neutral" block type="submit" large class="my-3"
            @click="toggleLoader">Upload file(s)</v-btn>
        <v-btn :disabled="processing" color="secondary" block dark @click="turnIn" large class="my-3">Turn in</v-btn>
    </v-form>
</template>

<script lang="ts">
import { AssignmentInterface, AssignmentStatusInterface, DocumentInterface } from "@/modules/assignment";
import { defineComponent } from "vue";
import { getStatus } from "@/modules/assignment";
import FileUploadService from "@/services/file-upload-service";
import AssignmentService from "@/services/assignment-service";

export default defineComponent({
    emits: ['toggled:loader', "updated:assignment", "refresh:documents"],
    props: {
        assignmentDetails: {
            type: Object as () => AssignmentInterface,
            required: true
        },
    },
    data: function () {
        return {
            selectedFiles: [],
            valid: false,
            processing: false
        }
    },
    computed: {
        status: function (): AssignmentStatusInterface {
            return getStatus(new Date(this.assignmentDetails.dueDate), this.assignmentDetails.turnedInDate);
        },
        disabled: function (): boolean {
            return this.selectedFiles.length === 0;
        }
    },
    methods: {
        submit: async function (setProcessing = true): Promise<void> {
            if (setProcessing) {
                this.processing = true;
            }
            let addedDocuments = [] as DocumentInterface[];
            if (this.selectedFiles.length > 0) {
                this.selectedFiles.forEach(async (file) => {
                    let formData = new FormData();
                    formData.append('file', file, (file as File).name);
                    formData.append('assignmentId', this.assignmentDetails.id.toString());
                    const document = await FileUploadService.uploadAssignmentFile(formData);
                    if(null !== document){
                        addedDocuments.push(document);
                    }
                });
                this.$emit('refresh:documents');
                this.selectedFiles = [];
                if (setProcessing) {
                    this.processing = false;
                }
                this.toggleLoader();
            }
        },
        turnIn: async function (): Promise<void> {
            this.processing = true;
            this.toggleLoader();
            if (this.selectedFiles.length) {
                await this.submit(false);
            }
            const response = await AssignmentService.setStatusAssignment(this.assignmentDetails.id, true);
            this.$emit("updated:assignment", response);
            this.processing = false;
            this.toggleLoader();
        },
        toggleLoader: function (): void {
            this.$emit('toggled:loader');
        }
    }
})
</script>