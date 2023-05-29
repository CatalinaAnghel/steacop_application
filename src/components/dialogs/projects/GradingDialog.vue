<template>
    <div>
        <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
            @update:showAlert="updateShowAlert"></base-alert>

        <v-dialog v-if="projectId > 0" v-model="dialog" max-width="500px" @click:outside="close">
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
                                    <v-form v-model="valid" ref="formDialog" @submit.prevent="handleSubmit(updateProject)">
                                        <validation-provider rules="between:1,10" v-slot="{ errors }" name="Grade">
                                            <v-text-field v-model="grade" label="Grade" hide-details="auto"
                                                :error-messages="errors" class="mt-3" type="number"
                                                prepend-icon="mdi-clipboard-check">
                                            </v-text-field>
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
import ProjectService from "@/services/project-service";
import { ProjectDetailsInterface } from "@/modules/project";

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
            processing: false,
            grade: null as number | null,
            project: null as ProjectDetailsInterface | null
        }
    },
    watch: {
        async open(val: boolean): Promise<void> {
            this.dialog = val;
            if (!val) {
                this.close();
            } else {
                this.processing = true;
                this.project = await ProjectService.getProjectInfo(this.projectId);
                this.grade = this.project.grade;
                this.$emit('open:dialog');
                this.processing = false;
            }
        }
    },
    methods: {
        close() {
            this.dialog = false;
            this.$emit('close:dialog');
            this.reset();
        },
        updateProject: async function () {
            this.toggleProcessingState();
            let response = {
                'success': true,
                'error': '',
                'code': null as number | null
            };

            response = await ProjectService.grade(this.projectId, Number(this.grade));

            this.handleResponse(response);
            this.toggleProcessingState();
            this.close();
            this.$emit('submitted:form', response);
        },
        toggleProcessingState(): void {
            this.processing = !this.processing;
        },
        reset(): void {
            this.grade = null;
        },
        getMenuInstance(): Vue & { save: (time: string) => void; } {
            return this.$refs.menu as Vue & { save: () => void };
        }
    }
});
</script>