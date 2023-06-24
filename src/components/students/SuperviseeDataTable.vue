<template>
    <div>
        <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
            @update:showAlert="updateShowAlert"></base-alert>
        <grading-dialog :projectId="targetProjectId" :open="gradingDialog" formTitle="Provide the final grade" @close:dialog="closeDialog"/>
        <base-data-table title="Supervisees" :headers="headers" :items="students" :items-per-page="itemsPerPage"
            :loading="loading" expandable hasDialog :openDialog="openDialog" @close:dialog="observeCloseDialogEvent">
            <template v-slot:expandContent="item">
                <p class="text-h6 mt-2 primary--text">{{ item.project.title }}</p>
                <p class="text-justify">{{ item.expanded }}</p>
            </template>
            <template v-slot:itemActions="item">
                <v-icon color="secondary" small class="mr-2" v-if="checkProject(item)" @click="viewProject(item)">
                    mdi-information-outline
                </v-icon>
                <v-icon color="secondary" small class="mr-2" @click="openGradingDialog(item)">
                    mdi-clipboard-check-outline
                </v-icon>
                <v-icon color="secondary" small class="mr-2" @click="openPlanProposalDialog(item)">
                    mdi-pencil
                </v-icon>
            </template>
            <template v-slot:dialogContent>
                <plan-proposal-dialog :projectId="targetProjectId" :open="dialog"
                    @submitted:form="payload => handleResponse(payload, 'Plan proposal has been sent', false)" @close:dialog="closeDialog"
                    form-title="Propose a supervisory plan"></plan-proposal-dialog>
            </template>
        </base-data-table>
    </div>
</template>
<script lang="ts">
require('@/validation/index')
import { DATA_TABLE_DEFAULT_ITEMS_PER_PAGE } from '@/common/constants';
import { DataTableHeadersInterface } from '@/modules/common';
import { StudentInterface } from '@/modules/student';
import { storeService } from '@/store';
import BaseDataTable from '../base/BaseDataTable.vue';
import mixins from "vue-typed-mixins";
import FormMixin from '../mixins/FormMixin.vue';
import AuthService from '@/services/auth-service';
import PlanProposalDialog from '../dialogs/students/PlanProposalDialog.vue';
import GradingDialog from '../dialogs/projects/GradingDialog.vue';

export default mixins(FormMixin).extend({
    components: {
        BaseDataTable,
        PlanProposalDialog,
        GradingDialog
    },
    data() {
        return {
            itemsPerPage: DATA_TABLE_DEFAULT_ITEMS_PER_PAGE,
            loading: false,
            dialog: false,
            gradingDialog: false,
            targetProjectId: 0
        }
    },
    computed: {
        students(): StudentInterface[] {
            return storeService.students.getStudents();
        },
        headers(): DataTableHeadersInterface[] {
            return storeService.students.getExtendedHeaders();
        }
    },
    created() {
        this.toggleLoader();
        const token = AuthService.getAccessToken();
        if (token !== null) {
            const parsedToken = AuthService.parseToken(token);
            if (parsedToken !== null) {
                storeService.students.load({
                    "project.supervisor.user.code": parsedToken.code
                }).then(() => {
                    this.toggleLoader();
                });
            }
        }
        storeService.functionalities.reset();
    },
    methods: {
        viewProject(item: StudentInterface): void {
            if (item.project !== null) {
                const id = item.project.id.toString();
                this.$router.push({
                    name: "project", params: {
                        id
                    }
                });
            }
        },
        checkProject(item: StudentInterface): boolean {
            return item.project !== null;
        },
        openPlanProposalDialog(item: StudentInterface): void {
            this.dialog = true;
            if (item.project !== null) {
                this.targetProjectId = item.project.id;
            }
        },
        openGradingDialog(item: StudentInterface): void {
            this.gradingDialog = true;            
            if (item.project !== null) {
                this.targetProjectId = item.project.id;
            }
        },
        observeCloseDialogEvent(): void {
            this.dialog = false;
            this.gradingDialog = false;
            this.targetProjectId = 0;
        },
        openDialog(): void {
            this.dialog = true;
        },
        closeDialog(): void {
            this.gradingDialog = false;
            this.dialog = false;
        }
    }
});

</script>