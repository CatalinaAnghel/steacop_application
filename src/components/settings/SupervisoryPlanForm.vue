/* eslint-disable @typescript-eslint/no-explicit-any */
<template>
    <v-card elevation="3" :loading="loading">
        <v-row justify="center" class="pt-3">
            <v-col cols="10">
                <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
                    @update:showAlert="updateShowAlert"></base-alert>
            </v-col>
        </v-row>
        <v-row justify="center" class="pt-3">
            <v-col cols="auto">
                <h2>Set up a supervisory plan</h2>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="8">
                <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
                    <v-form v-model="valid" @submit.prevent="handleSubmit(updateSupervisoryPlan)">
                        <validation-provider rules="required" v-slot="{ errors }">
                            <v-select label="Supervisory plan" :items="plans" item-text="name" item-value="id"
                                return-object single-line :error-messages="errors" v-model="plan"></v-select>
                        </validation-provider>
                        <validation-provider v-if="plan.id !== 0" rules="required|between:1,10" name="Number of assignments" v-slot="{ errors }">
                            <v-text-field type="number" label="Number of assignments" hide-details="auto"
                                v-model="plan.numberOfAssignments" :error-messages="errors" class="mt-3"></v-text-field>
                        </validation-provider>
                        <validation-provider v-if="plan.id !== 0" rules="required|min_value:1|max_value:10"  name="Number of meetings" v-slot="{ errors }">
                            <v-text-field label="Number of guidance meetings" type="number" hide-details="auto"
                                v-model="plan.numberOfGuidanceMeetings" :error-messages="errors" class="mt-3"></v-text-field>
                        </validation-provider>
                        <v-btn block color="teal" :dark="!invalid" type="submit" :disabled="invalid" large
                            class="my-3 w-100" @click="toggleLoader">Update plan</v-btn>
                    </v-form>
                </validation-observer>
            </v-col>
        </v-row>
    </v-card>
</template>

<script lang="ts">
require('@/validation/index');
import BaseAlert from "../alerts/BaseAlert.vue";
import { defineComponent } from "vue";
import { planNamespace } from '@/store/plans';
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { PlanInterface } from "@/store/plans/types";
import { ERROR_SERVER } from '@/common/errors';
import { SUCCESS_UPDATE_MESSAGE } from '@/common/constants'


export default defineComponent({
    data() {
        return {
            loading: false,
            valid: false,
            showAlert: false,
            color: '',
            plan: {
                id: 0,
                numberOfAssignments: 0,
                numberOfGuidanceMeetings: 0
            },
            assignmentsNumber: 0,
            meetingsNumber: 0,
            alertMessage: ''
        }
    },
    computed: {
        plans: function () {
            return this.$store.getters[planNamespace + '/plans'];
        },
    },
    components: {
        ValidationProvider,
        ValidationObserver,
        BaseAlert
    },
    methods: {
        async updateSupervisoryPlan(): Promise<void> {
            const requestStatus = await this.$store.dispatch(planNamespace + '/update', {
                id: (this.plan! as PlanInterface).id,
                numberOfAssignments: (this.plan! as PlanInterface).numberOfAssignments as number,
                numberOfGuidanceMeetings: (this.plan! as PlanInterface).numberOfGuidanceMeetings as number
            });
            this.showAlert = true;
            if (requestStatus.success) {
                this.color = 'teal';
                this.alertMessage = SUCCESS_UPDATE_MESSAGE;
            } else {
                this.color = 'red';
                this.alertMessage = ERROR_SERVER;
            }
            this.toggleLoader();
        },
        toggleLoader(): void {
            this.loading = !this.loading;
        },
        updateShowAlert(value: boolean): void {
            this.showAlert = value;
        }
    },
    created() {
        this.$store.dispatch(planNamespace + '/loadSupervisoryPlans');
    }
});
</script>