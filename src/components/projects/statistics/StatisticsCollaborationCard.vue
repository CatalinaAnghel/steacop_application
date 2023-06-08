<template>
    <v-card class="mb-5">
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
                    <v-col cols="12" sm="12" md="5" lg="5" xl="5">
                        <vue-apex-charts height="auto" type="radialBar" :options="options"
                            :series="series"></vue-apex-charts>
                    </v-col>
                    <v-col lg="1" xl="1" class="hidden-md-and-down">
                        <v-divider vertical></v-divider>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                        <v-expansion-panels class="w-100" v-model="panel" :disabled="disabled" multiple>
                            <v-expansion-panel>
                                <v-expansion-panel-header class="subtitle-2">Structure score</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <p>
                                        This score is computed based on the structure components (assignments and milestone
                                        meetings). This score can be broken up into two parts:
                                    </p>
                                    <ul>
                                        <li><span class="text-subtitle-2">Assignments score:</span> <span class="">{{
                                            collaborationData.structureScore.assignmentsScore }}%</span></li>
                                        <li><span class="text-subtitle-2">Milestone meetings score:</span> <span class="">{{
                                            collaborationData.structureScore.milestoneMeetingsScore.toFixed(2) }}%</span></li>
                                    </ul>
                                </v-expansion-panel-content>
                            </v-expansion-panel>

                            <v-expansion-panel>
                                <v-expansion-panel-header class="subtitle-2">Support score</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <p>
                                        This score is computed based on the support component (i.e. the guidance meetings).
                                        The score depends on the proposed supervisory style since it represents the number
                                        of completed meetings divided by the number of guidance meetings (based on the
                                        supervisory plan).
                                    </p>
                                </v-expansion-panel-content>
                            </v-expansion-panel>

                            <v-expansion-panel>
                                <v-expansion-panel-header class="subtitle-2">Rating score</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <p>
                                        This score is computed based on the ratings given by the supervisor and the
                                        supervisee for the guidance meetings.
                                    </p>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import RoleMixin from "@/components/mixins/RoleMixin.vue";
import mixins from "vue-typed-mixins";
import VueApexCharts from 'vue-apexcharts';
import { CollaborationInfoInterface } from "@/modules/project";
import ProjectService from "@/services/project-service";

export default mixins(RoleMixin).extend({
    props: {
        projectId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            cardTitle: 'Collaboration statistics',
            options: {
                plotOptions: {
                    radialBar: {
                    }
                },
                colors: [
                    this.$vuetify.theme.currentTheme.primary,
                    this.$vuetify.theme.currentTheme.secondary,
                    this.$vuetify.theme.currentTheme.warning,
                    this.$vuetify.theme.currentTheme.error
                ],
                labels: ['Total score', 'Structure score', 'Support score', 'Rating score'],
            },
            collaborationData: null as CollaborationInfoInterface | null,
            panel: [],
            disabled: false,
            readonly: false,
            loading: false
        }
    },
    components: {
        VueApexCharts
    },
    computed: {
        series: function (): number[] {
            let values = [];
            if (this.collaborationData !== null) {
                values.push(Number(this.collaborationData.score.toFixed(2)));
                values.push(Number(this.collaborationData.ratingScore.totalScore.toFixed(2)));
                values.push(Number(this.collaborationData.structureScore.totalScore.toFixed(2)));
                values.push(Number(this.collaborationData.supportScore.totalScore.toFixed(2)));
            }

            return values;
        },
    },
    created: async function (): Promise<void> {
        this.loading = true;
        this.collaborationData = await ProjectService.getCollaborationInfo(this.projectId);
        this.loading = false;
    }
});
</script>