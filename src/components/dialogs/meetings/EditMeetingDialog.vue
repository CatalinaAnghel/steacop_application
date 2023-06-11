<template>
    <div>
        <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
            @update:showAlert="updateShowAlert"></base-alert>

        <v-dialog v-if="meetingDetails !== null" v-model="dialog" max-width="500px" @click:outside="close">
            <v-card :loading="loading ? 'secondary' : false">
                <v-card-title>
                    <span class="text-h5 primary--text text--darken-3">{{ formTitle }}</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="close()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col col="12" sm="12" md="12">
                                <validation-observer ref="observer" v-slot="{ handleSubmit }">
                                    <v-form v-model="valid" ref="formDialog" @submit.prevent="handleSubmit(updateMeeting)">
                                        <validation-provider rules="required|min:16" v-slot="{ errors }" name="Description">
                                            <v-text-field v-model="meetingDetails.description" label="Description"
                                                hide-details="auto" :error-messages="errors" class="mt-3"
                                                prepend-icon="mdi-text-short">
                                            </v-text-field>
                                        </validation-provider>
                                        <validation-provider rules="required|min:10" v-slot="{ errors }" name="Link">
                                            <v-text-field v-model="meetingDetails.link" label="Link" hide-details="auto"
                                                :error-messages="errors" class="mt-3" prepend-icon="mdi-link">
                                            </v-text-field>
                                        </validation-provider>
                                        <validation-provider rules="required" v-slot="{ errors }" name="Scheduled date">
                                            <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40"
                                                transition="scale-transition" offset-y min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field v-model="meetingDetails.date" label="Scheduled at"
                                                        prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                                                        :error-messages="errors"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="meetingDetails.date"
                                                    @input="datePicker = false" :min="(new Date()).toISOString().slice(0, 10)"
                                                    color="primary"></v-date-picker>
                                            </v-menu>
                                        </validation-provider>
                                        <validation-provider rules="required" v-slot="{ errors }">
                                            <v-menu ref="menu" v-model="timePicker" :close-on-content-click="false"
                                                :nudge-right="40" :return-value.sync="meetingDetails.time"
                                                transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field v-model="meetingDetails.time" label="Picker in menu"
                                                        prepend-icon="mdi-calendar-clock" readonly v-bind="attrs" v-on="on"
                                                        :error-messages="errors"></v-text-field>
                                                </template>
                                                <v-time-picker format="24hr" v-if="timePicker" v-model="meetingDetails.time"
                                                    full-width color="primary"
                                                    @click:minute="getMenuInstance().save(meetingDetails.time)"></v-time-picker>
                                            </v-menu>
                                        </validation-provider>
                                        <v-slider class="mt-3" prepend-icon="mdi-clock-time-four-outline"
                                            v-model="meetingDetails.duration" color="primary" label="Duration"
                                            hint="Provide the duration (hours)" min="0.5" step="0.5" max="4"
                                            thumb-label></v-slider>

                                        <v-btn :disabled="loading" block dark type="submit" large class="my-3"
                                            color="secondary">Save</v-btn>
                                    </v-form>
                                </validation-observer>

                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { EventInterface, EventTypes } from '@/modules/calendar';
import mixins from 'vue-typed-mixins';
import FormMixin from '@/components/mixins/FormMixin.vue';
import { MeetingInterface, MilestoneMeetingInterface, UpdateMeetingInterface } from "@/modules/meeting";
import Vue from 'vue';
import MeetingService from "@/services/meeting-service";

export default mixins(FormMixin).extend({
    props: {
        formTitle: {
            type: String,
            required: false
        },
        open: {
            type: Boolean,
            required: false,
            default: false
        },
        meetingId: {
            type: Number,
            required: true
        },
        meeting: {
            type: Object as () => EventInterface | null,
            required: false,
            default: null
        }
    },
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data() {
        return {
            dialog: false,
            valid: false,
            loading: false,
            meetingDetails: {
                description: "",
                link: "",
                date: "",
                time: "",
                duration: 0
            } as UpdateMeetingInterface,
            datePicker: false,
            timePicker: false,
        }
    },
    watch: {
        async open(val: boolean): Promise<void> {
            this.dialog = val;
            if (!val) {
                this.close();
            } else if (null !== this.meeting) {
                this.meetingDetails.description = this.meeting.details;
                this.meetingDetails.duration = this.meeting.duration;
                this.meetingDetails.link = this.meeting.link;
                this.meetingDetails.date = this.meeting.start.toISOString().slice(0, 10);
                this.meetingDetails.time = this.meeting.start.toTimeString().substring(0, 5);
                this.$emit('open:dialog');
            }
        }
    },
    computed: {
        showGrade: function (): boolean {
            return this.meeting !== null && this.meeting.type === EventTypes.EVENT_TYPE_MILESTONE_MEETING;
        }
    },
    methods: {
        close() {
            this.dialog = false;
            this.$emit('close:dialog');
            this.reset();
        },
        updateMeeting: async function () {
            this.toggleLoader();
            let payload = {
                description: this.meetingDetails.description,
                duration: this.meetingDetails.duration,
                link: this.meetingDetails.link,
                scheduledAt: new Date(this.meetingDetails.date + ' ' + this.meetingDetails.time).toLocaleString()
            };
            let response = {
                'success': true,
                'error': '',
                code: null as number | null
            };

            if (this.meeting !== null && this.meeting.type === EventTypes.EVENT_TYPE_MILESTONE_MEETING) {
                response = await MeetingService.updateMilestoneMeeting(this.meetingId, payload as MilestoneMeetingInterface);
            } else {
                response = await MeetingService.updateGuidanceMeeting(this.meetingId, payload as MeetingInterface);
            }

            this.handleResponse(response, "The meeting has been successfully updated", true);
            this.close();
            this.$emit('submitted:form', response);
        },
        reset(): void {
            this.meetingDetails = {
                description: "",
                link: "",
                date: "",
                time: "",
                duration: 0
            } as UpdateMeetingInterface;
            this.valid = true;
        },
        getMenuInstance(): Vue & { save: (time: string) => void; } {
            return this.$refs.menu as Vue & { save: () => void };
        }
    }
});
</script>