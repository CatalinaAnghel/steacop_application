<template>
    <v-row v-if="functionalityDetails !== null && !loading">
        <v-col v-if="editable" cols="12">
            <edit-functionality-dialog :functionality-details="functionalityDetails" :open="editDialogOpen"
                :statuses="statuses" @close:dialog="editDialogOpen = false"></edit-functionality-dialog>
            <upload-attachments-dialog :functionality-details="functionalityDetails" :open="uploadDialog"
                @close:dialog="uploadDialog = false" @submitted:form="forceRefreshDocs(true)"></upload-attachments-dialog>
        </v-col>
        <v-col cols="12" md="12" lg="8" xl="8">
            <v-row>
                <functionality-details-card :functionality-details="functionalityDetails"
                    @forceRefresh:component="forceRefresh"></functionality-details-card>
                <functionality-attachments-card :functionality-details="functionalityDetails" :force-refresh="refreshDocuments"
                    @refreshed:attachments="forceRefreshDocs(false)" @open:dialog="uploadDialog = true"></functionality-attachments-card>
            </v-row>
        </v-col>

        <functionality-state-card :functionality-details="functionalityDetails"
            @open:dialog="editDialogOpen = true"></functionality-state-card>
        <functionality-timeline-card :functionality-details="functionalityDetails"></functionality-timeline-card>
    </v-row>
    <base-overlay v-else :overlay="functionalityDetails === null || loading"></base-overlay>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FunctionalityDetailsCard from "@/components/projects/functionalities/FunctionalityDetailsCard.vue";
import FunctionalityStateCard from "@/components/projects/functionalities/FunctionalityStateCard.vue";
import FunctionalityTimelineCard from "@/components/projects/functionalities/FunctionalityTimelineCard.vue";
import EditFunctionalityDialog from "@/components/dialogs/functionalities/EditFunctionalityDialog.vue";
import UploadAttachmentsDialog from "@/components/dialogs/functionalities/UploadAttachmentsDialog.vue";
import FunctionalityAttachmentsCard from "@/components/projects/functionalities/FunctionalityAttachmentsCard.vue";
import { FunctionalityInterface, StatusInterface } from "@/store/functionalities/types";
import BaseOverlay from "@/components/base/BaseOverlay.vue";
import { storeService } from "@/store";
import { eventBus } from "@/main";
import { EVENT_BUS_REFRESH_COMPONENT } from "@/common/constants";


export default defineComponent({
    data: function () {
        return {
            functionalityDetails: null as FunctionalityInterface | null,
            statuses: [] as StatusInterface[],
            loading: false as boolean,
            editDialogOpen: false as boolean,
            uploadDialog: false as boolean,
            refreshDocuments: false as boolean
        }
    },
    components: {
        FunctionalityDetailsCard,
        FunctionalityStateCard,
        FunctionalityTimelineCard,
        EditFunctionalityDialog,
        UploadAttachmentsDialog,
        FunctionalityAttachmentsCard,
        BaseOverlay
    },
    computed: {
        editable: function (): boolean {
            return this.functionalityDetails.status.name !== 'Done';
        }
    },
    methods: {
        setProperties: async function (): Promise<void> {
            this.loading = true;

            this.functionalityDetails = await storeService.functionalities.fetchFunctionality(Number(this.$route.params.id));
            if (0 === this.statuses.length) {
                await storeService.functionalities.loadStatuses().then(() => {
                    this.statuses = storeService.functionalities.getStatuses();
                });
            }
            this.loading = false;
        },
        forceRefresh: function (): void {
            eventBus.$emit(EVENT_BUS_REFRESH_COMPONENT);
        },
        forceRefreshDocs: function(refresh: boolean): void{
            this.refreshDocuments = refresh;
        }
    },
    created: async function (): Promise<void> {
        await this.setProperties();
        if (null === this.functionalityDetails) {
            this.$router.push({ name: "NotFound" });
        }
    },
    mounted: function (): void {
        eventBus.$on(EVENT_BUS_REFRESH_COMPONENT, async () => {
            await this.setProperties();
        });
    },
    destroyed: function () {
        eventBus.$off(EVENT_BUS_REFRESH_COMPONENT);
    }
})
</script>
