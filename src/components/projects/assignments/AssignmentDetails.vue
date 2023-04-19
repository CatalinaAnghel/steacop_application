<template>
    <v-col cols="12" sm="12" xs="12" md="12" lg="8" xl="8">
        <v-card class="mb-5">
            <v-card-title>
                <v-row>
                    <v-col cols="12" xs="12" sm="12" md="8" lg="8" xl="8">
                        <h3 class="primary--text">{{ assignmentDetails.title }}</h3>
                    </v-col>
                    <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
                        <p class="float-right subtitle-2">{{ dueDate }}</p>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-divider color="primary"></v-divider>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <p class="pt-5 text-justify">{{ assignmentDetails.description }}</p>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script lang="ts">
import { AssignmentInterface } from "@/modules/assignment";
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        assignmentDetails: {
            type: Object as () => AssignmentInterface,
            required: true
        }
    },
    computed: {
        dueDate: function(): string{
            const dueDateValue = new Date(this.assignmentDetails.dueDate);
            return 'Due at: ' + dueDateValue.toDateString() + ', ' + dueDateValue.toLocaleTimeString();
        }
    },
    data: function () {
        return {
            cardTitle: "Assignment details"
        }
    }
})
</script>
