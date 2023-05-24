<template>
  <overview-calendar v-if="isSupervisor"/>
</template>

<script lang="ts">
import RoleMixin from "@/components/mixins/RoleMixin.vue";
import mixins from "vue-typed-mixins";
import OverviewCalendar from '@/components/projects/OverviewCalendar.vue';
export default mixins(RoleMixin).extend({
    components: {
      OverviewCalendar
    },
    created: function(){
      this.setProperties();
    }
});
</script>