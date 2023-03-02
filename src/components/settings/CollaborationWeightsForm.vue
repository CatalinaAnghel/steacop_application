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
                <h2>System weights</h2>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="8">
                <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
                    <v-form v-model="valid" @submit.prevent="handleSubmit(saveWeights)">
                        <v-subheader>Rating score</v-subheader>
                        <validation-provider rules="required|between:0,100" name="Weight for the supervisor's rating"
                            v-slot="{ errors }">
                            <v-text-field type="number" label="Percentage for the supervisor's rating" hide-details="auto"
                                v-model="supervisorRatingScore" :error-messages="errors" class="mt-3"></v-text-field>
                        </validation-provider>
                        <v-divider></v-divider>
                        <v-subheader>Support score</v-subheader>
                        <validation-provider rules="required|between:0,100" name="Support score weight" v-slot="{ errors }">
                            <v-text-field label="Support score weight" type="number" hide-details="auto"
                                v-model="collaborationScore.supportWeight" :error-messages="errors"
                                class="mt-3"></v-text-field>
                        </validation-provider>
                        <v-divider></v-divider>
                        <v-subheader>Structure score</v-subheader>
                        <validation-provider rules="required|between:0,100" name="Late assignment score penalty"
                            v-slot="{ errors }">
                            <v-text-field label="Late assignment score penalty" type="number" hide-details="auto"
                                v-model="assignmentPenalty" :error-messages="errors" class="mt-3"></v-text-field>
                        </validation-provider>
                        <validation-provider rules="required|between:0,100" name="Structure score weight"
                            v-slot="{ errors }">
                            <v-text-field label="Structure score weight" type="number" hide-details="auto"
                                v-model="collaborationScore.structureWeight" :error-messages="errors"
                                class="mt-3"></v-text-field>
                        </validation-provider>
                        <v-btn block color="teal accent-4 white--text" type="submit"
                            :disabled="invalid || invalidPercentages" large class="my-3 w-100" @click="toggleLoader">Update
                            plan</v-btn>
                    </v-form>
                </validation-observer>
            </v-col>
        </v-row>
    </v-card>
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
            assignmentPenalty: 0,
            supervisorRatingScore: 0
        }
    },
    computed: {
        invalidPercentages: function (): boolean {
            return Number(this.collaborationScore.supportWeight) + Number(this.collaborationScore.structureWeight) !== 100;
        }
    },
    methods: {
        saveWeights: async function (): Promise<void> {
            let params = {
                supportWeight: Number(this.collaborationScore.supportWeight),
                structureWeight: Number(this.collaborationScore.structureWeight),
                structurePenalty: Number(this.assignmentPenalty),
                ratingWeight: Number(this.supervisorRatingScore)
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
                    case 'RatingWeight':
                        this.supervisorRatingScore = Number(element.weight);
                        break;
                    case 'SupportWeight':
                        this.collaborationScore.supportWeight = Number(element.weight);
                        break;
                    case 'StructureWeight':
                        this.collaborationScore.structureWeight = Number(element.weight);
                        break;
                    default:
                        this.assignmentPenalty = Number(element.weight);
                }
            });
            this.toggleLoader();
        });

    }
});
</script>