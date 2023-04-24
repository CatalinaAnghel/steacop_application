<template>
    <div> 
        <v-divider></v-divider>
        <v-list>
            <v-list-item v-for="document in assignmentDetails.documents" :key="document.id">
                <v-list-item-avatar>
                    <v-icon class="primary" dark>mdi-text-box-check-outline</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-list-item-title v-on="on">{{ document.filePath }}</v-list-item-title>
                        </template>
                        <span>{{ document.filePath }}</span>
                    </v-tooltip>
                    <v-list-item-subtitle>
                        <a :href="getDocumentUrl(document)" target="_blank">View document</a>
                    </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action v-if="deletable">
                    <v-btn icon @click="deleteDocument(document.id)">
                        <v-icon color="grey lighten-1">mdi-delete</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
        </v-list>
    </div>
</template>
<script lang="ts">
import { CDN_DOMAIN } from "@/common/constants";
import { AssignmentInterface, DocumentInterface } from "@/modules/assignment";
import AssignmentService from "@/services/assignment-service";
import { defineComponent } from "vue";

export default defineComponent({
    emits: ["refresh:documents"],
    props: {
        assignmentDetails: {
            type: Object as () => AssignmentInterface,
            required: true
        },
        deletable: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    methods: {
        getDocumentUrl: function (document: DocumentInterface): string {
            return CDN_DOMAIN + document.contentUrl;
        },
        deleteDocument: async function (documentId: number): Promise<void> {
            const reqStatus = await AssignmentService.deleteDocument(documentId);
            if (reqStatus.success) {
                this.$emit('refresh:documents');
            }
        }
    }
});
</script>