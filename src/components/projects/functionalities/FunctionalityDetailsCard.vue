<template>
    <v-col cols="12" sm="12" xs="12" md="12" lg="12" xl="12">
        <v-card>
            <v-card-title>
                <v-avatar :color="icon.color" rounded class="mx-2" size="30px">
                    <v-icon small dark>
                        {{ icon.name }}
                    </v-icon></v-avatar>
                <h3><span class="primary--text">{{ functionalityDetails.code }}</span> - 
                    <span>{{ functionalityDetails.title }}</span>
                </h3>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row v-if="typeof functionalityDetails.parent !== 'undefined'">
                        <v-col cols="12">
                            <p class="text-subtitle-2">Related to:
                                <router-link :to="{ name: 'functionality', params: { id: functionalityDetails.parent.id } }"
                                    @click.native="forceRefresh">
                                    {{ functionalityDetails.parent.code }} - {{ functionalityDetails.parent.title }}
                                </router-link>
                            </p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <p>{{ functionalityDetails.description }}</p>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script lang="ts">
import { FunctionalityInterface } from "@/store/functionalities/types";
import { defineComponent } from "vue";
import { getIcon, IconInterface } from "@/modules/project";

export default defineComponent({
    emits: ['forceRefresh:component'],
    props: {
        functionalityDetails: {
            type: Object as () => FunctionalityInterface,
            require: true
        }
    },
    computed: {
        icon: function (): IconInterface {
            return getIcon(this.functionalityDetails.type.name);
        }
    },
    methods: {
        forceRefresh: function (): void {
            this.$emit('forceRefresh:component');
        }
    }
});
</script>