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
                        <h2 class="primary--text text--darken-3">System weights</h2>
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col cols="8">
                        <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
                            <v-form v-model="valid" @submit.prevent="handleSubmit(saveWeights)">
                                <v-subheader>Collaboration score weights</v-subheader>
                                <validation-provider rules="required|between:0,100|valid_weight:@structureWeight"
                                    vid="supportWeight" name="Support score weight" v-slot="{ errors }">
                                    <v-text-field label="Support score weight" type="number" hide-details="auto"
                                        v-model="collaborationScore.supportWeight" :error-messages="errors"
                                        class="mt-3"></v-text-field>
                                </validation-provider>
                                <validation-provider vid="structureWeight"
                                    rules="required|between:0,100|valid_weight:@supportWeight" name="Structure score weight"
                                    v-slot="{ errors }">
                                    <v-text-field label="Structure score weight" type="number" hide-details="auto"
                                        v-model="collaborationScore.structureWeight" :error-messages="errors"
                                        class="mt-3"></v-text-field>
                                </validation-provider>
                                <v-text-field disabled type="number" label="Rating score weight" hide-details="auto"
                                    v-model="ratingScore" class="mt-3"></v-text-field>
                                <v-subheader>Other weights</v-subheader>
                                <validation-provider rules="required|between:0,100" name="Supervisor rating weight"
                                    v-slot="{ errors }">
                                    <v-text-field label="Supervisor rating weight" type="number" hide-details="auto"
                                        v-model="supervisorRatingWeight" :error-messages="errors"
                                        class="mt-3"></v-text-field>
                                </validation-provider>
                                <v-btn block color="secondary" type="submit" :disabled="invalid" large class="my-3 w-100"
                                    @click="toggleLoader">Update
                                    weights</v-btn>

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
import { weightNamespace } from "@/store/weights";
import { WeightInterface } from "@/store/weights/types";
import { storeService } from "@/store";

export default mixins(FormMixin).extend({
    data() {
        return {
            collaborationScore: {
                supportWeight: 0,
                structureWeight: 0
            },
            supervisorRatingWeight: 0
        }
    },
    computed: {
        ratingScore: function (): number {
            return Math.max(0, 100 - this.collaborationScore.structureWeight - this.collaborationScore.supportWeight);
        }
    },
    methods: {
        saveWeights: async function (): Promise<void> {
            let params = {
                supportWeight: Number(this.collaborationScore.supportWeight),
                structureWeight: Number(this.collaborationScore.structureWeight),
                supervisorRatingWeight: Number(this.supervisorRatingWeight)
            };
            const requestStatus = await this.$store.dispatch(weightNamespace + '/update', params);
            this.handleResponse(requestStatus);
        }
    },
    created() {
        this.toggleLoader();
        storeService.weights.load().then(() => {
            let weights = storeService.weights.getWeights();
            weights.forEach((element: WeightInterface) => {
                switch (element.name) {
                    case 'SupervisorRatingWeight':
                        this.supervisorRatingWeight = Number(element.weight);
                        break;
                    case 'SupportWeight':
                        this.collaborationScore.supportWeight = Number(element.weight);
                        break;
                    case 'StructureWeight':
                        this.collaborationScore.structureWeight = Number(element.weight);
                        break;
                    default:

                }
            });
            this.toggleLoader();
        });

    }
});
</script>