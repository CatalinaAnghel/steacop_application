<template>
    <div>
        <base-overlay :overlay="loading"></base-overlay>
        <create-assignment-dialog :open="createDialog" @close:dialog="closeCreateDialog"
            @submitted:form="requestStatus => handleMeetingAction(requestStatus)"
            form-title="Create an assignment"></create-assignment-dialog>
        <base-calendar :names="names" :colors="colors" :events="events"
            @update:calendar="payload => updateCalendarEvents(payload)"
            @selected:event="selected => updateSelectedEvent(selected)" :selected-open="selectedOpen"
            @open:event="selectedEvent => registerEventOpen(selectedEvent)" @create:event="openCreateDialog">
            <template v-slot:eventCard="{ selectedEvent }">
                <v-card color="grey lighten-4" min-width="350px" flat>
                    <v-toolbar :color="selectedEvent.color" dark>
                        <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn v-if="showEventOptions(selectedEvent.isCompleted)" icon @click="editMeeting">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn v-if="showEventOptions(selectedEvent.isCompleted)" icon
                            @click="deleteAssignment(selectedEvent)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card-text>
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
                        <v-btn text color="secondary" @click="closePreview">
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
import CreateAssignmentDialog from '@/components/dialogs/assignments/CreateAssignmentDialog.vue';
import { AssignmentEventInterface, CalendarRangeInterface } from '@/modules/calendar';
import { ResponseDto } from '@/modules/common';
import { defineComponent } from 'vue';
import AssignmentService from '@/services/assignment-service';

export default defineComponent({
    data: function () {
        return {
            events: [] as AssignmentEventInterface[],
            names: [
                "Guidance meeting",
                "Milestone meeting"
            ],
            colors: [
                "primary",
                "secondary"
            ],
            selectedOpen: false,
            selectedAssignment: null as AssignmentEventInterface | null,
            editDialog: false,
            createDialog: false,
            gradeMeetingDialog: false,
            calendarRange: {

            } as CalendarRangeInterface,
            loading: false,
        };
    },
    components: {
        BaseOverlay,
        BaseCalendar,
        CreateAssignmentDialog
    },
    methods: {
        toggleLoading: function () {
            this.loading = !this.loading;
        },
        updateCalendarEvents: async function (payload: CalendarRangeInterface) {
            this.toggleLoading();
            this.calendarRange = payload;
            this.events = [];
            const assignments = await AssignmentService.getAssignments([Number(this.$route.params.id)], payload);
            if (null !== assignments) {
                this.events = assignments.map(element => {
                    const dueDate = new Date(element.dueDate);
                    let endingAt = (new Date(element.dueDate))
                        .setHours(dueDate.getHours() + 1);
                    return {
                        name: this.names[0],
                        start: dueDate,
                        end: new Date(endingAt),
                        color: this.colors[0],
                        timed: true,
                        details: element.description,
                        title: element.title,
                        id: element.id,
                        documents: element.documents
                    } as AssignmentEventInterface
                });
            }
            this.toggleLoading();
        },
        updateSelectedEvent: function (selected: boolean): void {
            this.selectedOpen = selected;
            if (!selected) {
                this.selectedAssignment = null;
            }
        },
        showEventOptions: function (isCompleted: boolean): boolean {
            return !isCompleted;
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
        registerEventOpen: async function (selectedEvent: AssignmentEventInterface): Promise<void> {
            this.selectedAssignment = selectedEvent;
        },
        handleMeetingAction: function (response: ResponseDto): void {
            if (response.success) {
                this.updateCalendarEvents(this.calendarRange);
            }
        },
        closePreview: function (): void {
            this.selectedOpen = false;
            this.selectedAssignment = null;
        },
        deleteAssignment(selectedEvent: AssignmentEventInterface): void{
            
        }
    }
});
</script>