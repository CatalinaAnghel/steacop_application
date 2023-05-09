<template>
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <v-form v-model="valid" ref="formDialog" @submit.prevent="handleSubmit(gradeAssignment)">
            <v-row>
                <v-col cols="8">
                    <validation-provider rules="required|between:1,10" v-slot="{ errors }" name="Grade">
                        <v-text-field type="number" min="1" max="10" step="0.5" v-model="grade" suffix="/10"
                            :error-messages="errors"></v-text-field>
                    </validation-provider>
                </v-col>
                <v-col cols="4" class="mt-2 px-0">
                    <v-btn :disabled="processing || !valid" icon type="submit" small class="my-3"
                        @click="toggleLoader"><v-icon>mdi-check</v-icon></v-btn>
                </v-col>
            </v-row>
        </v-form>
    </validation-observer>
</template>

<script lang="ts">
import AssignmentService from "@/services/assignment-service";
import mixins from "vue-typed-mixins";
import FormMixin from '@/components/mixins/FormMixin.vue';

export default mixins(FormMixin).extend({
    props: {
        currentGrade: {
            type: Number,
            required: false,
            default: 0
        }
    },
    data: function () {
        return {
            selectedFiles: [],
            valid: false,
            processing: false,
            grade: 0
        }
    },
    methods: {
        toggleLoader: function (): void {
            this.$emit('toggled:loader');
        },
        gradeAssignment: async function (): Promise<void> {
            this.processing = true;
            await AssignmentService.gradeAssignment(Number(this.$route.params.id), this.grade);
            this.processing = false;
            this.toggleLoader();
        }
    },
    created: function (): void {
        this.grade = this.currentGrade;
    }
})
</script>