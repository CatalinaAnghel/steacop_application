<template>
    <div>
        <v-row justify="end">
            <v-col cols="2" v-if="isStudent">
                <v-btn :disabled="disableSaving" color="primary" outlined :dark="!disableSaving" block class="mb-2"
                    @click="order">
                    <v-icon medium color="primary">
                        mdi-content-save-outline
                    </v-icon>
                    Save
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="itemsGroup in functionalities" :key="itemsGroup.status.id" cols="12" md="6"
                :lg="12 / statuses.length" :xl="12 / statuses.length">
                <v-card>
                    <v-card-title>
                        <v-avatar :color="getIcon(itemsGroup.status.name).color" rounded class="mx-2" size="25px">
                            <v-icon small dark>
                                {{ getIcon(itemsGroup.status.name).name }}
                            </v-icon>
                        </v-avatar>
                        <span>
                            {{ itemsGroup.status.name }}
                        </span>
                    </v-card-title>

                    <v-card-text>
                        <v-divider></v-divider>
                        <draggable :disabled="isSupervisor" class="list-group" :list="itemsGroup.functionalities"
                            group="projectFunctionalities" @change="markAsDirty">
                            <div :class="{ 'list-group-item': true, 'draggable-card': isStudent }"
                                v-for="(element) in itemsGroup.functionalities" :key="element.id">
                                <v-card class="border-primary px-2 my-2">
                                    <v-card-title>
                                        <span class="text-subtitle-2">
                                            {{ element.code + ' - ' + element.title }}
                                        </span>
                                    </v-card-title>

                                    <v-card-subtitle>{{ element.status.name }}</v-card-subtitle>

                                    <v-card-actions>
                                        <v-btn text @click="viewFunctionality(element.id)" class="secondary--text">
                                            View details</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </div>
                            <p v-if="itemsGroup.functionalities.length === 0" slot="footer" class="mt-2">No functionalities
                                found</p>
                        </draggable>

                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { storeService } from '@/store';
import { FunctionalityGroupInterface, StatusInterface } from '@/store/functionalities/types';
import mixins from "vue-typed-mixins";
import RoleMixin from "@/components/mixins/RoleMixin.vue";
import draggable from 'vuedraggable';
import { getStatusIcon, IconInterface } from '@/modules/project';
import BaseOverlay from '@/components/base/BaseOverlay.vue';

export default mixins(RoleMixin).extend({
    components: {
        draggable,
        BaseOverlay
    },
    data: function () {
        return {
            functionalities: [] as FunctionalityGroupInterface[],
            isDirty: false,
            loading: false
        };
    },
    props: {
        functionalitiesList: {
            type: Array as () => FunctionalityGroupInterface[],
            required: true
        }
    },
    watch: {
        functionalitiesList(val: FunctionalityGroupInterface[]): void {
            this.functionalities = val;
            this.isDirty = false;
        }
    },
    computed: {
        statuses(): StatusInterface[] {
            return storeService.functionalities.getStatuses();
        },
        disableSaving(): boolean {
            return !this.isDirty || this.loading;
        }
    },
    created: async function (): Promise<void> {
        this.setProperties();
        this.functionalities = this.functionalitiesList;
        this.isDirty = false;
    },
    methods: {
        markAsDirty: function (): void {
            this.isDirty = true;
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
            await storeService.functionalities.saveFunctionalitiesOrdering(this.functionalities);
            this.loading = false;
            this.$emit('update:functionalities');
        },
        getIcon: function (status: string): IconInterface {
            return getStatusIcon(status);
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