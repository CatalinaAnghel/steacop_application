<template>
    <div>
        <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
            @update:showAlert="updateShowAlert"></base-alert>

        <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
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
                                    <v-form v-model="valid" ref="formDialog"
                                        @submit.prevent="handleSubmit(createFunctionality)">
                                        <v-select v-if="types.length" hide-details label="Issue type" :items="types"
                                            item-text="name" item-value="id" return-object single-line
                                            v-model="functionalityDetails.type" required
                                            :rules="types.length ? requiredRule : null" color="primary"
                                            prepend-icon="mdi-cogs" @change="showPossibleParentIssueTypes"></v-select>
                                        <v-select v-if="possibleParentIssueTypes.length" hide-details
                                            label="Parent issue type" :items="possibleParentIssueTypes" item-text="name"
                                            item-value="id" return-object single-line
                                            v-model="functionalityDetails.parentType" required
                                            :rules="possibleParentIssueTypes.length ? requiredRule : null" color="primary"
                                            prepend-icon="mdi-cogs" @change="showPossibleParents"></v-select>
                                        <v-select v-if="possibleParentIssues.length" hide-details label="Parent issue"
                                            :items="possibleParentIssues" item-text="title" item-value="id" return-object
                                            single-line v-model="functionalityDetails.parentFunctionality" required
                                            :rules="possibleParentIssues.length ? requiredRule : null" color="primary"
                                            prepend-icon="mdi-clipboard-outline"></v-select>
                                        <validation-provider rules="required" v-slot="{ errors }" name="Due date">
                                            <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40"
                                                transition="scale-transition" offset-y min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field class="mt-2" hide-details
                                                        v-model="functionalityDetails.dueDate" label="Due date"
                                                        prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                                                        :error-messages="errors"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="functionalityDetails.dueDate" :min="startingDate"
                                                    @input="datePicker = false" color="primary"></v-date-picker>
                                            </v-menu>
                                        </validation-provider>
                                        <validation-provider rules="required|min:16" v-slot="{ errors }" name="Title">
                                            <v-text-field class="mt-2" v-model="functionalityDetails.title" label="Title"
                                                hide-details="auto" :error-messages="errors" prepend-icon="mdi-text-short">
                                            </v-text-field>
                                        </validation-provider>
                                        <validation-provider :rules="{ mimes: ['application/pdf', 'image/png', 'image/jpg'] }"
                                            v-slot="{ errors }" name="Attachments">
                                            <v-file-input multiple v-model="functionalityDetails.selectedFiles" counter
                                                :error-messages="errors"></v-file-input>
                                        </validation-provider>
                                        <validation-provider rules="required|min:16" v-slot="{ errors }" name="Description">
                                            <v-textarea counter class="mt-2" clearable clear-icon="mdi-close-circle"
                                                label="Description" v-model="functionalityDetails.description"
                                                hide-details="auto" rows="2" :error-messages="errors"
                                                prepend-icon="mdi-text-short"></v-textarea>
                                        </validation-provider>
                                        <v-btn :disabled="disabled" block :dark="!disabled" type="submit" large class="my-3"
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
import { ResponseDto } from "@/modules/common";
import { storeService } from "@/store";
import { CreateFunctionalityPayloadInterface, FunctionalityInterface, TypeInterface } from "@/store/functionalities/types";

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
        types: {
            type: Array as () => TypeInterface[],
            required: true,
            default: []
        }
    },
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data() {
        return {
            dialog: false,
            valid: false,
            loading: false,
            functionalityDetails: {
                selectedFiles: [],
                title: "",
                description: "",
                dueDate: null as string | null,
                type: null as TypeInterface | null,
                parentType: null as TypeInterface | null,
                parentFunctionality: null as FunctionalityInterface | null
            },
            datePicker: false,
            requiredRule: [
                (value: { id: string; name: string }) => value !== null && value.id !== "" || 'The meeting type is required'
            ],
            possibleParentIssueTypes: [],
            possibleParentIssues: []
        }
    },
    computed: {
        startingDate: function (): string {
            let startDate = new Date();
            startDate.setDate(startDate.getDate() + 1);
            return startDate.toISOString().slice(0, 10);
        },
        disabled: function (): boolean {
            return this.loading || (this.functionalityDetails.parentType !== null && this.functionalityDetails.parentFunctionality === null);
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
        createFunctionality: async function (): Promise<void> {
            this.toggleLoader();
            let payload = {
                description: this.functionalityDetails.description,
                title: this.functionalityDetails.title,
                projectId: Number(this.$route.params.id),
                type: this.functionalityDetails.type.id
            };
            if (this.functionalityDetails.parentFunctionality !== null) {
                const tempParams = {
                    parentFunctionalityId: this.functionalityDetails.parentFunctionality.id,
                }
                payload = { ...payload, ...tempParams };
            }

            if (this.functionalityDetails.dueDate !== null) {
                const tempParams = {
                    dueDate: toISOLocale(new Date(this.functionalityDetails.dueDate)),
                }
                payload = { ...payload, ...tempParams };
            }
            const response = {
                success: true,
                error: '',
                data: '',
                code: null as number | null
            };
            const addedFunctionality: FunctionalityInterface | null = await storeService.functionalities.createFunctionality(payload as CreateFunctionalityPayloadInterface);
            if (null !== addedFunctionality) {
                this.functionalityDetails.selectedFiles.forEach(file => {
                    let formData = new FormData();
                    formData.append('file', file, (file as File).name);
                    formData.append('functionalityId', addedFunctionality.id.toString());
                    storeService.functionalities.uploadAttachment(formData);
                });
            }

            this.handleResponse(response, 'The functionality has been successfully created', true);
            this.close();
            this.$emit('submitted:form', response as ResponseDto);
        },
        reset(): void {
            this.functionalityDetails = {
                selectedFiles: [],
                title: "",
                description: "",
                dueDate: "",
                type: null,
                parentType: null,
                parentFunctionality: null
            };
        },
        getMenuInstance(): Vue & { save: (time: string) => void; } {
            return this.$refs.menu as Vue & { save: () => void };
        },
        showPossibleParentIssueTypes: function (): void {
            this.possibleParentIssueTypes = [];
            this.possibleParentIssues = [];
            this.functionalityDetails.parentFunctionality = null;
            this.functionalityDetails.parentType = null;
            if (this.functionalityDetails.type !== null) {
                this.types.forEach((type) => {
                    if (type.possibleChildTypes.includes(this.functionalityDetails.type.id)) {
                        this.possibleParentIssueTypes.push(type);
                    }
                });
            }
        },
        showPossibleParents: function (): void {
            this.possibleParentIssues = [];
            this.functionalityDetails.parentFunctionality = null;
            this.possibleParentIssues = storeService.functionalities.getParentFunctionalities(this.functionalityDetails.parentType);
        }
    }
});

</script>