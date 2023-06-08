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
                    <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                        <vue-apex-charts height="300px" type="bar" :options="chartOptions"
                            :series="series"></vue-apex-charts>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { GradesCollectionInterface } from "@/modules/project";
import StudentService from "@/services/student-service";
import { defineComponent } from "vue";
import VueApexCharts from 'vue-apexcharts';

export default defineComponent({
    data: function () {
        return {
            loading: false,
            cardTitle: "Students' grades",
            grades: null as GradesCollectionInterface,
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
                        text: 'Grade'
                    }
                },
                fill: {
                    opacity: 1
                }
            },
        };
    },
    components: {
        VueApexCharts
    },
    computed: {
        series: function (): { name: string; data: number[] }[] {
            let assignmentGrades = { name: 'Assignment grade', data: [] as number[] };
            let milestoneMeetingGrades = { name: 'Milestone meeting grade', data: [] as number[] };
            let providedGrade = { name: 'Provided grade', data: [] as number[] };
            if (this.grades !== null) {
                this.grades.gradesCollection.forEach(gradesElement => {
                    assignmentGrades.data.push(gradesElement.assignmentsGrade);
                    milestoneMeetingGrades.data.push(gradesElement.milestoneMeetingsGrade);
                    providedGrade.data.push(gradesElement.totalGrade);
                })
            }

            console.log(assignmentGrades, milestoneMeetingGrades);
            return [
                assignmentGrades,
                milestoneMeetingGrades,
                providedGrade
            ];
        }
    },
    created: async function (): Promise<void> {
        this.loading = true;
        this.grades = await StudentService.getGrades();
        let students = [] as string[];
        if (this.grades !== null) {
            this.grades.gradesCollection.forEach(gradesElement => {
                students.push(gradesElement.studentData.firstName + ' ' + gradesElement.studentData.lastName);
            })
        }
        this.chartOptions.xaxis.categories = students;
        this.loading = false;
    }
});
</script>