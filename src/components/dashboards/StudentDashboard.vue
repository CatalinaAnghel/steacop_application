<template>
    <div>
        <statistics-collaboration-card :projectId="projectId"></statistics-collaboration-card>
        <v-row>
            <v-col v-for="item in items" :key="item.key" cols="12" md="12" :lg="12/items.length" :xl="12/items.length">
                <base-dashboard-card :cardTitle="item.cardTitle" :textColor="item.color"
                    :loading="item.loading" :items="item.data" :icon="item.icon" :card-action="item.cardAction"></base-dashboard-card>
            </v-col>
        </v-row>
        
    </div>
</template>

<script lang="ts">
import { storeService } from "@/store";
import { defineComponent } from "vue";
import StatisticsCollaborationCard from "../projects/statistics/StatisticsCollaborationCard.vue";
import BaseDashboardCard from "../base/BaseDashboardCard.vue";
import { DashboardDataInterface, DashboardElementInterface } from "@/modules/common";
import MeetingService from "@/services/meeting-service";
import { CalendarRangeInterface } from "@/modules/calendar";
import AssignmentService from "@/services/assignment-service";

export default defineComponent({
    data: function () {
        return {
            items: [
                {
                    key: 'guidance-meetings',
                    cardTitle: 'Scheduled guidance meetings this week',
                    color: 'primary',
                    loading: true,
                    icon: 'mdi-laptop-account',
                    cardAction: true,
                    data: [] as DashboardDataInterface[]
                },
                {
                    key: 'milestonemeetings',
                    cardTitle: 'Scheduled milestone meetings this week',
                    color: 'secondary',
                    loading: true,
                    icon: 'mdi-laptop-account',
                    cardAction: true,
                    data: [] as DashboardDataInterface[]
                },
                {
                    key: 'assignments',
                    cardTitle: 'Assignments this week',
                    color: 'warning',
                    loading: true,
                    icon: 'mdi-file-document-outline',
                    cardAction: false,
                    data: [] as DashboardDataInterface[]
                },
            ] as DashboardElementInterface[]
        };
    },
    components: {
        StatisticsCollaborationCard,
        BaseDashboardCard
    },
    computed: {
        projectId: function (): number {
            return storeService.user.getUser().projects[0].id;
        }
    },
    created: async function (): Promise<void> {
        const currentDate = new Date();
        let end = new Date();
        end.setDate(end.getDate() + 7);
        let range = {
            start: {
                date: currentDate.toISOString().slice(0, 10)
            },
            end: {
                date: end.toISOString().slice(0, 10)
            }
        } as CalendarRangeInterface;
        MeetingService.getGuidanceMeetings([storeService.user.getUser().projects[0].id], range).then((response) => {
            if(response.length){
                response.forEach(meeting => {
                    this.items[0].data.push({
                        name: meeting.description,
                        dueDate: (new Date(meeting.scheduledAt)).toLocaleString(),
                        to: {
                            name: 'projectMeetings',
                            params: {
                                id: storeService.user.getUser().projects[0].id
                            },
                            perItem: false
                        }
                    } as DashboardDataInterface);
                } );
            }
            this.items[0].loading = false;
        });

        MeetingService.getMilestoneMeetings([storeService.user.getUser().projects[0].id], range).then((response) => {
            if(response.length){
                response.forEach(meeting => {
                    this.items[1].data.push({
                        name: meeting.description,
                        dueDate: (new Date(meeting.scheduledAt)).toLocaleString(),
                        to: {
                            name: 'projectMeetings',
                            params: {
                                id: storeService.user.getUser().projects[0].id
                            },
                            perItem: false
                        }
                    } as DashboardDataInterface);
                } );
            }
            this.items[1].loading = false;
        });

        AssignmentService.getAssignments([storeService.user.getUser().projects[0].id], range).then((response) => {
            if(response.length){
                response.forEach(assignment => {
                    this.items[2].data.push({
                        name: assignment.title,
                        dueDate: (new Date(assignment.dueDate)).toLocaleString(),
                        to: {
                            name: 'assignment',
                            params: {
                                id: assignment.id
                            }
                        },
                        perItem: true
                    } as DashboardDataInterface);
                } );
            }
            this.items[2].loading = false;
        });
    }
});
</script>