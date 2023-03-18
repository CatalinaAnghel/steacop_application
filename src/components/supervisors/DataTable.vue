<template>
    <div>
        <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
                    @update:showAlert="updateShowAlert"></base-alert>
        <base-data-table title="Supervisors" :headers="headers" :items="supervisors" :items-per-page="itemsPerPage" :loading="loading"
            form-title="Upload a CSV file" has-dialog :hideTopButton="false" :openDialog="openDialog">
            <template v-slot:toolbarCustomButtons>
                <v-btn color="primary" dark class="mb-2" @click="openDialog">
                    Import
                    </v-btn>
            </template>
            <template v-slot:dialogContent>
                <upload-file-dialog :open="dialog" @toggle:loader="toggleLoader" @submitted:form="handleResponse" @close:dialog="closeDialog"></upload-file-dialog>
            </template>
    </base-data-table>
    </div>
    
</template>
<script lang="ts">
import { DATA_TABLE_DEFAULT_ITEMS_PER_PAGE, SUCCESS_UPLOAD_MESSAGE } from '@/common/constants';
import { DataTableHeadersInterface, ResponseDto } from '@/modules/common';
import { storeService } from '@/store';
import BaseDataTable from '../base/BaseDataTable.vue';
import mixins from "vue-typed-mixins";
import FormMixin from '../mixins/FormMixin.vue';
import { SupervisorInterface } from '@/modules/supervisor';
import UploadFileDialog from '@/components/dialogs/supervisors/UploadFileDialog.vue';

export default mixins(FormMixin).extend({
    components: {
        BaseDataTable,
        UploadFileDialog
    },
    data() {
        return {
            itemsPerPage: DATA_TABLE_DEFAULT_ITEMS_PER_PAGE,
            loading: false,
            dialog: false
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
        handleSubmit(payload: ResponseDto): void{
            this.handleResponse(payload, SUCCESS_UPLOAD_MESSAGE);
        },
        openDialog():void{
            this.dialog = true;
        },
        closeDialog():void{
            this.dialog = false;
        }
    }
});

</script>