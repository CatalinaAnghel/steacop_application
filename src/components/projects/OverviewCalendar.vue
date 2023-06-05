<template>
    <div>
        <base-overlay :overlay="loading"></base-overlay>
        <base-calendar :events="events" @update:calendar="payload => updateCalendarEvents(payload)"
            @selected:event="selected => updateSelectedEvent(selected)" :selected-open="selectedOpen"
            @open:event="selectedEvent => registerEventOpen(selectedEvent)">
            <template v-slot:eventCard="{ selectedEvent }">
                <v-card color="grey lighten-4" min-width="auto" flat>
                    <v-toolbar :color="selectedEvent.color" dark>
                        <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <base-rating :rating="rating.value" v-if="showRating(selectedEvent)"></base-rating>
                        <div class="pb-5">
                            <span class="mdi mdi-clock-outline pr-2"></span>
                            <span><b>Student: </b>{{ selectedEvent.studentFullName }}</span>
                        </div>
                        <div class="pb-5">
                            <span class="mdi mdi-clock-outline pr-2"></span>
                            <span><b>Scheduled at: </b>{{ (new Date(selectedEvent.start)).toLocaleTimeString() }} - {{ (new
                                Date(selectedEvent.end)).toLocaleTimeString() }}</span>
                        </div>
                        <div class="pb-5">
                            <span class="mdi mdi-link pr-2"></span>
                            <span><b>Link: </b><a target="_blank" :href="selectedEvent.link">{{ selectedEvent.link
                            }}</a></span>
                        </div>
                        <div class="pb-5">
                            <span class="mdi mdi-link pr-2"></span>
                            <span><b>Status: </b>{{ selectedEvent.isCompleted ? "Completed" : "Scheduled" }}</span>
                        </div>
                        <div class="pb-5" v-if="typeof selectedEvent.grade !== 'undefined'">
                            <span class="mdi mdi-link pr-2"></span>
                            <span><b>Grade: </b>{{ selectedEvent.grade }}</span>
                        </div>
                        <v-divider></v-divider>
                        <span class="pt-5">{{ selectedEvent.details }}</span>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="secondary" @click="closeMeetingPreview">
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </base-calendar>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import BaseCalendar from '@/components/base/BaseCalendar.vue';
import BaseOverlay from '@/components/base/BaseOverlay.vue';
import BaseRating from "@/components/base/BaseRating.vue";
import { CalendarRangeInterface, EventInterface, EventTypes } from '@/modules/calendar';
import { ResponseDto } from '@/modules/common';
import MeetingService from '@/services/meeting-service';
import RatingService from '@/services/rating-service';
import mixins from "vue-typed-mixins";
import RoleMixin from "@/components/mixins/RoleMixin.vue";
import { storeService } from '@/store';

export default mixins(RoleMixin).extend({
    data: function () {
        return {
            events: [] as EventInterface[],
            names: [
                "Guidance meeting",
                "Milestone meeting"
            ],
            colors: [
                "primary",
                "secondary"
            ],
            selectedOpen: false,
            selectedMeeting: null as EventInterface | null,
            calendarRange: {

            } as CalendarRangeInterface,
            loading: false,
            rating: {
                value: 0,
                meetingId: 0,
                id: 0
            },
            readonlyRating: true,
            existingMilestoneMeetingsNumber: 0
        };
    },
    components: {
        BaseOverlay,
        BaseCalendar,
        BaseRating,
    },
    methods: {
        toggleLoading: function () {
            this.loading = !this.loading;
        },
        updateCalendarEvents: async function (payload: CalendarRangeInterface) {
            this.toggleLoading();
            this.calendarRange = payload;
            this.events = [];
            let projectIds = [] as number[];
            storeService.user.getUser().projects.forEach(project => {
                projectIds.push(project.id);
            })
            const meetings = await MeetingService.getGuidanceMeetings(projectIds, payload);
            if (null !== meetings) {
                this.events = meetings.map(element => {
                    const scheduledAt = new Date(element.scheduledAt);
                    const hours = Math.floor(element.duration);
                    const minutes = element.duration > Math.floor(element.duration) ? 60 / (10 / (element.duration * 10 % 10)) : 0;
                    let endingAt = (new Date(element.scheduledAt))
                        .setHours(scheduledAt.getHours() + Number(hours));
                    endingAt = (new Date(endingAt)).setMinutes((new Date(endingAt)).getMinutes() + Number(minutes));
                    return {
                        name: this.names[0],
                        start: scheduledAt,
                        end: new Date(endingAt),
                        color: this.colors[0],
                        timed: true,
                        duration: element.duration,
                        details: element.description,
                        isCompleted: element.isCompleted,
                        link: element.link,
                        id: element.id,
                        type: EventTypes.EVENT_TYPE_GUIDANCE_MEETING,
                        studentFullName: element.studentFullName
                    } as EventInterface
                });
            }
            
            const milestoneMeetings = await MeetingService.getMilestoneMeetings(projectIds, payload);
            if (null !== milestoneMeetings) {
                this.existingMilestoneMeetingsNumber = milestoneMeetings.length;
                const tempEvents = milestoneMeetings.map(element => {
                    const scheduledAt = new Date(element.scheduledAt);
                    const hours = Math.floor(element.duration);
                    const minutes = element.duration > Math.floor(element.duration) ? 60 / (10 / (element.duration * 10 % 10)) : 0;
                    let endingAt = (new Date(element.scheduledAt))
                        .setHours(scheduledAt.getHours() + Number(hours));
                    endingAt = (new Date(endingAt)).setMinutes((new Date(endingAt)).getMinutes() + Number(minutes));
                    return {
                        name: this.names[1],
                        start: scheduledAt,
                        end: new Date(endingAt),
                        color: this.colors[1],
                        timed: true,
                        duration: element.duration,
                        details: element.description,
                        isCompleted: element.isCompleted,
                        link: element.link,
                        id: element.id,
                        type: EventTypes.EVENT_TYPE_MILESTONE_MEETING,
                        studentFullName: element.studentFullName
                    } as EventInterface
                });
                this.events = [...this.events, ...tempEvents];
            }
            this.toggleLoading();
        },
        updateSelectedEvent: function (selected: boolean): void {
            this.selectedOpen = selected;
            if (!selected) {
                this.selectedMeeting = null;
                this.rating = {
                    id: 0,
                    value: 0,
                    meetingId: 0
                };
            }
        },
        showEventOptions: function (isCompleted: boolean): boolean {
            return !isCompleted && this.isSupervisor;
        },
        registerEventOpen: async function (selectedEvent: EventInterface): Promise<void> {
            this.selectedMeeting = selectedEvent;
            if (selectedEvent.isCompleted && selectedEvent.type === EventTypes.EVENT_TYPE_GUIDANCE_MEETING) {
                const response = await RatingService.getRating(this.selectedMeeting.id);
                if (response !== false && response !== null) {
                    this.rating = {
                        meetingId: selectedEvent.id,
                        value: response.value,
                        id: response.id
                    }
                } else if (response === null) {
                    this.rating = {
                        meetingId: selectedEvent.id,
                        value: 0,
                        id: 0
                    }
                }
            }
        },
        handleMeetingAction: function (response: ResponseDto): void {
            if (response.success) {
                this.updateCalendarEvents(this.calendarRange);
            }
        },
        showRating: function (selectedEvent: any): boolean {
            return selectedEvent.isCompleted && selectedEvent.type === EventTypes.EVENT_TYPE_GUIDANCE_MEETING;
        },
        closeMeetingPreview: function (): void {
            this.selectedOpen = false;
            this.rating = {
                id: 0,
                value: 0,
                meetingId: 0
            };
            this.selectedMeeting = null;
        },
        checkPastMeeting(selectedEvent: any): boolean {
            return selectedEvent.start < new Date();
        }
    },
    created: function (): void {
        this.setProperties();
    }
});
</script>