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
            <h4>
                All-in-one platform that helps you with:
            </h4>
            <ul>
                <li>Keeping track of the meetings (guidance + milestone)</li>
                <li>Managing the assignments</li>
                <li>Managing the functionalities</li>
                <li>See the overall statistics</li>
            </ul>
        </v-col>
        <v-col cols="auto" lg="6" xl="6">
            <img :src="require('@/assets/home/new_ideas.svg')" class="mx-auto homepage-image" />
        </v-col>
    </v-row>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({

});
</script>
