<template>
    <base-data-table title="Epics" :headers="headers" :items="items" :items-per-page="itemsPerPage" expandable
        :hideTopButton="false">
        <template v-slot:expandContent="item">
            <p class="text-h6 mt-2 primary--text">Description</p>
            <p class="text-justify">{{ item.description }}</p>
        </template>
        <template v-slot:itemActions="item">
            <v-icon color="secondary" small class="mr-2" @click="viewFunctionality(item)">
                mdi-information-outline
            </v-icon>
        </template>
    </base-data-table>
</template>
<script lang="ts">
import { DATA_TABLE_DEFAULT_ITEMS_PER_PAGE } from '@/common/constants';
import { DataTableHeadersInterface } from '@/modules/common';
import { storeService } from '@/store';
import BaseDataTable from '@/components/base/BaseDataTable.vue';
import { FunctionalityInterface } from '@/store/functionalities/types';
import { defineComponent } from 'vue';

export default defineComponent({
    components: {
        BaseDataTable
    },
    props: {
        functionalities: Array as () => FunctionalityInterface[]
    },
    data() {
        return {
            itemsPerPage: DATA_TABLE_DEFAULT_ITEMS_PER_PAGE,
        }
    },
    computed: {
        headers(): DataTableHeadersInterface[] {
            return storeService.functionalities.getHeaders();
        },
        items(): FunctionalityInterface[] {
            let items = [] as FunctionalityInterface[];
            this.functionalities.forEach(element => {
                let item = element;
                item.createdAt = (new Date(element.createdAt)).toLocaleDateString() + ', ' + (new Date(element.createdAt)).toLocaleTimeString();
                item.updatedAt = (new Date(element.updatedAt)).toLocaleDateString() + ', ' + (new Date(element.updatedAt)).toLocaleTimeString();
                item.dueDate = (new Date(element.updatedAt)).toLocaleDateString();
                items.push(item);
            })
            return items;
        }
    },
    methods: {
        viewFunctionality(item: FunctionalityInterface): void {
            if (item.id !== null) {
                const id = item.id.toString();
                this.$router.push({
                    name: "functionality", params: {
                        id
                    }
                });
            }
        },
    }
});

</script>