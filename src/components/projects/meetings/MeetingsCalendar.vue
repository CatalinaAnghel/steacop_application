<template>
    <div>
        <base-overlay :overlay="loading"></base-overlay>
        <create-meeting-dialog :open="createDialog" @close:dialog="closeCreateDialog"
            @submitted:form="requestStatus => handleMeetingAction(requestStatus)"></create-meeting-dialog>
        <edit-meeting-dialog :meeting="selectedMeeting" :open="editDialog"
            :meetingId="selectedMeeting !== null ? selectedMeeting.id : 0" @open:dialog="selectedOpen = false"
            @close:dialog="closeEditDialog"
            @submitted:form="requestStatus => handleMeetingAction(requestStatus)"></edit-meeting-dialog>
        <grade-meeting-dialog :meeting="selectedMeeting" :open="gradeMeetingDialog"
            :meetingId="selectedMeeting !== null ? selectedMeeting.id : 0" @open:dialog="selectedOpen = false"
            @close:dialog="closeGradeMeetingDialog"
            @submitted:form="requestStatus => handleMeetingAction(requestStatus)"></grade-meeting-dialog>
        <base-calendar :names="names" :colors="colors" :events="events"
            @update:calendar="payload => updateCalendarEvents(payload)"
            @selected:event="selected => updateSelectedEvent(selected)" :selected-open="selectedOpen"
            @open:event="selectedEvent => registerEventOpen(selectedEvent)" @create:event="openCreateDialog">
            <template v-slot:eventCard="{ selectedEvent }">
                <v-card color="grey lighten-4" min-width="350px" flat>
                    <v-toolbar :color="selectedEvent.color" dark>
                        <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn v-if="showEventOptions(selectedEvent.isCompleted)" icon @click="completeMeeting">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                        <v-btn v-if="showEventOptions(selectedEvent.isCompleted)" icon @click="editMeeting">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn v-if="showEventOptions(selectedEvent.isCompleted)" icon
                            @click="cancelMeeting(selectedEvent)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card-text>
                        <base-rating :rating="rating.value" v-if="showRating(selectedEvent)"
                            @updated:rating="ratingValue => editRating(ratingValue)" :readonly="readonlyRating"></base-rating>
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
                            <span><b>Status: </b>{{ selectedEvent.isCompleted ? "Finished" : "Scheduled" }}</span>
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
import EditMeetingDialog from '@/components/dialogs/meetings/EditMeetingDialog.vue';
import CreateMeetingDialog from '@/components/dialogs/meetings/CreateMeetingDialog.vue';
import GradeMeetingDialog from '@/components/dialogs/meetings/GradeMeetingDialog.vue';
import BaseOverlay from '@/components/base/BaseOverlay.vue';
import BaseRating from "@/components/base/BaseRating.vue";
import { CalendarRangeInterface, EventInterface, EventTypes } from '@/modules/calendar';
import { ResponseDto } from '@/modules/common';
import { MeetingInterface, MilestoneMeetingInterface } from '@/modules/meeting';
import MeetingService from '@/services/meeting-service';
import { defineComponent } from 'vue';
import RatingService from '@/services/rating-service';

export default defineComponent({
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
            editDialog: false,
            createDialog: false,
            gradeMeetingDialog: false,
            calendarRange: {

            } as CalendarRangeInterface,
            loading: false,
            rating: {
                value: 0,
                meetingId: 0,
                id: 0
            },
            readonlyRating: true
        };
    },
    components: {
        BaseOverlay,
        BaseCalendar,
        BaseRating,
        CreateMeetingDialog,
        EditMeetingDialog,
        GradeMeetingDialog,
    },
    methods: {
        toggleLoading: function () {
            this.loading = !this.loading;
        },
        updateCalendarEvents: async function (payload: CalendarRangeInterface) {
            this.toggleLoading();
            this.calendarRange = payload;
            this.events = [];
            const meetings = await MeetingService.getGuidanceMeetings([Number(this.$route.params.id)], payload);
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
                        type: EventTypes.EVENT_TYPE_GUIDANCE_MEETING
                    } as EventInterface
                });
            }
            const milestoneMeetings = await MeetingService.getMilestoneMeetings([Number(this.$route.params.id)], payload);
            if (null !== milestoneMeetings) {
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
                        type: EventTypes.EVENT_TYPE_MILESTONE_MEETING
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
            return !isCompleted;
        },
        cancelMeeting: async function (meeting: EventInterface): Promise<void> {
            this.toggleLoading();
            let response = {
                error: "",
                success: true
            } as ResponseDto;
            if (meeting.type === EventTypes.EVENT_TYPE_GUIDANCE_MEETING) {
                let meetingPayload = {
                    id: meeting.id,
                    duration: meeting.duration,
                    isCompleted: meeting.isCompleted,
                    description: meeting.details,
                    scheduledAt: meeting.start.toISOString(),
                    isCanceled: true,
                    canceledAt: new Date(),
                    link: meeting.link
                } as MeetingInterface;
                response = await MeetingService.updateGuidanceMeeting(meeting.id, meetingPayload);
            } else {
                let meetingPayload = {
                    id: meeting.id,
                    duration: meeting.duration,
                    isCompleted: meeting.isCompleted,
                    description: meeting.details,
                    scheduledAt: meeting.start.toISOString(),
                    isCanceled: true,
                    canceledAt: new Date(),
                    link: meeting.link,
                    grade: meeting.grade
                } as MilestoneMeetingInterface;
                response = await MeetingService.updateMilestoneMeeting(meeting.id, meetingPayload);
            }

            if (response.success) {
                this.events = this.events.filter(event => { return event.id !== meeting.id });
            }
            this.selectedOpen = false;
            this.toggleLoading();
        },
        editMeeting: function (): void {
            this.editDialog = true;
        },
        closeEditDialog: function (): void {
            this.editDialog = false;
        },
        gradeMeeting: function (): void {
            this.gradeMeetingDialog = true;
        },
        closeGradeMeetingDialog: function (): void {
            this.gradeMeetingDialog = false;
        },
        openCreateDialog: function (): void {
            this.createDialog = true;
        },
        closeCreateDialog: function (): void {
            this.createDialog = false;
        },
        registerEventOpen: async function (selectedEvent: EventInterface): Promise<void> {
            this.selectedMeeting = selectedEvent;
            const response = await RatingService.getRating(this.selectedMeeting.id);
            this.readonlyRating = response === false;
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
        },
        handleMeetingAction: function (response: ResponseDto): void {
            if (response.success) {
                this.updateCalendarEvents(this.calendarRange);
            }
        },
        completeMeeting: async function (): Promise<void> {
            if (this.selectedMeeting !== null) {
                this.toggleLoading();
                let response = {
                    'success': true,
                    'error': '',
                    code: null as number | null
                };
                if (this.selectedMeeting !== null) {
                    response = await MeetingService.finishMeeting(this.selectedMeeting.id, this.selectedMeeting.type);
                    this.toggleLoading();
                    if (response.success && this.selectedMeeting !== null && this.selectedMeeting.type === EventTypes.EVENT_TYPE_MILESTONE_MEETING) {
                        this.gradeMeeting();
                    } else {
                        this.handleMeetingAction(response);
                    }
                }
            }
        },
        editRating: async function (rating: number): Promise<void> {
            this.rating.value = rating;

            if(this.rating.id > 0){
                await RatingService.updateRating(this.rating.id, rating);
            }else{
                await RatingService.createRating(this.rating);
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
            this.readonlyRating = true;
        }
    }
});
</script>