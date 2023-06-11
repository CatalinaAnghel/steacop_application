<template>
    <v-row class="my-lg-16 py-lg-16" justify="center">
        <v-col cols="12">
            <h2 class="primary--text">
                <v-icon large color="primary">
                    mdi-human-male-board
                </v-icon>
                Teachers
            </h2>
        </v-col>
        <v-col cols="auto" lg="6" xl="6">
            <img :src="require('@/assets/home/education.svg')" class="homepage-image" />
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="6" xl="6">
            <h3>
                You can manage the thesis projects by:
            </h3>
            <base-list :items="items"></base-list>
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
                    text: "Proposing a supervisory style (Steacop will also provide recommendations based on the supervisory styles)",
                    icon: "mdi-clipboard-edit-outline",
                    id: 1
                },
                {
                    text: "Scheduling meetings (guidance and milestone meetings)",
                    icon: "mdi-calendar-cursor",
                    id: 2
                },
                {
                    text: "Managing the assignments",
                    icon: "mdi-file-document-outline",
                    id: 3
                },
                {
                    text: "Managing the functionalities",
                    icon: "mdi-lightbulb-on",
                    id: 4
                },
                {
                    text: "See the collaboration score and other statistics",
                    icon: "mdi-chart-line",
                    id: 5
                }

            ]
        };
    },
    components: {
        BaseList
    }
});
</script>
