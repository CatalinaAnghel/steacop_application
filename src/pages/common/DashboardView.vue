<template>
  <supervisor-dashboard v-if="isSupervisor"></supervisor-dashboard>
  <student-dashboard v-else></student-dashboard>
</template>

<script lang="ts">
import RoleMixin from "@/components/mixins/RoleMixin.vue";
import mixins from "vue-typed-mixins";
import SupervisorDashboard from "@/components/dashboards/SupervisorDashboard.vue";
import StudentDashboard from "@/components/dashboards/StudentDashboard.vue";

export default mixins(RoleMixin).extend({
    components: {
      SupervisorDashboard,
      StudentDashboard
    },
    created: function(){
      this.setProperties();
    }
});
</script>