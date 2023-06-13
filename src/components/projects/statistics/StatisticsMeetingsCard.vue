<template>
    <v-card class="mb-5">
        <v-card-title>
            <span class="text-h5 primary--text text--darken-3">{{ cardTitle }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col v-if="checkSeries" cols="12" sm="12" md="5" lg="5" xl="5">
                        <vue-apex-charts height="auto" type="radialBar" :options="options"
                            :series="series"></vue-apex-charts>
                    </v-col>
                    <v-col cols="12" sm="12" md="5" lg="5" xl="5" v-else>
                        <span class="text-subtitle-1">No statistics are available yet...</span>
                    </v-col>
                    <v-col lg="1" xl="1" class="hidden-md-and-down">
                        <v-divider vertical></v-divider>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
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
            cardTitle: 'Meetings and assignments',
            options: {
                plotOptions: {
                    radialBar: {
                    }
                },
                colors: [
                    this.$vuetify.theme.currentTheme.primary,
                    this.$vuetify.theme.currentTheme.secondary,
                    this.$vuetify.theme.currentTheme.warning
                ],
                labels: ['Guidance meetings', 'Milestone meetings', 'Assignments'],
            }
        }
    },
    computed: {
        series: function (): Array<number> {
            const guidanceMeetingsPercentage = this.project.guidanceMeetingInformation.total > 0 ?
                this.project.guidanceMeetingInformation.completed / this.project.guidanceMeetingInformation.total * 100 : 0.0;
            const milestoneMeetingsPercentage = this.project.milestoneMeetingInformation.total > 0 ?
                this.project.milestoneMeetingInformation.completed / this.project.milestoneMeetingInformation.total * 100 : 0.0;
            const assignmentsPercentage = this.project.assignmentInformation.total > 0 ?
                this.project.assignmentInformation.completed / this.project.assignmentInformation.total * 100 : 0.0;
            return [
                Number(guidanceMeetingsPercentage.toFixed(2)),
                Number(milestoneMeetingsPercentage.toFixed(2)),
                Number(assignmentsPercentage.toFixed(2))
            ];
        },
        checkSeries: function(): boolean{
            const values = this.series.filter(element => element > 0);

            return values.length > 0;
        },
        items: function (): Array<{ name: string, children: Array<{ name: string; }> }> {
            return [
                {
                    name: "Guidance meetings",
                    children: [
                        {
                            name: "Completed meetings: " + this.project.guidanceMeetingInformation.completed,
                        },
                        {
                            name: "Missed meetings: " + this.project.guidanceMeetingInformation.missed,
                        },
                        {
                            name: "Scheduled meetings: " + this.project.guidanceMeetingInformation.scheduled,
                        },
                        {
                            name: "Total number of meetings: " + this.project.guidanceMeetingInformation.total,
                        }
                    ]
                },
                {
                    name: "Milestone meetings",
                    children: [
                        {
                            name: "Completed meetings: " + this.project.milestoneMeetingInformation.completed,
                        },
                        {
                            name: "Missed meetings: " + this.project.milestoneMeetingInformation.missed,
                        },
                        {
                            name: "Scheduled meetings: " + this.project.milestoneMeetingInformation.scheduled,
                        },
                        {
                            name: "Total number of meetings: " + this.project.milestoneMeetingInformation.total,
                        }
                    ]
                },
                {
                    name: "Assignments",
                    children: [
                        {
                            name: "Assignments that have been turned in: " + this.project.assignmentInformation.completed,
                        },
                        {
                            name: "Total number of assignments: " + this.project.assignmentInformation.total,
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
