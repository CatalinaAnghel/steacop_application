<template>
  <div>
    <intro-container />
    <v-divider class="mt-16"/>
    <teacher-description />
    <v-divider class="mt-16"/>
    <student-description/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IntroContainer from '@/components/home/IntroContainer.vue';
import TeacherDescription from '@/components/home/TeacherDescription.vue';
import StudentDescription
 from '@/components/home/StudentDescription.vue';
export default defineComponent({
  name: 'Home-View',
  components: {
    IntroContainer,
    TeacherDescription,
    StudentDescription
  }
});
</script>
