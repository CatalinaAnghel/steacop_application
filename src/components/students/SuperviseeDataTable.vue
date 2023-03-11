<template>
    <div>
        <base-alert v-model="showAlert" :text="alertMessage" :show-alert="showAlert" :color="color"
            @update:showAlert="updateShowAlert"></base-alert>
        <base-data-table title="Supervisees" :headers="headers" :items="students" :items-per-page="itemsPerPage"
            :loading="loading" expandable>
            <template v-slot:itemActions="item">
                <v-icon medium class="mr-2" v-if="checkProject(item)" @click="viewProject(item)">
                    mdi-information-outline
                </v-icon>
            </template>
    </base-data-table>
</div></template>
<script lang="ts">
import { DATA_TABLE_DEFAULT_ITEMS_PER_PAGE } from '@/common/constants';
import { DataTableHeadersInterface } from '@/modules/common';
import { StudentInterface } from '@/modules/student';
import { storeService } from '@/store';
import BaseDataTable from '../base/BaseDataTable.vue';
import mixins from "vue-typed-mixins";
import FormMixin from '../mixins/FormMixin.vue';
import AuthService from '@/services/auth-service';

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
            return storeService.students.getExtendedHeaders();
        }
    },
    created() {
        this.toggleLoader();
        const token = AuthService.getAccessToken();
        if (token !== null) {
            const parsedToken = AuthService.parseToken(token);
            if (parsedToken !== null) {
                storeService.students.load({
                    "project.supervisor.user.code": parsedToken.code
                }).then(() => {
                    this.toggleLoader();
                });
            }
        }
    },
    methods: {
        viewProject(item: StudentInterface){
            const id = item.project!.id.toString();
            this.$router.push({name: "project", params: {
                id
            }});
        },
        checkProject(item: StudentInterface){
            return item.project !== null;
        }
    }
});

</script>