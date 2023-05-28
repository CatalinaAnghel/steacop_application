<template>
    <v-card class="mb-5">
        <v-card-title>
            <span class="text-h5 primary--text text--darken-3">{{ cardTitle }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row justify-center v-if="functionalities.length === 0">
                    <v-col cols="12" class="text-center">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                        <vue-apex-charts height="auto" type="pie" :options="options" :series="series" />
                    </v-col>
                    <v-divider cols="1" sm="1" vertical class="hidden-md-and-down" />
                    <v-col cols="12" sm="12" md="5" lg="5" xl="5">
                        <v-treeview shaped hoverable :items="items" />
                    </v-col>
                </v-row>
                <v-row v-if="functionalities.length">
                    <v-divider />
                </v-row>
                <v-row v-if="functionalities.length">
                    <v-col cols="12" v-for="serie in lineChartSeries" :key="serie.options.chart.id">
                        <vue-apex-charts height="auto" :options="serie.options"
                            :series="serie.series"></vue-apex-charts>
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
import { FunctionalityGroupInterface, FunctionalityPayloadInterface, HistoryGroupInterface, HistoryInterface, HistoryPayloadInterface, StatusInterface } from '@/store/functionalities/types';
import { FunctionalityLineChartOptionsInterface } from '@/modules/project';


export default defineComponent({
    data() {
        return {
            cardTitle: 'Functionalities',
            functionalities: [] as FunctionalityGroupInterface[],
            history: [] as HistoryGroupInterface[],
            statuses: [] as StatusInterface[],
            loading: false,
            options: {
                colors: [
                    this.$vuetify.theme.currentTheme.primary,
                    this.$vuetify.theme.currentTheme.secondary,
                    this.$vuetify.theme.currentTheme.warning,
                    this.$vuetify.theme.currentTheme.error
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
                elements.push(group.functionalities.length);
                if (!this.options.labels.includes(group.status.name)) {
                    this.options.labels.push(group.status.name);
                }
            });
            return elements;
        },
        items: function (): Array<{ name: string, children: Array<{ name: string; }> }> {
            let info = [] as Array<{ name: string; }>;
            this.functionalities.forEach((group) => {
                info.push({
                    name: group.status.name + ": " + group.functionalities.length
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
                this.history.forEach((history) => {
                
                    let statusChartOptions = {
                        options: {
                            chart: {
                                id: history.status.name,
                                // group: 'functionalities',
                                type: 'area',
                                curve: 'smooth',
                                height: 350,
                                colors: ['primary']
                            },
                            yaxis: {
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
                        status: element,
                        reload: false
                    } as HistoryPayloadInterface);
                });

            });
        },
    },
    created: async function (): Promise<void> {
        storeService.functionalities.loadTypes();
        await storeService.functionalities.loadStatuses().then(() => {
            this.loadData();
        });
        this.statuses = storeService.functionalities.getStatuses();
        this.functionalities = storeService.functionalities.getFunctionalities();
        this.history = storeService.functionalities.getHistory();
    }
})
</script>