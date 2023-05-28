<template>
    <base-overlay v-if="!loaded" :overlay="!loaded"></base-overlay>
    <div v-else>
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

export default defineComponent({
    components: {
        StatisticsGeneralInformation,
        StatisticsMeetingsCard,
        StatisticsFunctionalitiesCard,
        BaseOverlay
    },
    data: function () {
        return {
            loaded: false,
            description: '',
            title: '',
            repositoryUrl: '',
            projectInfo: {
                title: '',
                description: '',
                id: 0,
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
    created: async function () {
        const project = await ProjectService.getProjectInfo(Number(this.$route.params.id));
        if (project !== null) {
            this.projectInfo = project;
            this.description = typeof (project as ProjectDetailsInterface).description !== "undefined" ?
                (project as ProjectDetailsInterface).description : '';
            this.title = typeof (project as ProjectDetailsInterface).title !== "undefined" ?
                (project as ProjectDetailsInterface).title : '';
            this.repositoryUrl = typeof (project as ProjectDetailsInterface).repositoryUrl !== "undefined" ?
                (project as ProjectDetailsInterface).repositoryUrl : '';
            this.loaded = true;
        }
    }
});
</script>