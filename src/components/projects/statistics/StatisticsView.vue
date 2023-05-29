<template>
    <base-overlay v-if="!loaded" :overlay="!loaded"></base-overlay>
    <div v-else>

        <editing-dialog :project="projectInfo" :open="editDialog" form-title="Edit the project details"
            @close:dialog="closeDialog" @submitted:form="refreshProjectInfo" />
        <v-btn color="secondary" outlined class="mb-2" @click="openEditDialog">
            <v-icon medium color="secondary">
                mdi-pencil
            </v-icon>
            Edit project
        </v-btn>
        <statistics-general-information :description="description" :title="title"
            :repositoryUrl="repositoryUrl"></statistics-general-information>
        <statistics-meetings-card :project="projectInfo"></statistics-meetings-card>
        <statistics-functionalities-card :project="projectInfo"></statistics-functionalities-card>
    </div>
</template>

<script lang="ts">
import { ProjectDetailsInterface } from "@/modules/project";
import ProjectService from "@/services/project-service";
import { defineComponent } from "vue";
import StatisticsGeneralInformation from './StatisticsGeneralInformation.vue';
import StatisticsMeetingsCard from './StatisticsMeetingsCard.vue';
import StatisticsFunctionalitiesCard from "./StatisticsFunctionalitiesCard.vue";
import BaseOverlay from '@/components/base/BaseOverlay.vue';
import EditingDialog
    from "@/components/dialogs/projects/EditingDialog.vue";
export default defineComponent({
    components: {
        StatisticsGeneralInformation,
        StatisticsMeetingsCard,
        StatisticsFunctionalitiesCard,
        BaseOverlay,
        EditingDialog
    },
    data: function () {
        return {
            loaded: false,
            description: '',
            title: '',
            repositoryUrl: '',
            editDialog: false,
            projectInfo: {
                title: '',
                description: '',
                id: 0,
                grade: null,
                milestoneMeetingInformation: {
                    total: 0,
                    completed: 0,
                    missed: 0
                },
                guidanceMeetingInformation: {
                    total: 0,
                    completed: 0,
                    missed: 0
                },
                assignmentInformation: {
                    total: 0,
                    completed: 0
                },
                repositoryUrl: ''
            }
        }
    },
    methods: {
        openEditDialog: function (): void {
            this.editDialog = true;
        },
        closeDialog: function (): void {
            this.editDialog = false;
        },
        refreshProjectInfo: async function (): Promise<void> {
            const project = await ProjectService.getProjectInfo(Number(this.$route.params.id));
            if (project !== null) {
                this.projectInfo = project;
                this.projectInfo.id = Number(this.$route.params.id);
                this.description = typeof (project as ProjectDetailsInterface).description !== "undefined" ?
                    (project as ProjectDetailsInterface).description : '';
                this.title = typeof (project as ProjectDetailsInterface).title !== "undefined" ?
                    (project as ProjectDetailsInterface).title : '';
                this.repositoryUrl = typeof (project as ProjectDetailsInterface).repositoryUrl !== "undefined" ?
                    (project as ProjectDetailsInterface).repositoryUrl : '';
            }
        }
    },
    created: async function () {
        await this.refreshProjectInfo();
        this.loaded = true;
    }
});
</script>