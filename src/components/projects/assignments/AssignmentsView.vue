<template>
    <div>
        <assignments-calendar/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AssignmentsCalendar from './AssignmentsCalendar.vue';

export default defineComponent({
    components: {
        AssignmentsCalendar
    }
});
</script>