<template>
    <v-card class="mb-5">
        <v-card-title>
            <v-row>
                <v-col cols="12">
                    <h5 :class="textColor + '--text'">{{ cardTitle }}</h5>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text>
            <v-row justify="center" v-if="loading">
                <v-col cols="auto">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-col>
            </v-row>
            <v-container v-else>
                <v-list three-line v-if="items.length">
                    <template v-for="(item) in items">
                        <v-list-item :key="item.name">
                            <v-list-item-avatar :color="textColor">
                                <v-icon dark>{{ icon }}</v-icon>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title v-if="!cardAction">
                                    <router-link :to="item.to">{{ item.name }}</router-link>
                                </v-list-item-title>
                                <v-list-item-title v-else>
                                    {{ item.name }}
                                </v-list-item-title>
                                <v-list-item-subtitle>{{ item.dueDate }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-list>
                <v-card-actions v-if="items.length && cardAction">
                    <v-btn text color="secondary" @click="viewMore">
                        View more
                    </v-btn>
                </v-card-actions>
                <span v-if="!loading && items.length === 0" class="text-subtitle-1">No items have been found...</span>
            </v-container>

        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { DashboardDataInterface } from "@/modules/common";
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        cardTitle: {
            type: String,
            required: true
        },
        loading: {
            type: Boolean,
            required: false,
            default: false
        },
        textColor: {
            type: String,
            required: false,
            default: 'primary'
        },
        icon: {
            type: String,
            required: false,
            default: 'mdi-help'
        },
        items: {
            type: Array as () => DashboardDataInterface[],
            required: true
        },
        cardAction: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    methods: {
        viewMore(): void {
            let route = {
                name: this.items[0].to.name,
                params: {}
            };
            if (typeof this.items[0].to.params !== 'undefined') {
                route.params = {
                    id: this.items[0].to.params.id
                }
            }
            this.$router.push(route);
        }
    }
});
</script>