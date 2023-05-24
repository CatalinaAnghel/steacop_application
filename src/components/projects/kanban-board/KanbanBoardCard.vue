<template>
    <div>
        <create-functionality-dialog v-if="types.length" :types="types" :open="createDialog"
            @close:dialog="closeCreateDialog" @submitted:form="requestStatus => handleAction(requestStatus)"
            form-title="Create a new item"></create-functionality-dialog>
        <v-row v-if="!loading">
            <v-col cols="auto">
                <v-btn :disabled="types.length === 0" color="secondary" dark class="mb-2" @click="openCreateDialog">
                    Create
                </v-btn>
            </v-col>
            <v-col cols="auto" v-if="isStudent">
                <v-btn :disabled="disableSaving" color="secondary" :dark="!disableSaving" class="mb-2" @click="order">
                    Save
                </v-btn>
            </v-col>
        </v-row>
        <v-row v-if="!loading">
            <v-col v-for="itemsGroup in functionalities" :key="itemsGroup.status.id" cols="12" md="6"
                :lg="12 / statuses.length" :xl="12 / statuses.length">
                <v-card>
                    <v-card-title class="primary--text">
                        {{ itemsGroup.status.name }}
                    </v-card-title>

                    <v-card-text>
                        <v-divider></v-divider>
                        <draggable v-if="itemsGroup.functionalities.length" :disabled="isSupervisor" class="list-group" :list="itemsGroup.functionalities" group="projectFunctionalities"
                            @change="markAsDirty">

                            <div :class="{'list-group-item': true, 'draggable-card': isStudent}" v-for="(element) in itemsGroup.functionalities"
                                :key="element.id">
                                <v-card class="border-primary px-2 my-2">
                                    <v-card-title>
                                        {{ element.title }}
                                    </v-card-title>

                                    <v-card-subtitle>{{ element.status.name }}</v-card-subtitle>

                                    <v-card-actions>
                                        <v-btn text @click="viewFunctionality(element.id)" class="secondary--text">
                                            View
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </div>
                        </draggable>
                        <p v-else class="mt-2 subtitle--text">No functionalities found</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify-center v-else>
            <v-col cols="12" class="text-center">
                <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { storeService } from '@/store';
import { FunctionalityGroupInterface, FunctionalityPayloadInterface, StatusInterface, TypeInterface } from '@/store/functionalities/types';
import mixins from "vue-typed-mixins";
import RoleMixin from "@/components/mixins/RoleMixin.vue";
import draggable from 'vuedraggable';
import CreateFunctionalityDialog from '@/components/dialogs/kanban/CreateFunctionalityDialog.vue';
import { ResponseDto } from '@/modules/common';

export default mixins(RoleMixin).extend({
    components: {
        draggable,
        CreateFunctionalityDialog,
    },
    data: function () {
        return {
            createDialog: false,
            functionalities: [] as FunctionalityGroupInterface[],
            isDirty: false,
            loading: true,
        };
    },
    computed: {
        statuses(): StatusInterface[] {
            return storeService.functionalities.getStatuses();
        },
        types(): TypeInterface[] {
            return storeService.functionalities.getTypes();
        },
        disableSaving(): boolean {
            return this.types.length === 0 || !this.isDirty;
        }
    },
    created: async function (): Promise<void> {
        this.setProperties();
        storeService.functionalities.loadTypes();
        await storeService.functionalities.loadStatuses().then(() => {
            this.loadFunctionalities();
        });
        this.functionalities = storeService.functionalities.getFunctionalities();
        this.loading = false;
    },
    methods: {
        loadFunctionalities: async function(): Promise<void>{
            await storeService.functionalities.loadStatuses().then(() => {
            const statuses = storeService.functionalities.getStatuses();
            statuses.forEach((element) => {
                storeService.functionalities.load({
                    projectId: Number(this.$route.params.id),
                    status: element
                } as FunctionalityPayloadInterface);
            });
        });
        },
        markAsDirty: function (): void {
            this.isDirty = true;
        },
        openCreateDialog(): void {
            this.createDialog = true;
        },
        closeCreateDialog(): void {
            this.createDialog = false;
        },
        handleAction: function (response: ResponseDto): void {
            console.log(response);
            if (response.success) {
                this.functionalities = storeService.functionalities.getFunctionalities();
                this.isDirty = false;
                this.loading = false;
            }
        },
        viewFunctionality: function (id: number): void {
            this.$router.push({
                name: "functionality",
                params: {
                    id: id.toString()
                }
            });
        },
        order: async function (): Promise<void> {
            this.loading = true;
            const response = await storeService.functionalities.saveFunctionalitiesOrdering(this.functionalities);
            await this.loadFunctionalities();
            this.handleAction(response);
        }
    }
});
</script>

<style lang="scss" scoped>
.border-primary {
    border: 1px solid;
    border-color: var(--v-primary-base);
}

.draggable-card {
    &:hover {
        cursor: grab;
    }
}
</style>