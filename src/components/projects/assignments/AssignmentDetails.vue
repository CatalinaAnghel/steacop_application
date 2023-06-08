<template>
    <v-col cols="12" sm="12" xs="12" md="12" lg="8" xl="8">
        <v-card class="mb-5">
            <v-card-title>
            <h3 class="primary--text">{{ assignmentDetails.title }}</h3>

            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row justify="space-between">
                        <v-col sm="12" md="8" lg="8" xl="8">
                            <p class="pt-5 subtitle-2">{{ dueDate }}</p>
                        </v-col>
                        <v-col cols="auto">
                            <assignment-grading-form v-if="showGradingForm" :current-grade="assignmentDetails.grade"></assignment-grading-form>
                            <span v-if="showGrade" class="subtitle-1">{{ assignmentDetails.grade }}/10</span>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
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
import { Roles } from "@/common/roles";
import { AssignmentInterface } from "@/modules/assignment";
import AssignmentGradingForm from "./AssignmentGradingForm.vue";
import AuthService from "@/services/auth-service";
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        assignmentDetails: {
            type: Object as () => AssignmentInterface,
            required: true
        },
    },
    components: {
        AssignmentGradingForm
    },
    computed: {
        dueDate: function (): string {
            const dueDateValue = new Date(this.assignmentDetails.dueDate);
            return 'Due at: ' + dueDateValue.toDateString() + ', ' + dueDateValue.toLocaleTimeString();
        },
        showGradingForm: function (): boolean {
            const role = AuthService.getRole();
            return role === Roles.ROLE_TEACHER && typeof this.assignmentDetails.turnedInDate !== 'undefined';
        },
        showGrade: function(): boolean{
            return !this.showGradingForm && typeof this.assignmentDetails.grade !== 'undefined';
        }
    },
    data: function () {
        return {
            cardTitle: "Assignment details",
            grade: 0,
            requiredRule: [
                (value: number|null) => value !== null || 'You should provide a grade'
            ],
            validRule: [
                (value: number) => value >= 1 && value <= 10 || 'Invalid grade'
            ]
        }
    },
    created: function(): void{
        if(typeof this.assignmentDetails.grade !== 'undefined'){
            this.grade = this.assignmentDetails.grade;
        }
    }
})
</script>
