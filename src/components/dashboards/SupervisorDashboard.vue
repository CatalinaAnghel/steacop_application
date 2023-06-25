<template>
    <div>
        <overview-calendar></overview-calendar>
        <statistics-students-grades></statistics-students-grades>
        <statistics-collaboration-scores-card></statistics-collaboration-scores-card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StatisticsStudentsGrades from '@/components/projects/statistics/StatisticsStudentsGrades.vue';
import OverviewCalendar from '@/components/projects/OverviewCalendar.vue';
import StatisticsCollaborationScoresCard from '../projects/statistics/StatisticsCollaborationScoresCard.vue';

export default defineComponent({
    components: {
        OverviewCalendar,
        StatisticsStudentsGrades,
        StatisticsCollaborationScoresCard
    }
})
</script>
