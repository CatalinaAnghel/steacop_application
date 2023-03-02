<template>
    <div>
        <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
                    @update:showAlert="updateShowAlert"></base-alert>
        <base-data-table title="Students" :headers="headers" :items="students" :items-per-page="itemsPerPage" :loading="loading"
        expandable @save:dialog="submit" has-dialog>
        <template v-slot:dialogContent>
            <v-form v-model="valid">
                <v-file-input col="12" v-model="selectedFile" counter></v-file-input>
            </v-form>
        </template>
    </base-data-table>
    </div>
    
</template>
<script lang="ts">
import { DATA_TABLE_DEFAULT_ITEMS_PER_PAGE, SUCCESS_UPLOAD_MESSAGE } from '@/common/constants';
import { DataTableHeadersInterface } from '@/modules/common';
import { StudentInterface } from '@/modules/student';
import { storeService } from '@/store';
import BaseDataTable from '../base/BaseDataTable.vue';
import FileUploadService from '@/services/file-upload-service';
import mixins from "vue-typed-mixins";
import FormMixin from '../mixins/FormMixin.vue';

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
        students(): StudentInterface[] {
            return storeService.students.getStudents();
        },
        headers(): DataTableHeadersInterface[] {
            return storeService.students.getHeaders();
        }
    },
    created() {
        this.toggleLoader();
        storeService.students.load().then(() => {
            this.toggleLoader();
        });

    },
    methods: {
        submit: async function() {
            // TODO: file extension validation
            if(this.selectedFile != null){
                let formData = new FormData();
                formData.append('file', this.selectedFile, (this.selectedFile as File).name);
                let requestStatus = await FileUploadService.uploadStudentsImportFile(formData);
                this.handleResponse(requestStatus, SUCCESS_UPLOAD_MESSAGE);
                this.toggleLoader();
            }
        }
    }
});

</script>