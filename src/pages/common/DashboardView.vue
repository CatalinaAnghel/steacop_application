<template>
    <v-row v-if="isAdmin" class="pt-5">
        <v-col v-for="card in cards" :key="card.title"  cols="12" md="6" lg="4" xl="4">
            <base-image-card :title="card.title" :subtitle="card.subtitle" :image="card.image" :pathName="card.pathName"></base-image-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import RoleMixin from "@/components/mixins/RoleMixin.vue";
import mixins from "vue-typed-mixins";
import BaseImageCard from '@/components/base/BaseImageCard.vue';

export default mixins(RoleMixin).extend({
    data: () => {
        return {
          cards: [
            {
              title: "System settings",
              subtitle: "Configure the system settings",
              pathName: "settings",
              image: "dashboard/settings.svg"
            },
            {
              title: "Students",
              subtitle: "See the students",
              pathName: "viewStudents",
              image: "dashboard/student.svg"
            },
            {
              title: "Professors",
              subtitle: "See the professors",
              pathName: "viewSupervisors",
              image: "dashboard/professor.svg"
            }
          ]
        };
    },
    components: {
      BaseImageCard
    },
    created: function(){
      this.setProperties();
    }
});
</script>