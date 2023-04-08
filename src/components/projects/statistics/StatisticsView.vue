<template>
    <div v-if="loaded">
        <statistics-general-information :description="description" :title="title"
            :repositoryUrl="repositoryUrl"></statistics-general-information>
        <statistics-meetings-card :project="projectInfo"></statistics-meetings-card>
    </div>
    <div class="text-center" v-else>
    <v-progress-circular
      indeterminate
      color="primary"
    ></v-progress-circular>

    </div>
</template>

<script lang="ts">
import { ProjectDetailsInterface } from "@/modules/project";
import ProjectService from "@/services/project-service";
import { defineComponent } from "vue";
import StatisticsGeneralInformation from './StatisticsGeneralInformation.vue';
import StatisticsMeetingsCard from './StatisticsMeetingsCard.vue';

export default defineComponent({
    components: {
        StatisticsGeneralInformation,
        StatisticsMeetingsCard
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
                numberOfAssignments: 0,
                numberOfFinishedAssignments: 0,
                numberOfGuidanceMeetings: 0,
                numberOfCompletedGuidanceMeetings: 0,
                numberOfMilestoneMeetings: 0,
                numberOfCompletedMilestoneMeetings: 0,
                repositoryUrl: ''
            }
        }
    },
    created: async function () {
        const project = await ProjectService.getProjectInfo(Number(this.$route.params.id));
        if (project !== null) {
            this.loaded = true;
            this.projectInfo = project;
            this.description = typeof (project as ProjectDetailsInterface).description !== "undefined" ?
                (project as ProjectDetailsInterface).description : '';
            this.title = typeof (project as ProjectDetailsInterface).title !== "undefined" ?
                (project as ProjectDetailsInterface).title : '';
            this.repositoryUrl = typeof (project as ProjectDetailsInterface).repositoryUrl !== "undefined" ?
                (project as ProjectDetailsInterface).repositoryUrl : '';
        }
    }
});
</script>