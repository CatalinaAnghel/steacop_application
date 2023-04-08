<template>
    <div>
        <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
            @update:showAlert="updateShowAlert"></base-alert>
        <base-data-table title="Students" :headers="headers" :items="students" :items-per-page="itemsPerPage"
            :loading="loading" expandable form-title="Upload a CSV file" has-dialog :hideTopButton="false"
            :openDialog="openDialog">
            <template v-slot:toolbarCustomButtons>
                <v-btn color="secondary" dark class="mb-2" @click="openDialog">
                    Import
                </v-btn>
            </template>
            <template v-slot:expandContent="item">
                <p class="text-h6 mt-2 primary--text">Project description</p>
                <p class="text-justify">{{ item.expanded }}</p>
            </template>
            <template v-slot:dialogContent>
                <upload-file-dialog :open="dialog" @toggle:loader="toggleLoader" @submitted:form="handleResponse"
                    @close:dialog="closeDialog"></upload-file-dialog>
            </template>
        </base-data-table>
    </div>
</template>
<script lang="ts">
import { DATA_TABLE_DEFAULT_ITEMS_PER_PAGE } from '@/common/constants';
import { SUCCESS_UPLOAD_MESSAGE } from '@/common/messages';
import { DataTableHeadersInterface, ResponseDto } from '@/modules/common';
import { StudentInterface } from '@/modules/student';
import { storeService } from '@/store';
import BaseDataTable from '../base/BaseDataTable.vue';
import mixins from "vue-typed-mixins";
import FormMixin from '../mixins/FormMixin.vue';
import UploadFileDialog from '@/components/dialogs/students/UploadFileDialog.vue';

export default mixins(FormMixin).extend({
    components: {
        BaseDataTable,
        UploadFileDialog
    },
    data() {
        return {
            itemsPerPage: DATA_TABLE_DEFAULT_ITEMS_PER_PAGE,
            loading: false,
            dialog: false,
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
        handleSubmit(payload: ResponseDto): void {
            this.handleResponse(payload, SUCCESS_UPLOAD_MESSAGE);
        },
        openDialog(): void {
            this.dialog = true;
        },
        closeDialog(): void {
            this.dialog = false;
        }
    }
});

</script>