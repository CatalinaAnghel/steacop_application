<template>
    <v-row>
        <assignment-details v-if="assignmentDetails !== null" :assignmentDetails="assignmentDetails" />
        <assignment-upload-card v-if="assignmentDetails !== null" :showForm="showUploadForm"
            :assignmentDetails="assignmentDetails" @updated:assignment="handleUpdatedAssignmentDetails"
            @refresh:documents="documents => refreshDocuments(documents)"/>
    </v-row>
</template>

<script lang="ts">
import { AssignmentInterface, DocumentInterface } from "@/modules/assignment";
import AssignmentService from "@/services/assignment-service";
import AssignmentDetails from "@/components/projects/assignments/AssignmentDetails.vue";
import AssignmentUploadCard from "@/components/projects/assignments/AssignmentUploadCard.vue";
import { defineComponent } from "vue";
import AuthService from "@/services/auth-service";
import { Roles } from "@/common/roles";

export default defineComponent({
    data: function () {
        return {
            assignmentDetails: null as AssignmentInterface | null
        }
    },
    components: {
        AssignmentDetails,
        AssignmentUploadCard,
    },
    computed: {
        showUploadForm: function (): boolean {
            const role = AuthService.getRole();
            return role === Roles.ROLE_STUDENT;
        }
    },
    methods: {
        handleUpdatedAssignmentDetails: function (response: AssignmentInterface|null): void {
            this.assignmentDetails = response;
        },
        refreshDocuments: async function(documents: DocumentInterface[]): Promise<void>{
            const assignment = await AssignmentService.getAssignment(Number(this.$route.params.id));
            if(null !== assignment && null !== this.assignmentDetails){
                this.assignmentDetails.documents = assignment.documents;
            }
        },
    },
    created: async function (): Promise<void> {
        this.assignmentDetails = await AssignmentService.getAssignment(Number(this.$route.params.id));
        if (null === this.assignmentDetails) {
            this.$router.push({ name: "NotFound" });
        }
    }
})
</script>
