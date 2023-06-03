<template>
    <div>
        <base-overlay v-if="loading" :overlay="loading"></base-overlay>
        <v-row v-else>
            <v-col cols="12">
                <create-functionality-dialog v-if="types.length" :types="types" :open="createDialog"
                    @close:dialog="closeCreateDialog" @submitted:form="requestStatus => handleAction(requestStatus)"
                    form-title="Create a new item"></create-functionality-dialog>
            </v-col>
            <v-col cols="12">
                <v-row justify="space-between">
                    <v-col cols="auto">
                        <v-btn-toggle dense medium v-model="button" mandatory>
                            <v-btn class="mb-2">
                                <v-icon medium>mdi-view-column-outline</v-icon>
                                Kanban board
                            </v-btn>
                            <v-btn class="mb-2">
                                <v-icon medium>mdi-format-list-bulleted-square</v-icon>
                                Epics
                            </v-btn>
                        </v-btn-toggle>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn :disabled="types.length === 0" color="secondary" outlined class="mb-2"
                            @click="openCreateDialog">
                            <v-icon medium color="secondary">
                                mdi-file-document-plus-outline
                            </v-icon>
                            Create
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12">
                <v-divider />
            </v-col>
            <v-col cols="12">
                <kanban-board v-if="button === 0" :functionalitiesList="functionalities"
                    @update:functionalities="loadFunctionalities"></kanban-board>
                <functionality-table v-else :functionalities="epics"></functionality-table>
            </v-col>
        </v-row>
        
    </div>
</template>
    
<script lang="ts">
import { defineComponent } from 'vue';
import KanbanBoard from '@/components/projects/functionalities/KanbanBoard.vue';
import FunctionalityTable from '@/components/projects/functionalities/FunctionalityDataTable.vue';
import BaseOverlay from '@/components/base/BaseOverlay.vue';
import CreateFunctionalityDialog from '@/components/dialogs/functionalities/CreateFunctionalityDialog.vue';
import { storeService } from '@/store';
import { FunctionalityGroupInterface, FunctionalityInterface, FunctionalityPayloadInterface, TypeInterface } from '@/store/functionalities/types';
import { ResponseDto } from '@/modules/common';

export default defineComponent({
    components: {
        KanbanBoard,
        FunctionalityTable,
        CreateFunctionalityDialog,
        BaseOverlay
    },
    data: () => {
        return {
            button: 0,
            loading: true,
            createDialog: false,
            functionalities: [] as FunctionalityGroupInterface[],
            epics: [] as FunctionalityInterface[]
        };
    },
    computed: {
        types(): TypeInterface[] {
            return storeService.functionalities.getTypes();
        },
    },
    methods: {
        openCreateDialog(): void {
            this.createDialog = true;
        },
        closeCreateDialog(): void {
            this.createDialog = false;
        },
        loadFunctionalities: async function (): Promise<void> {
            this.loading = true;
            await storeService.functionalities.loadStatuses().then(() => {
                const statuses = storeService.functionalities.getStatuses();
                statuses.forEach((element) => {
                    storeService.functionalities.load({
                        projectId: Number(this.$route.params.id),
                        status: element
                    } as FunctionalityPayloadInterface);
                });
            }).then(() => {
                this.functionalities = storeService.functionalities.getFunctionalities();
                this.epics = storeService.functionalities.getEpics();
                this.loading = false;
            });

        },
        handleAction: function (response: ResponseDto): void {
            if (response.success) {
                this.functionalities = storeService.functionalities.getFunctionalities();
                this.epics = storeService.functionalities.getEpics();
            }
        },
    },
    created: async function (): Promise<void> {
        storeService.functionalities.loadTypes();
        await this.loadFunctionalities();
    }
});
</script>