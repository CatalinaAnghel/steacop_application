<template>
    <v-row class="my-lg-16 py-lg-16" justify="center">
        <v-col cols="12">
            <h2 class="primary--text">
                <v-icon large color="primary">
                    mdi-account-school-outline
                </v-icon>
                Students
            </h2>
        </v-col>

        <v-col cols="12" sm="12" md="12" lg="6" xl="6">
            <h3>
                All-in-one platform that helps you with:
            </h3>
            <base-list :items="items"></base-list>
        </v-col>
        <v-col cols="auto" lg="6" xl="6">
            <img :src="require('@/assets/home/new_ideas.svg')" class="mx-auto homepage-image" />
        </v-col>
    </v-row>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import BaseList from "../base/BaseList.vue";


export default defineComponent({
    data: function () {
        return {
            items: [
                {
                    text: "Keeping track of the meetings (guidance + milestone)",
                    icon: "mdi-calendar-cursor",
                    id: 1
                },
                {
                    text: "Managing the assignments",
                    icon: "mdi-file-document-outline",
                    id: 2
                },
                {
                    text: "Managing the functionalities",
                    icon: "mdi-lightbulb-on",
                    id: 3
                },
                {
                    text: "See the overall statistics",
                    icon: "mdi-chart-line",
                    id: 4
                }

            ]
        };
    },
    components: {
        BaseList
    }
});
</script>
