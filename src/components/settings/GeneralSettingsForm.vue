<template>
    <v-row justify="center" class="py-16">
        <v-col cols="10" sm="10" md="12" lg="6" xl="6">
            <v-card elevation="3" :loading="loading">
                <v-row justify="center" class="pt-3">
                    <v-col cols="10">
                        <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
                            @update:showAlert="updateShowAlert"></base-alert>
                    </v-col>
                </v-row>
                <v-row justify="center" class="pt-3">
                    <v-col cols="auto">
                        <h2 class="primary--text text--darken-3">General settings</h2>
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col cols="8">
                        <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
                            <v-form v-model="valid" @submit.prevent="handleSubmit(saveWeights)">
                                <validation-provider rules="required|between:1,10" name="Number of milestone meetings"
                                    v-slot="{ errors }">
                                    <v-text-field label="Number of milestone meetings" type="number" hide-details="auto"
                                        v-model="milestoneMeetingsNumber" :error-messages="errors"
                                        class="mt-3"></v-text-field>
                                </validation-provider>
                                <validation-provider rules="required|between:0,100" name="Late assignment score penalty"
                                    v-slot="{ errors }">
                                    <v-text-field label="Late assignment score penalty" type="number" hide-details="auto"
                                        v-model="assignmentPenalty" :error-messages="errors" class="mt-3"></v-text-field>
                                </validation-provider>
                                <v-btn block color="secondary" type="submit" :disabled="invalid" large class="my-3 w-100"
                                    @click="toggleLoader">Update settings</v-btn>
                            </v-form>
                        </validation-observer>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>
<script lang="ts">
import mixins from "vue-typed-mixins";
import FormMixin from '../mixins/FormMixin.vue';
import SystemSettingService from "@/services/system-setting-service";
import { SystemSettingInterface, SystemSettingPayloadInterface } from "@/modules/setting";

export default mixins(FormMixin).extend({
    data() {
        return {
            assignmentPenalty: 0,
            milestoneMeetingsNumber: 0
        }
    },
    methods: {
        saveWeights: async function (): Promise<void> {
            let params = {
                milestoneMeetingsLimit: Number(this.milestoneMeetingsNumber),
                assignmentsPenalization: Number(this.assignmentPenalty)
            } as SystemSettingPayloadInterface;
            const requestStatus = await SystemSettingService.updateSettings(params)
            this.handleResponse(requestStatus);
        }
    },
    created: async function() {
        this.toggleLoader();
        const settingsCollection = await SystemSettingService.getSettings();
        settingsCollection.forEach((element: SystemSettingInterface) => {
            switch (element.name) {
                case 'MilestoneMeetingsLimit':
                    this.milestoneMeetingsNumber = Number(element.value);
                    break;
                case 'AssignmentPenalization':
                    this.assignmentPenalty = Number(element.value);
                    break;
                default:

            }
        });
        this.toggleLoader();
    }
});
</script>