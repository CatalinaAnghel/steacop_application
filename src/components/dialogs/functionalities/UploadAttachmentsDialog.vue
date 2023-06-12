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
                                    <v-form v-model="valid" ref="formDialog" @submit.prevent="handleSubmit(attachFiles)">
                                        <validation-provider
                                            :rules="{ mimes: ['application/pdf', 'image/png', 'image/jpg'] }"
                                            v-slot="{ errors }" name="Attachments">
                                            <v-file-input multiple v-model="selectedFiles" counter
                                                :error-messages="errors"></v-file-input>
                                        </validation-provider>
                                        <v-btn :disabled="disabled" block :dark="!disabled" type="submit" large class="my-3"
                                            color="secondary">Attach file(s)</v-btn>
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
import { ResponseDto } from "@/modules/common";
import { storeService } from "@/store";
import { FunctionalityInterface } from "@/store/functionalities/types";

export default mixins(FormMixin).extend({
    props: {
        formTitle: {
            type: String,
            required: false,
            default: 'Attach file(s)'
        },
        open: {
            type: Boolean,
            required: false,
            default: false
        },
        functionalityDetails: {
            type: Object as () => FunctionalityInterface,
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
            selectedFiles: [],
            datePicker: false,
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
        attachFiles: async function (): Promise<void> {
            this.toggleLoader();
            let response = {
                success: true,
                error: '',
                code: null as number | null
            };
            let promises = [] as Array<Promise<ResponseDto>>;
            this.selectedFiles.forEach(file => {
                let formData = new FormData();
                formData.append('file', file, (file as File).name);
                formData.append('functionalityId', this.functionalityDetails.id.toString());
                promises.push(storeService.functionalities.uploadAttachment(formData));
            });

            Promise.all(promises).then(() => {
                this.handleResponse(response, 'The attachments have been successfully uploaded', true);
                this.close();
                this.$emit('submitted:form', response as ResponseDto);
            })

        },
        reset(): void {
            this.selectedFiles = [];
            (this.$refs.observer as Vue & {reset:()=>void}).reset();
        },
        getMenuInstance(): Vue & { save: (time: string) => void; } {
            return this.$refs.menu as Vue & { save: () => void };
        },
    }
});

</script>