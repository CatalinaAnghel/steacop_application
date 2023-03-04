<template>
    <div>
        <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
                    @update:showAlert="updateShowAlert"></base-alert>
        <base-data-table title="Supervisors" :headers="headers" :items="supervisors" :items-per-page="itemsPerPage" :loading="loading"
            form-title="Upload a CSV file" @save:dialog="submit" has-dialog>
        <template v-slot:dialogContent>
            <v-form v-model="valid">
                <v-file-input v-model="selectedFile" counter></v-file-input>
            </v-form>
        </template>
    </base-data-table>
    </div>
    
</template>
<script lang="ts">
import { DATA_TABLE_DEFAULT_ITEMS_PER_PAGE, SUCCESS_UPLOAD_MESSAGE } from '@/common/constants';
import { DataTableHeadersInterface } from '@/modules/common';
import { storeService } from '@/store';
import BaseDataTable from '../base/BaseDataTable.vue';
import FileUploadService from '@/services/file-upload-service';
import mixins from "vue-typed-mixins";
import FormMixin from '../mixins/FormMixin.vue';
import { SupervisorInterface } from '@/modules/supervisor';

export default mixins(FormMixin).extend({
    components: {
        BaseDataTable
    },
    data() {
        return {
            itemsPerPage: DATA_TABLE_DEFAULT_ITEMS_PER_PAGE,
            loading: false,
            valid: false,
            selectedFile: null,
        }
    },
    computed: {
        supervisors(): SupervisorInterface[] {
            return storeService.supervisors.getSupervisors();
        },
        headers(): DataTableHeadersInterface[] {
            return storeService.supervisors.getHeaders();
        }
    },
    created() {
        this.toggleLoader();
        storeService.supervisors.load().then(() => {
            this.toggleLoader();
        });

    },
    methods: {
        submit: async function() {
            // TODO: file extension validation
            if(this.selectedFile != null){
                let formData = new FormData();
                formData.append('file', this.selectedFile, (this.selectedFile as File).name);
                let requestStatus = await FileUploadService.uploadSupervisorsImportFile(formData);
                this.handleResponse(requestStatus, SUCCESS_UPLOAD_MESSAGE);
                this.toggleLoader();
            }
        }
    }
});

</script>