<template>
    <v-card class="mt-15">
        <v-card-title>
            <span class="text-h5 primary--text text--darken-3">{{ cardTitle }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row v-if="loading">
                    <v-col cols="12" class="text-center">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-col cols="12" sm="12" md="12" lg="12" xl="12" v-if="checkSeries">
                        <vue-apex-charts height="300px" type="bar" :options="chartOptions"
                            :series="series"></vue-apex-charts>
                    </v-col>
                    <v-col cols="12" sm="12" md="5" lg="5" xl="5" v-else>
                        <span class="text-subtitle-1">No statistics are available yet...</span>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { ScoresCollectionInterface } from "@/modules/project";
import { ProjectData } from "@/modules/user";
import ProjectService from "@/services/project-service";
import { storeService } from "@/store";
import { defineComponent } from "vue";
import VueApexCharts from 'vue-apexcharts';

export default defineComponent({
    data: function () {
        return {
            loading: false,
            cardTitle: "Collaboration scores",
            scores: null as ScoresCollectionInterface,
            chartOptions: {
                chart: {
                    type: 'bar',
                    height: 350
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: [],
                },
                yaxis: {
                    title: {
                        text: 'Score'
                    }
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (val: number) {
                            return val + "%"
                        }
                    }
                }
            },
        };
    },
    components: {
        VueApexCharts
    },
    computed: {
        series: function (): { name: string; data: number[] }[] {
            let structureScores = { name: 'Structure score', data: [] as number[] };
            let supportScores = { name: 'Support score', data: [] as number[] };
            let ratingsScores = { name: 'Ratings score', data: [] as number[] };
            let overallScore = { name: 'Overall collaboration score', data: [] as number[] };
            if (this.scores !== null) {
                this.scores.scoresCollection.forEach(scoreElement => {
                    structureScores.data.push(Number(scoreElement.structureScore.toFixed(2)));
                    supportScores.data.push(Number(scoreElement.supportScore.toFixed(2)));
                    ratingsScores.data.push(Number(scoreElement.ratingsScore.toFixed(2)));
                    overallScore.data.push(Number(scoreElement.totalScore.toFixed(2)));
                });
            }

            return [
                structureScores,
                supportScores,
                ratingsScores,
                overallScore
            ];
        },
        checkSeries: function(): boolean{
            const values = this.series.filter(element => element.data.filter(dataval => {return dataval > 0}).length > 0);
            return values.length > 0;
        }
    },
    created: async function (): Promise<void> {
        this.loading = true;
        const projects = storeService.user.getUser().projects;
        this.scores = {
            scoresCollection: []
        };
        let students = [] as string[];
        projects.forEach(async (element: ProjectData): Promise<void> => {
            let score = await ProjectService.getCollaborationInfo(element.id);
            if (score !== null) {
                students.push(score.studentData.firstName + ' ' + score.studentData.lastName);
                this.scores.scoresCollection.push({
                    studentData: score.studentData,
                    structureScore: score.structureScore.totalScore,
                    supportScore: score.supportScore.totalScore,
                    ratingsScore: score.ratingScore.totalScore,
                    totalScore: score.score,
                    projectId: element.id
                });
                this.loading=false;
            }
        });
        this.chartOptions.xaxis.categories = students;
    }
});
</script>