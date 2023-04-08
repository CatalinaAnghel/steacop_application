<template>
    <div>
        <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
            @update:showAlert="updateShowAlert"></base-alert>

        <v-dialog v-model="dialog" max-width="500px">
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
                                <validation-observer ref="observer" v-slot="{ handleSubmit }">
                                    <v-form v-model="valid" ref="formDialog" @submit.prevent="handleSubmit(createMeeting)">
                                        <validation-provider rules="required" v-slot="{ errors }">
                                            <v-select label="Type" :items="meetingTypes" item-text="name" item-value="id"
                                                return-object single-line :error-messages="errors"
                                                v-model="meetingDetails.type" required color="primary"
                                                prepend-icon="mdi-cogs"></v-select>
                                        </validation-provider>
                                        <validation-provider rules="required|min:16" v-slot="{ errors }">
                                            <v-text-field v-model="meetingDetails.details" label="Description"
                                                hide-details="auto" :error-messages="errors" class="mt-3"
                                                prepend-icon="mdi-text-short">
                                            </v-text-field>
                                        </validation-provider>
                                        <validation-provider rules="required|min:10" v-slot="{ errors }">
                                            <v-text-field v-model="meetingDetails.link" label="Link" hide-details="auto"
                                                :error-messages="errors" class="mt-3" prepend-icon="mdi-link">
                                            </v-text-field>
                                        </validation-provider>
                                        <validation-provider rules="required" v-slot="{ errors }">
                                            <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40"
                                                transition="scale-transition" offset-y min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field v-model="meetingDetails.date" label="Scheduled at"
                                                        prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                                                        :error-messages="errors"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="meetingDetails.date"
                                                    @input="datePicker = false"></v-date-picker>
                                            </v-menu>
                                        </validation-provider>
                                        <validation-provider rules="required" v-slot="{ errors }">
                                            <v-menu ref="menu" v-model="timePicker" :close-on-content-click="false"
                                                :nudge-right="40" :return-value.sync="meetingDetails.time"
                                                transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field v-model="meetingDetails.time" label="Picker in menu"
                                                        prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs"
                                                        v-on="on" :error-messages="errors"></v-text-field>
                                                </template>
                                                <v-time-picker format="24hr" v-if="timePicker" v-model="meetingDetails.time" full-width
                                                    @click:minute="getMenuInstance().save(meetingDetails.time)"></v-time-picker>
                                            </v-menu>
                                        </validation-provider>
                                        <v-btn :disabled="processing" block dark type="submit" large class="my-3"
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
import mixins from 'vue-typed-mixins';
import FormMixin from '@/components/mixins/FormMixin.vue';
import Vue from 'vue';
import MeetingService from "@/services/meeting-service";
import { EventTypesDescriptions, EVENT_TYPE_GUIDANCE_MEETING, EVENT_TYPE_MILESTONE_MEETING } from "@/modules/calendar";
import { CreateMeetingPayloadInterface, MeetingTypeInterface } from "@/modules/meeting";
import { toISOLocale } from "@/services/helper-service";

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
            ] as MeetingTypeInterface[]
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
                link: this.meetingDetails.link,
                scheduledAt: toISOLocale(new Date(this.meetingDetails.date + ' ' + this.meetingDetails.time)),
                projectId: Number(this.$route.params.id)
            };
            let response = {
                'success': true,
                'error': ''
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
                type: {
                    id: "",
                    name: ""
                }
            };
        },
        getMenuInstance(): Vue & { save: (time: string) => void; } {
            return this.$refs.menu as Vue & { save: () => void };
        }
    }
});

</script>