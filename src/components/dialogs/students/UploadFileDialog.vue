<template>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5 primary--text  text--darken-3">{{ formTitle }}</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="close()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col col="12" sm="12" md="12">
                            <v-form @submit.prevent="submit" v-model="valid">
                                <v-file-input v-model="selectedFile" counter></v-file-input>
                                <v-btn color="secondary" block dark type="submit" large class="my-3" @click="toggleLoader">Upload
                                    file</v-btn>
                            </v-form>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FileUploadService from '@/services/file-upload-service';


export default defineComponent({
    emits: ['toggle:loader', 'submitted:form', 'close:dialog'],
    props: {
        formTitle: {
            type: String,
            required: false
        },
        open: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            dialog: false,
            valid: false,
            selectedFile: null,
        }
    },
    watch: {
        open(val: boolean): void {
            this.dialog = val;
            if (!val) {
                this.close();
            }
        }
    },
    methods: {
        close() {
            this.dialog = false;
            this.$emit('close:dialog');
        },
        submit: async function () {
            if (this.selectedFile != null) {
                let formData = new FormData();
                formData.append('file', this.selectedFile, (this.selectedFile as File).name);
                let requestStatus = await FileUploadService.uploadStudentsImportFile(formData);
                this.$emit('submitted:form', requestStatus);
                this.selectedFile = null;
                this.close();
            }
        },
        toggleLoader: function () {
            this.$emit('toggle:loader');
        }
    }
})
</script>
