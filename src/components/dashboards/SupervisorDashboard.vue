<template>
    <div>
        <overview-calendar></overview-calendar>
        <statistics-students-grades></statistics-students-grades>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StatisticsStudentsGrades from '@/components/projects/statistics/StatisticsStudentsGrades.vue';
import OverviewCalendar from '@/components/projects/OverviewCalendar.vue';

export default defineComponent({
    components: {
        OverviewCalendar,
        StatisticsStudentsGrades
    }
})
</script>
