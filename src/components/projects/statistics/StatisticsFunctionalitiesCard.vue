<template>
    <v-card class="mb-5">
        <v-card-title>
            <span class="text-h5 primary--text text--darken-3">{{ cardTitle }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row justify-center v-if="loading">
                    <v-col cols="12" class="text-center">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-col v-if="checkSeries" cols="12" sm="12" md="5" lg="5" xl="5">
                        <vue-apex-charts height="auto" type="pie" :options="options" :series="series" />
                    </v-col>
                    <v-col cols="12" sm="12" md="5" lg="5" xl="5" v-else>
                        <span class="text-subtitle-1">No statistics are available yet...</span>
                    </v-col>
                    <v-col lg="1" xl="1" class="hidden-md-and-down">
                        <v-divider vertical></v-divider>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                        <v-treeview dense hoverable :items="items" />
                    </v-col>
                </v-row>
                <v-row v-if="functionalities.length">
                    <v-divider />
                </v-row>
                <v-row v-if="functionalities.length">
                    <v-col class="px-5 py-5" cols="12" md="12" lg="6" xl="6" v-for="serie in lineChartSeries" :key="serie.options.chart.id">
                        <vue-apex-charts height="250" :options="serie.options" :series="serie.series"></vue-apex-charts>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VueApexCharts from 'vue-apexcharts';
import { storeService } from '@/store';
import { FunctionalityGroupInterface, FunctionalityInterface, FunctionalityPayloadInterface, HistoryGroupInterface, HistoryInterface, HistoryPayloadInterface, StatusInterface } from '@/store/functionalities/types';
import { FunctionalityLineChartOptionsInterface } from '@/modules/project';


export default defineComponent({
    data() {
        return {
            cardTitle: 'Functionalities',
            functionalities: [] as FunctionalityGroupInterface[],
            epics: [] as FunctionalityInterface[],
            history: [] as HistoryGroupInterface[],
            statuses: [] as StatusInterface[],
            loading: false,
            options: {
                colors: [
                    this.$vuetify.theme.currentTheme.error,
                    this.$vuetify.theme.currentTheme.warning,
                    this.$vuetify.theme.currentTheme.secondary,
                    this.$vuetify.theme.currentTheme.primary,

                ],
                labels: [],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            }
        };
    },
    computed: {
        series: function (): Array<number> {
            let elements = [] as Array<number>;

            this.functionalities.forEach((group) => {
                const foundEpics = this.epics.filter(element => element.status.name === group.status.name);
                elements.splice(group.status.orderNumber, 0, group.functionalities.length + foundEpics.length);
                if (!this.options.labels.includes(group.status.name)) {
                    this.options.labels.splice(group.status.orderNumber, 0, group.status.name);
                }
            });
            
            return elements;
        },
        checkSeries: function(): boolean{
            const values = this.series.filter(element => element > 0);

            return values.length > 0;
        },
        items: function (): Array<{ name: string, children: Array<{ name: string; }> }> {
            let info = [] as Array<{ name: string; }>;
            this.functionalities.forEach((group) => {
                const foundEpics = this.epics.filter(element => element.status.name === group.status.name);
                info.push({
                    name: group.status.name + ": " + (group.functionalities.length + foundEpics.length)
                })
            });
            return [{
                name: "Functionalities",
                children: info
            }];
        },
        lineChartSeries: function (): FunctionalityLineChartOptionsInterface[] {
            let chartOptions = [] as FunctionalityLineChartOptionsInterface[];
            if (this.history.length) {
                this.history.forEach((history, index) => {

                    let statusChartOptions = {
                        options: {
                            chart: {
                                id: history.status.name,
                                type: 'area',
                                curve: 'smooth',
                            },
                            colors: [this.options.colors[index] as string],
                            fill: {
                                type: 'gradient',
                                gradient: {
                                    shadeIntensity: 1,
                                    inverseColors: false,
                                    opacityFrom: 0.5,
                                    opacityTo: 0,
                                    stops: [0, 90, 100]
                                },
                            },
                            yaxis: {
                                type: 'numeric',
                                decimalsInFloat: 0,
                                title: {
                                    text: history.status.name
                                },
                            },
                            xaxis: {
                                type: 'datetime',
                            }
                        },
                        series: [
                            {
                                data: [] as Array<{
                                    x: Date;
                                    y: number;
                                }>
                            }
                        ]
                    };
                    history.logs.forEach((element: HistoryInterface) => {
                        statusChartOptions.series[0].data.push({
                            x: element.createdAt,
                            y: element.numberOfFunctionalities
                        } as {
                            x: Date;
                            y: number
                        });
                    });
                    chartOptions.push(statusChartOptions);
                });
            }
            return chartOptions;
        }
    },
    components: {
        VueApexCharts
    },
    methods: {
        loadData: async function (): Promise<void> {
            await storeService.functionalities.loadStatuses().then(() => {
                const statuses = storeService.functionalities.getStatuses();
                statuses.forEach((element) => {
                    storeService.functionalities.load({
                        projectId: Number(this.$route.params.id),
                        status: element
                    } as FunctionalityPayloadInterface);
                    storeService.functionalities.loadHistory({
                        projectId: Number(this.$route.params.id),
                        status: element
                    } as HistoryPayloadInterface);
                });

            });
        },
    },
    created: async function (): Promise<void> {
        this.loading = true;
        storeService.functionalities.loadTypes();
        await this.loadData();
        this.statuses = storeService.functionalities.getStatuses();
        this.functionalities = storeService.functionalities.getFunctionalities();
        this.epics = storeService.functionalities.getEpics();
        this.history = storeService.functionalities.getHistory();
        this.loading = false;
    }
})
</script>
