<template>
    <v-form @submit.prevent="submit" v-model="valid">
        <v-file-input multiple v-model="selectedFiles" counter></v-file-input>
        <v-btn color="secondary" block dark type="submit" large class="my-3" @click="toggleLoader">Turn in</v-btn>
    </v-form>
</template>

<script lang="ts">
import { AssignmentInterface, AssignmentStatusInterface } from "@/modules/assignment";
import { defineComponent } from "vue";
import { getStatus } from "@/modules/assignment";
import FileUploadService from "@/services/file-upload-service";

export default defineComponent({
    emits: ['toggled:loader'],
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
        }
    },
    computed: {
        status: function (): AssignmentStatusInterface {
            return getStatus(new Date(this.assignmentDetails.dueDate), this.assignmentDetails.turnedInDate);
        }
    },
    methods: {
        submit: async function (): Promise<void> {
            if (this.selectedFiles.length > 0) {
                this.selectedFiles.forEach(async (file) => {
                    let formData = new FormData();
                    formData.append('file', file, (file as File).name);
                    formData.append('assignmentId', this.assignmentDetails.id.toString());
                    let requestStatus = await FileUploadService.uploadStudentsImportFile(formData);
                });
                this.selectedFiles = [];
                this.toggleLoader();
            }
        },
        toggleLoader: function (): void {
            this.$emit('toggled:loader');
        }
    }
})
</script>