<template>
    <v-card class="mb-5">
        <v-card-title>
            <span class="text-h5 primary--text text--darken-3">{{ cardTitle }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col col="12" sm="12" md="12">
                        <h3 class="pb-5">{{ title }}</h3>
                        <v-divider color="primary"></v-divider>
                        <p class="pt-5 text-justify">{{ description }}</p>
                        <a :href="repositoryUrl" v-if="repositoryUrl !== ''">See repository</a>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        title: {
            type: String,
            required: false,
            default: null
        },
        description: {
            type: String,
            required: true,
        },
        repositoryUrl: {
            type: String,
            required: false,
            default: null
        }
    },
    data() {
        return {
            cardTitle: 'Project information'
        }
    },
    methods: {
    }
});
</script>