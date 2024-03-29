<template>
    <div>
        <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
            @update:showAlert="updateShowAlert"></base-alert>

        <v-dialog v-if="projectDetails !== null" v-model="dialog" max-width="500px" @click:outside="close">
            <v-card :loading="loading ? 'secondary' : false">
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
                                        <validation-provider rules="required|min:16" v-slot="{ errors }" name="Title">
                                            <v-text-field v-model="projectDetails.title" label="Title" hide-details="auto"
                                                :error-messages="errors" class="mt-3" prepend-icon="mdi-text-short">
                                            </v-text-field>
                                        </validation-provider>
                                        <validation-provider rules="required|min:16" v-slot="{ errors }" name="Description">
                                            <v-textarea counter class="mt-3" clearable clear-icon="mdi-close-circle"
                                                label="Description" v-model="projectDetails.description" hide-details="auto"
                                                rows="4" :error-messages="errors"
                                                prepend-icon="mdi-text-short"></v-textarea>
                                        </validation-provider>
                                        <validation-provider rules="min:10" v-slot="{ errors }" name="Repository URL">
                                            <v-text-field v-model="projectDetails.repositoryUrl" label="Repository URL"
                                                hide-details="auto" :error-messages="errors" class="mt-3"
                                                prepend-icon="mdi-link">
                                            </v-text-field>
                                        </validation-provider>
                                        <v-btn :disabled="loading" block dark type="submit" large class="my-3"
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
import { ProjectDetailsInterface, UpdateProjectInterface } from "@/modules/project";
import ProjectService from "@/services/project-service";
import Vue from 'vue';

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
        project: {
            type: Object as () => ProjectDetailsInterface | null,
            required: false,
            default: null
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
            projectDetails: {
                title: "",
                description: "",
                repositoryUrl: ""
            } as UpdateProjectInterface,
            datePicker: false,
            timePicker: false,
        }
    },
    watch: {
        async open(val: boolean): Promise<void> {
            this.dialog = val;
            if (!val) {
                this.close();
            } else if (null !== this.project) {
                this.projectDetails.description = this.project.description;
                this.projectDetails.title = this.project.title;
                this.projectDetails.repositoryUrl = this.project.repositoryUrl;
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
        updateProject: async function () {
            this.toggleLoader();

            let response = {
                'success': true,
                'error': '',
                code: null as number | null
            };


            response = await ProjectService.update(this.project.id, this.projectDetails);


            this.handleResponse(response, "The project has been successfully updated", true);
            this.close();
            this.$emit('submitted:form', response);
        },
        reset(): void {
            this.projectDetails = {
                description: "",
                title: "",
                repositoryUrl: null
            } as UpdateProjectInterface;
            (this.$refs.observer as Vue & {reset:()=>void}).reset();
        }
    }
});
</script>