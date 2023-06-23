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
                                <validation-observer ref="observer" v-slot="{ handleSubmit }">
                                    <v-form v-model="valid" ref="formDialog"
                                        @submit.prevent="handleSubmit(createAssignment)">
                                        <validation-provider rules="required|min:16" v-slot="{ errors }" name="Title">
                                            <v-text-field class="mt-2" v-model="assignmentDetails.title" label="Title"
                                                hide-details="auto" :error-messages="errors" prepend-icon="mdi-text-short">
                                            </v-text-field>
                                        </validation-provider>
                                        <validation-provider rules="required|min:16" v-slot="{ errors }" name="Description">
                                            <v-textarea counter class="mt-2" clearable clear-icon="mdi-close-circle"
                                                label="Description" v-model="assignmentDetails.description"
                                                hide-details="auto" rows="2" :error-messages="errors"
                                                prepend-icon="mdi-text-short"></v-textarea>
                                        </validation-provider>
                                        <validation-provider rules="required" v-slot="{ errors }" name="Due date">
                                            <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40"
                                                transition="scale-transition" offset-y min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field class="mt-2" hide-details
                                                        v-model="assignmentDetails.dueDate" label="Due date"
                                                        prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                                                        :error-messages="errors"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="assignmentDetails.dueDate" :min="startingDate"
                                                    @input="datePicker = false"
                                                    color="primary"></v-date-picker>
                                            </v-menu>
                                        </validation-provider>
                                        <validation-provider rules="required" v-slot="{ errors }" name="Time">
                                            <v-menu ref="menu" v-model="timePicker" :close-on-content-click="false"
                                                :nudge-right="40" :return-value.sync="assignmentDetails.dueTime"
                                                transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field class="mt-2" hide-details
                                                        v-model="assignmentDetails.dueTime" label="Due time"
                                                        prepend-icon="mdi-calendar-clock" readonly v-bind="attrs" v-on="on"
                                                        :error-messages="errors"></v-text-field>
                                                </template>
                                                <v-time-picker v-if="timePicker"
                                                    v-model="assignmentDetails.dueTime" full-width color="primary"
                                                    @click:minute="getMenuInstance().save(assignmentDetails.dueTime)"></v-time-picker>
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
import { toISOLocale } from "@/services/helper-service";
import { AssignmentPayloadInterface } from "@/modules/assignment";
import AssignmentService from "@/services/assignment-service";
import { ResponseDto } from "@/modules/common";

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
            assignmentDetails: {
                title: "",
                description: "",
                dueDate: "",
                dueTime: ""
            },
            datePicker: false,
            timePicker: false
        }
    },
    computed: {
        startingDate: function (): string {
            let startDate = new Date();
            startDate.setDate(startDate.getDate() + 1);
            return startDate.toISOString().slice(0, 10);
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
        createAssignment: async function (): Promise<void> {
            this.toggleProcessingState();
            let payload = {
                description: this.assignmentDetails.description,
                title: this.assignmentDetails.title,
                dueDate: toISOLocale(new Date(this.assignmentDetails.dueDate + ' ' + this.assignmentDetails.dueTime)),
                projectId: Number(this.$route.params.id)
            };
            let response = {
                'success': true,
                'error': '',
                code: null as number | null
            };
            response = await AssignmentService.createAssignment(payload as AssignmentPayloadInterface);
            this.handleResponse(response);
            this.toggleProcessingState();
            this.close();
            this.$emit('submitted:form', response as ResponseDto);
        },
        toggleProcessingState(): void {
            this.processing = !this.processing;
        },
        reset(): void {
            this.assignmentDetails = {
                title: "",
                description: "",
                dueDate: "",
                dueTime: ""
            };
            (this.$refs.observer as Vue & {reset:()=>void}).reset();
        },
        getMenuInstance(): Vue & { save: (time: string) => void; } {
            return this.$refs.menu as Vue & { save: () => void };
        }
    }
});

</script>