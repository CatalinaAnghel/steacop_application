<template>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card :loading="processing? 'secondary': false">
            <v-card-title>
                <span class="text-h5 primary--text  text--darken-3">{{ formTitle }}</span>
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
                                <v-form v-model="valid" ref="formDialog" @submit.prevent="handleSubmit(proposePlan)">
                                    <validation-provider rules="required|between:1,10" v-slot="{ errors }">
                                        <v-text-field v-model="numberOfGuidanceMeetings" label="Number of guidance meetings"
                                            hide-details="auto" type="number" :error-messages="errors" class="mt-3"
                                            :disabled="processing">
                                            <template v-if="suggested" v-slot:append>
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <v-icon v-on="on">
                                                            mdi-help-circle-outline
                                                        </v-icon>
                                                    </template>
                                                    {{ suggestionText }}
                                                </v-tooltip>
                                            </template>
                                        </v-text-field>
                                    </validation-provider>
                                    <validation-provider rules="required|between:1,10" v-slot="{ errors }">
                                        <v-text-field v-model="numberOfAssignments" label="Number of assignments"
                                            hide-details="auto" type="number" :error-messages="errors" class="mt-3"
                                            :disabled="processing">
                                            <template v-if="suggested" v-slot:append>
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <v-icon v-on="on">
                                                            mdi-help-circle-outline
                                                        </v-icon>
                                                    </template>
                                                    {{ suggestionText }}
                                                </v-tooltip>
                                            </template>
                                        </v-text-field>
                                    </validation-provider>
                                    <v-btn :disabled="processing" block dark type="submit" large
                                        class="my-3" color="secondary">Save</v-btn>
                                </v-form>
                            </validation-observer>

                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ValidationObserver, ValidationProvider } from "vee-validate";
import PlanService from '@/services/plan-service';
import { CustomSupervisoryPlanInterface } from '@/modules/supervisory-plan';

export default defineComponent({
    emits: [ 'submitted:form', 'close:dialog'],
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
        projectId: {
            type: Number,
            required: true
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
            numberOfAssignments: 0,
            numberOfGuidanceMeetings: 0,
            suggested: false,
            processing: false,
            suggestionText: 'Suggested by the system based on the student\'s and the teacher\'s profiles'
        }
    },
    watch: {
        async open(val: boolean): Promise<void> {
            this.dialog = val;
            if (!val) {
                this.close();
            } else {
                this.toggleProcessingState();
                const plan = await PlanService.getProjectPlan(this.projectId);
                if (plan !== null) {
                    this.numberOfAssignments = plan?.numberOfAssignments;
                    this.numberOfGuidanceMeetings = plan?.numberOfGuidanceMeetings;
                    this.suggested = plan?.suggested;
                }
                this.toggleProcessingState();
            }
        }
    },
    methods: {
        close() {
            this.dialog = false;
            this.$emit('close:dialog');
            this.reset();
        },
        proposePlan: async function () {
            this.toggleProcessingState();
            let payload = {
                numberOfAssignments: this.numberOfAssignments,
                numberOfGuidanceMeetings: this.numberOfGuidanceMeetings
            } as CustomSupervisoryPlanInterface;
            let response = {
                'success': true,
                'error': ''
            };
            if(this.suggested){
                response = await PlanService.createProjectPlan(this.projectId, payload);
            }else{
                response = await PlanService.updateProjectPlan(this.projectId, payload);
            }
            this.toggleProcessingState();
            this.close();
            this.$emit('submitted:form', response);
        },
        toggleProcessingState(): void {
            this.processing = !this.processing;
        },
        reset(): void{
            this.numberOfAssignments = 0;
            this.numberOfGuidanceMeetings = 0;
            this.suggested = false;
        }
    }
});
</script>
