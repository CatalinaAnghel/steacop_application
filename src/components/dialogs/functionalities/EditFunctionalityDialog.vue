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

                                        <validation-provider v-if="!closedFunctionality" rules="required|min:16"
                                            v-slot="{ errors }" name="Title">
                                            <v-text-field class="mt-2" v-model="functionality.title" label="Title"
                                                hide-details="auto" :error-messages="errors" prepend-icon="mdi-text-short">
                                            </v-text-field>
                                        </validation-provider>
                                        <v-select v-if="statuses.length" hide-details label="Current status"
                                            :items="statuses" item-text="name" item-value="id" return-object single-line
                                            v-model="functionality.status" required
                                            :rules="statuses.length ? requiredRule : null" color="primary"
                                            prepend-icon="mdi-cogs"></v-select>
                                        <validation-provider v-if="!closedFunctionality" rules="required"
                                            v-slot="{ errors }" name="Due date">
                                            <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40"
                                                transition="scale-transition" offset-y min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field class="mt-2" hide-details v-model="functionality.dueDate"
                                                        label="Due date" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                                                        v-on="on" :error-messages="errors"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="functionality.dueDate" :min="startingDate"
                                                    @input="datePicker = false" color="primary"></v-date-picker>
                                            </v-menu>
                                        </validation-provider>
                                        <validation-provider v-if="!closedFunctionality" rules="required|min:16"
                                            v-slot="{ errors }" name="Description">
                                            <v-textarea counter class="mt-2" clearable clear-icon="mdi-close-circle"
                                                label="Description" v-model="functionality.description" hide-details="auto"
                                                rows="2" :error-messages="errors"
                                                prepend-icon="mdi-text-short"></v-textarea>
                                        </validation-provider>
                                        <v-btn :disabled="disabled" block :dark="!disabled" type="submit" large class="my-3"
                                            color="secondary">Update</v-btn>
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
import { storeService } from "@/store";
import { FunctionalityInterface, StatusInterface, UpdateFunctionalityPayloadInterface } from "@/store/functionalities/types";
import { EVENT_BUS_REFRESH_COMPONENT } from "@/common/constants";
import { eventBus } from "@/main";

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
        functionalityDetails: {
            type: Object as () => FunctionalityInterface,
            required: true
        },
        statuses: {
            type: Array as () => StatusInterface[],
            required: true
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
            functionality: {
                title: "",
                description: "",
                dueDate: "",
                status: null as StatusInterface | null
            },
            datePicker: false,
            requiredRule: [
                (value: { id: string; name: string }) => value !== null && value.id !== "" || 'The meeting type is required'
            ],

        }
    },
    computed: {
        startingDate: function (): string {
            let startDate = new Date();
            startDate.setDate(startDate.getDate() + 1);
            return startDate.toISOString().slice(0, 10);
        },
        disabled: function (): boolean {
            return this.loading;
        },
        closedFunctionality: function (): boolean {
            return this.functionalityDetails.status.name === "Done";
        }
    },
    watch: {
        async open(val: boolean): Promise<void> {
            this.dialog = val;
            if (!val) {
                this.close();
            } else {
                this.functionality.title = this.functionalityDetails.title;
                this.functionality.description = this.functionalityDetails.description;
                if (typeof this.functionalityDetails.dueDate !== 'undefined') {
                    this.functionality.dueDate = this.functionalityDetails.dueDate.slice(0, 10);
                }
                this.functionality.status = this.functionalityDetails.status;
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
                id: this.functionalityDetails.id,
                description: this.functionality.description,
                title: this.functionality.title,
                status: this.functionality.status.id
            };

            if (this.functionality.dueDate !== null && this.functionality.dueDate !== '') {
                const tempParams = {
                    dueDate: toISOLocale(new Date(this.functionality.dueDate)),
                }
                payload = { ...payload, ...tempParams };
            }
            let response = {
                success: true,
                error: '',
                code: null as number | null
            };
            response = await storeService.functionalities.update(payload as UpdateFunctionalityPayloadInterface);

            this.handleResponse(response, "The functionality has been successfully updated", true);
            this.close();
            eventBus.$emit(EVENT_BUS_REFRESH_COMPONENT);
        },
        reset(): void {
            this.functionality = {
                title: "",
                description: "",
                dueDate: "",
                status: null
            };
        },
        getMenuInstance(): Vue & { save: (time: string) => void; } {
            return this.$refs.menu as Vue & { save: () => void };
        },
    }
});

</script>