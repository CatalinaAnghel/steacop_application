<template>
    <div>
        <base-overlay :overlay="loading"></base-overlay>
        <div v-if="isSupervisor">
            <create-assignment-dialog :open="createDialog" @close:dialog="closeCreateDialog"
                @submitted:form="requestStatus => handleAction(requestStatus)"
                form-title="Create an assignment"></create-assignment-dialog>
            <edit-assignment-dialog :open="editDialog" @close:dialog="closeEditDialog"
                @submitted:form="requestStatus => handleAction(requestStatus)" form-title="Update the assignment"
                :assignment="selectedAssignment"></edit-assignment-dialog>
        </div>
        <base-calendar :events="events" :activate-create-option="isSupervisor"
            @update:calendar="payload => updateCalendarEvents(payload)"
            @selected:event="selected => updateSelectedEvent(selected)" :selected-open="selectedOpen"
            @open:event="selectedEvent => registerEventOpen(selectedEvent)" @create:event="openCreateDialog">
            <template v-slot:eventCard="{ selectedEvent }">
                <v-card color="grey lighten-4" min-width="auto" flat>
                    <v-toolbar :color="selectedEvent.color" dark>
                        <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon medium class="mx-2" @click="viewAssignment(selectedAssignment.id)">
                            mdi-book-open-outline
                        </v-icon>
                        <v-btn v-if="showEventOptions(selectedEvent)" icon @click="openEditDialog">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn v-if="showEventOptions(selectedEvent)" icon @click="deleteAssignment(selectedEvent)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card-text>
                        <div class="pb-5">
                            <span class="mdi mdi-clock-outline pr-2"></span>
                            <span><b>Due at: </b>{{ (new Date(selectedEvent.end)).toLocaleTimeString() }}</span>
                        </div>
                        <div class="pb-5">
                            <span class="mdi mdi-book-outline pr-2"></span>
                            <span><b>Status: </b><span :class="getAssignmentStatus(selectedEvent).color + '--text'">{{
                                getAssignmentStatus(selectedEvent).message }}</span></span>
                        </div>
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
import EditAssignmentDialog from '@/components/dialogs/assignments/EditAssignmentDialog.vue';
import { AssignmentEventInterface, CalendarRangeInterface } from '@/modules/calendar';
import { ResponseDto } from '@/modules/common';
import mixins from "vue-typed-mixins";
import RoleMixin from "@/components/mixins/RoleMixin.vue";
import AssignmentService from '@/services/assignment-service';
import { AssignmentStatusInterface, getStatus } from '@/modules/assignment';

export default mixins(RoleMixin).extend({
    data: function () {
        return {
            events: [] as AssignmentEventInterface[],
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
        CreateAssignmentDialog,
        EditAssignmentDialog
    },
    methods: {
        toggleLoading: function () {
            this.loading = !this.loading;
        },
        showEventOptions(assignment: AssignmentEventInterface): boolean {
            return this.isSupervisor && (assignment.turnInDate === null || typeof assignment.turnInDate === 'undefined');
        },
        updateCalendarEvents: async function (payload: CalendarRangeInterface) {
            this.toggleLoading();
            this.calendarRange = payload;
            this.events = [];
            const assignments = await AssignmentService.getAssignments([Number(this.$route.params.id)], payload);
            if (null !== assignments) {
                this.events = assignments.map(element => {
                    const dueDate = new Date(element.dueDate);
                    let startingAt = (new Date(element.dueDate))
                        .setHours(dueDate.getHours() - 1);
                    return {
                        name: element.title,
                        start: new Date(startingAt),
                        end: dueDate,
                        color: 'primary',
                        timed: false,
                        details: element.description,
                        title: element.title,
                        id: element.id,
                        documents: element.documents,
                        turnInDate: element.turnedInDate,
                        grade: element.grade
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
        openEditDialog: function (): void {
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
        registerEventOpen: function (selectedEvent: AssignmentEventInterface): void {
            this.selectedAssignment = selectedEvent as AssignmentEventInterface;
        },
        handleAction: function (response: ResponseDto): void {
            if (response.success) {
                this.updateCalendarEvents(this.calendarRange);
            }
        },
        closePreview: function (): void {
            this.selectedOpen = false;
            this.selectedAssignment = null;
        },
        deleteAssignment: async function (selectedEvent: AssignmentEventInterface): Promise<void> {
            this.toggleLoading();
            let response = {
                error: "",
                success: true
            } as ResponseDto;
            response = await AssignmentService.deleteAssignment(selectedEvent.id);
            if (response.success) {
                this.events = this.events.filter(event => { return event.id !== selectedEvent.id });
            }
            this.selectedOpen = false;
            this.toggleLoading();
        },
        getAssignmentStatus(selectedEvent: AssignmentEventInterface): AssignmentStatusInterface {
            return getStatus(this.selectedAssignment.grade, new Date(selectedEvent.end), selectedEvent.turnInDate);
        },
        viewAssignment(assignmentId: number): void {
            const id = assignmentId.toString();
            this.$router.push({
                name: "assignment", params: {
                    id
                }
            });
        }
    },
    created: function (): void {
        this.setProperties();
    }
});
</script>