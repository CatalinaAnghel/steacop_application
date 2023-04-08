<template>
    <v-card class="mb-5">
        <v-card-title>
            <span class="text-h5 primary--text text--darken-3">{{ cardTitle }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col col="12" sm="12" md="12" lg="6" xl="6">
                        <vue-apex-charts height="290" type="radialBar" :options="options"
                            :series="series"></vue-apex-charts>
                    </v-col>
                    <v-divider col="1" sm="1" vertical class="hidden-md-and-down"></v-divider>
                    <v-col col="12" sm="12" md="6" lg="5" xl="5">
                        <template>
                            <v-treeview shaped hoverable :items="items"></v-treeview>
                        </template>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VueApexCharts from 'vue-apexcharts';
import { ProjectDetailsInterface } from "@/modules/project";


export default defineComponent({
    props: {
        project: {
            type: Object as () => ProjectDetailsInterface,
            required: true
        }
    },
    data() {
        return {
            cardTitle: 'Project statistics',
            options: {
                plotOptions: {
                    radialBar: {
                        offsetY: 0,
                        startAngle: 0,
                        endAngle: 270,
                        hollow: {
                            margin: 10,
                            size: '30%',
                            background: 'transparent',
                            image: undefined,
                        },
                        dataLabels: {
                            name: {
                                show: false,
                            },
                            value: {
                                show: false,
                            }
                        }
                    }
                },
                colors: [
                    this.$vuetify.theme.currentTheme.primary,
                    this.$vuetify.theme.currentTheme.secondary,
                    this.$vuetify.theme.currentTheme.warning
                ],
                labels: ['Guidance meetings', 'Milestone meetings', 'Assignments'],
                legend: {
                    show: true,
                    floating: true,
                    fontSize: '14px',
                    position: 'left',
                    offsetX: 10,
                    offsetY: 30,
                    labels: {
                        useSeriesColors: true,
                    },
                    markers: {
                        size: 0
                    },
                    // eslint-disable-next-line
                    formatter: function (seriesName: string, opts: any): string {
                        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + '%'
                    },
                    itemMargin: {
                        vertical: 3
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            floating: true,
                            show: true,
                            offsetY: -25
                        },
                        plotOptions: {
                            radialBar: {
                                startAngle: 90,
                                endAngle: 270,
                            }
                        }
                    }
                }]
            }
        }
    },
    computed: {
        series: function (): Array<number> {
            const guidanceMeetingsPercentage = this.project.numberOfGuidanceMeetings > 0 ?
                this.project.numberOfCompletedGuidanceMeetings / this.project.numberOfGuidanceMeetings * 100 : 0.0;
            const milestoneMeetingsPercentage = this.project.numberOfMilestoneMeetings > 0 ?
                this.project.numberOfCompletedMilestoneMeetings / this.project.numberOfMilestoneMeetings * 100 : 0.0;
            const assignmentsPercentage = this.project.numberOfAssignments > 0 ?
                this.project.numberOfFinishedAssignments / this.project.numberOfAssignments * 100 : 0.0;
            return [
                Number(guidanceMeetingsPercentage.toFixed(2)), 
                Number(milestoneMeetingsPercentage.toFixed(2)), 
                Number(assignmentsPercentage.toFixed(2))
            ];
        },
        // eslint-disable-next-line
        items: function (): Array<any> {
            return [
                {
                    name: "Guidance meetings",
                    children: [
                        {
                            name: "Completed meetings: " + this.project.numberOfCompletedGuidanceMeetings,
                        },
                        {
                            name: "Total number of meetings: " + this.project.numberOfGuidanceMeetings,
                        }
                    ]
                },
                {
                    name: "Milestone meetings",
                    children: [
                        {
                            name: "Completed meetings: " + this.project.numberOfCompletedMilestoneMeetings,
                        },
                        {
                            name: "Total number of meetings: " + this.project.numberOfMilestoneMeetings,
                        }
                    ]
                },
                {
                    id: 3,
                    name: "Assignments",
                    children: [
                        {
                            name: "Assignments that have been turned in: " + this.project.numberOfFinishedAssignments,
                        },
                        {
                            name: "Total number of assignments: " + this.project.numberOfAssignments,
                        }
                    ]
                }
            ]
        }
    },
    components: {
        VueApexCharts
    }
})
</script>
