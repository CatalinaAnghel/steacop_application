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
                <h2 class="primary--text text--darken-3">Set up a supervisory plan</h2>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="8">
                <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
                    <v-form v-model="valid" @submit.prevent="handleSubmit(updateSupervisoryPlan)">
                        <validation-provider rules="required" v-slot="{ errors }">
                            <v-select label="Supervisory plan" :items="plans" item-text="name" item-value="id" return-object
                                single-line :error-messages="errors" v-model="plan" required :disabled="disableDropdown"
                                color="primary"></v-select>
                        </validation-provider>
                        <validation-provider v-if="showInputs" rules="required|between:1,10" name="Number of assignments"
                            v-slot="{ errors }">
                            <v-text-field type="number" label="Number of assignments" hide-details="auto"
                                v-model="plan.numberOfAssignments" :error-messages="errors" class="mt-3"></v-text-field>
                        </validation-provider>
                        <validation-provider v-if="showInputs" rules="required|between:1,10" name="Number of meetings"
                            v-slot="{ errors }">
                            <v-text-field label="Number of guidance meetings" type="number" hide-details="auto"
                                v-model="plan.numberOfGuidanceMeetings" :error-messages="errors"
                                class="mt-3"></v-text-field>
                        </validation-provider>
                        <v-btn block color="secondary" type="submit" :disabled="invalid || disableButton"
                            large class="my-3 w-100" @click="toggleLoader">Update plan</v-btn>
                    </v-form>
                </validation-observer>
            </v-col>
        </v-row>
    </v-card>
</template>

<script lang="ts">
import { PlanInterface } from "@/store/plans/types";
import mixins from "vue-typed-mixins";
import FormMixin from '../mixins/FormMixin.vue';
import { storeService } from '@/store';

export default mixins(FormMixin).extend({
    data() {
        return {
            plan: {
                id: 0,
                numberOfAssignments: 0,
                numberOfGuidanceMeetings: 0
            },
            assignmentsNumber: 0,
            meetingsNumber: 0,
        }
    },
    computed: {
        plans() {
            return storeService.plans.getPlans();
        },
        showInputs(): boolean {
            return this.plan.id !== 0;
        },
        disableButton(): boolean {
            return this.plans.length == 0 || !this.showInputs;
        },
        disableDropdown(): boolean {
            return this.plans.length == 0;
        }
    },

    methods: {
        async updateSupervisoryPlan(): Promise<void> {
            const requestStatus = await storeService.plans.update({
                id: (this.plan as PlanInterface).id,
                numberOfAssignments: (this.plan as PlanInterface).numberOfAssignments as number,
                numberOfGuidanceMeetings: (this.plan as PlanInterface).numberOfGuidanceMeetings as number
            });

            this.handleResponse(requestStatus);
        },
    },
    created() {
        storeService.plans.load();
    }
});
</script>