<template>
    <v-col cols="12" sm="12" xs="12" md="12" lg="12" xl="12">
        <v-row justify-center v-if="loading">
            <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-col>
        </v-row>
        <v-sheet v-else class="mx-auto" elevation="2" max-width="900">
            <v-row justify="space-between" class="mb-3">
                <v-col cols="auto">
                    <span class="text-h6 px-7 pt-2 primary--text text--darken-3">Attachments</span>
                </v-col>
                <v-col cols="auto" v-if="editable">
                    <v-btn color="secondary" outlined class="mx-7" @click="openDialog">
                        <v-icon medium color="secondary">
                            mdi-file-upload
                        </v-icon>
                        Attach files
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider class="mx-7"></v-divider>
            <v-slide-group v-if="attachments.length" v-model="model" class="pa-4" active-class="primary" show-arrows>
                <v-slide-item v-for="attachment in attachments" :key="attachment.id">
                    <v-card color="neutral lighten-1" class="ma-4" width="200">
                        <v-img contain :src="require('@/assets/attachment.svg')" class="white--text align-end"
                            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px">
                            <v-card-title><span class="text-truncate" max-width="150px">{{ attachment.filePath
                            }}</span></v-card-title>
                        </v-img>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn icon :href="getAttachmentURL(attachment.contentUrl)" target="_blank">
                                <v-icon color="primary">mdi-open-in-new</v-icon>
                            </v-btn>

                            <v-btn icon @click="removeAttachment(attachment.id)">
                                <v-icon color="error">mdi-delete</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-slide-item>
            </v-slide-group>
            <p v-else class="text--secondary pt-3 pb-6 text-center">No attachments have been found...</p>
        </v-sheet>

    </v-col>
</template>

<script lang="ts">
import { FunctionalityInterface } from "@/store/functionalities/types";
import { defineComponent } from "vue";
import { getIcon, IconInterface } from "@/modules/project";
import { DocumentInterface } from "@/modules/assignment";
import FunctionalityService from "@/services/functionality-service";
import { CDN_DOMAIN } from "@/common/constants";

export default defineComponent({
    emits: ['refreshed:attachments', 'open:dialog'],
    data: function () {
        return {
            model: null,
            attachments: [] as DocumentInterface[],
            loading: false as boolean
        }
    },
    props: {
        functionalityDetails: {
            type: Object as () => FunctionalityInterface,
            require: true
        },
        forceRefresh: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
        icon: function (): IconInterface {
            return getIcon(this.functionalityDetails.type.name);
        },
        editable: function (): boolean {
            return this.functionalityDetails.status.name !== 'Done';
        }
    },
    watch: {
        async forceRefresh(value: boolean): Promise<void> {
            if (value) {
                await this.loadAttachments();
                this.$emit('refreshed:attachments');
            }
        }
    },
    methods: {
        loadAttachments: async function (): Promise<void> {
            this.loading = true;
            this.attachments = await FunctionalityService.getAttachments(this.functionalityDetails.id);
            this.loading = false;
        },
        removeAttachment: async function (id: number): Promise<void> {
            this.loading = true;
            const response = await FunctionalityService.deleteAttachment(id);
            if (response.success) {
                await this.loadAttachments();
            } else {
                this.loading = false;
            }
        },
        openDialog: function (): void {
            this.$emit('open:dialog');
        },
        getAttachmentURL: function (contentUrl: string): string {
            return CDN_DOMAIN + contentUrl;
        }
    },
    created: async function (): Promise<void> {
        await this.loadAttachments();
    },
});
</script>