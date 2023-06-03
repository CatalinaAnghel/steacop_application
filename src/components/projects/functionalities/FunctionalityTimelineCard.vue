<template>
    <v-col cols="12" md="12" lg="8" xl="8">
        <v-card class="mb-5">
            <v-card-title>
                <span class="text-h6 px-2 primary--text text--darken-3">{{ cardTitle }}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row justify-center v-if="loading">
                        <v-col cols="12" class="text-center">
                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <v-col cols="12">
                            <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown">
                                <v-timeline-item v-for="(item, i) in items" :key="i" :color="item.color"
                                    :icon="item.icon.name" fill-dot>
                                    <span :class="item.icon.color + ' subtitle-1 font-weight-bold '">{{ item.status }} - {{
                                        item.createdAt }}</span>
                                </v-timeline-item>
                            </v-timeline>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeService } from '@/store';
import { FunctionalityInterface, FunctionalityStatusHistory } from '@/store/functionalities/types';
import { getStatusIcon, IconInterface } from "@/modules/project";


export default defineComponent({
    props: {
        functionalityDetails: {
            type: Object as () => FunctionalityInterface,
            required: true
        }
    },
    data() {
        return {
            cardTitle: 'Status history',
            history: [] as FunctionalityStatusHistory[],
            loading: false,
            options: {
                colors: [
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
        items: function (): { color: string; icon: IconInterface; createdAt: string, status: string }[] {
            let icon = getStatusIcon("Open");
            let color = icon.color;
            if (icon.color.includes(' ')) {
                icon.color = icon.color.replace(' ', '--text text--');
            } else {
                icon.color = icon.color + '--text'
            }

            let items = [{
                color: color,
                icon: icon,
                createdAt: (new Date(this.functionalityDetails.createdAt)).toLocaleDateString() + ' ' +
                    (new Date(this.functionalityDetails.createdAt)).toLocaleTimeString(),
                status: "Open"
            }] as { color: string; icon: IconInterface; createdAt: string, status: string }[];
            if (this.history.length) {
                this.history.forEach((history) => {
                    let icon = getStatusIcon(history.newStatus.name);
                    color = icon.color;
                    if (icon.color.includes(' ')) {
                        icon.color = icon.color.replace(' ', '--text text--');
                    } else {
                        icon.color = icon.color + '--text'
                    }
                    items.push({
                        color: color,
                        icon: icon,
                        createdAt: (new Date(history.createdAt)).toLocaleDateString() + ' ' +
                            (new Date(history.createdAt)).toLocaleTimeString(),
                        status: history.newStatus.name
                    } as { color: string; icon: IconInterface; createdAt: string, status: string });
                });
            }
            return items;
        }
    },
    created: async function (): Promise<void> {
        this.loading = true;
        this.history = await storeService.functionalities.fetchFunctionalityStatusHistory(this.functionalityDetails.id);
        await storeService.functionalities.loadStatuses();
        this.loading = false;
    }
})
</script>