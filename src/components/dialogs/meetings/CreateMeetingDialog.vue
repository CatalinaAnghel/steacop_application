<template>
    <div>
        <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
            @update:showAlert="updateShowAlert"></base-alert>

        <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
            <v-card :loading="processing ? 'secondary' : false">
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
                                <p class="red--text accent-2--text text-center" v-if="disabled">Too many milestone meetings have been scheduled</p>
                                <validation-observer ref="observer" v-slot="{ handleSubmit }">
                                    <v-form v-model="valid" ref="formDialog" @submit.prevent="handleSubmit(createMeeting)">
                                        <v-select hide-details label="Type" :items="meetingTypes" item-text="name"
                                            item-value="id" return-object single-line v-model="meetingDetails.type" required
                                            :rules="requiredRule" color="primary" prepend-icon="mdi-cogs"
                                            @change="validate"></v-select>
                                        <validation-provider rules="required|min:16" v-slot="{ errors }" name="Description">
                                            <v-text-field class="mt-2" v-model="meetingDetails.details" label="Description"
                                                hide-details="auto" :error-messages="errors" prepend-icon="mdi-text-short">
                                            </v-text-field>
                                        </validation-provider>
                                        <validation-provider :rules="{ required: true, regex: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/ }" v-slot="{ errors }" name="Link">
                                            <v-text-field class="mt-2" v-model="meetingDetails.link" label="Link"
                                                hide-details="auto" :error-messages="errors" prepend-icon="mdi-link">
                                            </v-text-field>
                                        </validation-provider>
                                        <validation-provider rules="required" v-slot="{ errors }" name="Scheduling date">
                                            <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40"
                                                transition="scale-transition" offset-y min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field class="mt-2" hide-details v-model="meetingDetails.date"
                                                        label="Scheduling date" prepend-icon="mdi-calendar" readonly
                                                        v-bind="attrs" v-on="on" :error-messages="errors"></v-text-field>
                                                </template>
                                                <v-date-picker :min="startingDate" v-model="meetingDetails.date"
                                                    @input="datePicker = false"
                                                    color="primary"></v-date-picker>
                                            </v-menu>
                                        </validation-provider>
                                        <validation-provider rules="required" v-slot="{ errors }" name="Scheduling time">
                                            <v-menu ref="menu" v-model="timePicker" :close-on-content-click="false"
                                                :nudge-right="40" :return-value.sync="meetingDetails.time"
                                                transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field class="mt-2" hide-details v-model="meetingDetails.time"
                                                        label="Scheduling time" prepend-icon="mdi-calendar-clock" readonly
                                                        v-bind="attrs" v-on="on" :error-messages="errors"></v-text-field>
                                                </template>
                                                <v-time-picker format="24hr" v-if="timePicker" v-model="meetingDetails.time"
                                                    full-width
                                                    @click:minute="getMenuInstance().save(meetingDetails.time)"></v-time-picker>
                                            </v-menu>
                                        </validation-provider>
                                        <v-slider class="mt-3" prepend-icon="mdi-clock-time-four-outline"
                                            v-model="meetingDetails.duration" color="primary" label="Duration"
                                            hint="Provide the duration (number of hours)" min="0.5" step="0.5" max="4"
                                            thumb-label></v-slider>
                                        <v-btn :disabled="processing || disabled" block :dark="!processing && !disabled"
                                            type="submit" large class="my-3" color="secondary">Save</v-btn>
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
import mixins from 'vue-typed-mixins';
import FormMixin from '@/components/mixins/FormMixin.vue';
import Vue from 'vue';
import MeetingService from "@/services/meeting-service";
import { EventTypesDescriptions, EVENT_TYPE_GUIDANCE_MEETING, EVENT_TYPE_MILESTONE_MEETING } from "@/modules/calendar";
import { CreateMeetingPayloadInterface, MeetingTypeInterface } from "@/modules/meeting";
import { toISOLocale } from "@/services/helper-service";
import SystemSettingService from "@/services/system-setting-service";

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
        existingMilestoneMeetings: {
            type: Number,
            required: false,
            default: 0
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
            processing: false,
            meetingDetails: {
                details: "",
                link: "",
                date: "",
                time: "",
                duration: 0,
                type: {
                    id: "",
                    name: ""
                } as MeetingTypeInterface
            },
            datePicker: false,
            timePicker: false,
            meetingTypes: [
                {
                    id: EVENT_TYPE_GUIDANCE_MEETING,
                    name: EventTypesDescriptions.EVENT_TYPE_GUIDANCE_MEETING
                },
                {
                    id: EVENT_TYPE_MILESTONE_MEETING,
                    name: EventTypesDescriptions.EVENT_TYPE_MILESTONE_MEETING
                }
            ] as MeetingTypeInterface[],
            requiredRule: [
                (value: { id: string; name: string }) => value.id !== "" || 'The meeting type is required'
            ],
            milestoneMeetingsLimit: 0,
            disabled: false
        }
    },
    watch: {
        async open(val: boolean): Promise<void> {
            this.dialog = val;
            if (!val) {
                this.close();
            } else {
                this.$emit('open:dialog');
            }
        }
    },
    computed: {
        startingDate: function (): string {
            let startDate = new Date();
            startDate.setDate(startDate.getDate() + 1);
            return startDate.toISOString().slice(0, 10);
        }
    },
    methods: {
        close() {
            this.dialog = false;
            this.$emit('close:dialog');
            this.reset();
        },
        createMeeting: async function (): Promise<void> {

            this.toggleProcessingState();
            let payload = {
                description: this.meetingDetails.details,
                duration: this.meetingDetails.duration,
                link: this.meetingDetails.link,
                scheduledAt: toISOLocale(new Date(this.meetingDetails.date + ' ' + this.meetingDetails.time)),
                projectId: Number(this.$route.params.id)
            };
            let response = {
                'success': true,
                'error': '',
                code: null as number | null
            };
            response = await MeetingService.createMeeting(payload as CreateMeetingPayloadInterface, this.meetingDetails.type.id);
            this.handleResponse(response);
            this.toggleProcessingState();
            this.close();
            this.$emit('submitted:form', response);
        },
        toggleProcessingState(): void {
            this.processing = !this.processing;
        },
        reset(): void {
            this.meetingDetails = {
                details: "",
                link: "",
                date: "",
                time: "",
                duration: 0,
                type: {
                    id: "",
                    name: ""
                }
            };
        },
        getMenuInstance(): Vue & { save: (time: string) => void; } {
            return this.$refs.menu as Vue & { save: () => void };
        },
        validate(): void {
            this.disabled = this.existingMilestoneMeetings >= this.milestoneMeetingsLimit &&
                this.meetingDetails.type.id === EVENT_TYPE_MILESTONE_MEETING;
        }
    },
    created: async function (): Promise<void> {
        const settings = await SystemSettingService.getSettings('MilestoneMeetingsLimit');
        if (settings.length) {
            this.milestoneMeetingsLimit = settings[0].value;
        }
    }
});

</script>