<template>
    <div>
        <v-tabs grow class="pb-5" :color="backgroundColor">
            <v-tab exact v-for="tab in tabs" :key="tab.name" :to="tab.to">{{ tab.name }}</v-tab>
        </v-tabs>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TabInterface } from '@/modules/common';

export default defineComponent({
    props: {
        tabs: {
            type: Array as () => TabInterface[],
            required: true
        },
        backgroundColor: {
            type: String,
            default: null,
            required: false
        }
    }
})
</script>