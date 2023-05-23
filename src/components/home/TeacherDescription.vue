<template>
    <v-row class="mt-16" align="center">
        <v-col cols="12">
            <h2 class="primary--text">
                <v-icon large color="primary">
                    mdi-human-male-board
                </v-icon>
                Teachers
            </h2>
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="6" xl="6">
            <img :src="require('@/assets/home/education.svg')" class="homepage-image" />
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="6" xl="6">
            <h4>
                You can manage the thesis projects by:
            </h4>
            <ul>
                <li>Proposing a supervisory style (Steacop will also provide recommendations based on the supervisory styles)</li>
                <li>Proposing meetings (guidance and milestone meetings) and creating assignments</li>
                <li>Managing the functionalities</li>
                <li>See the collaboration score and other statistics</li>
            </ul>
        </v-col>
    </v-row>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({

});
</script>
