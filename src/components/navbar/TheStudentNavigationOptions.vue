<template>
    <v-list-item :to="{ name: 'project', params: { id: projectId } }">
        <v-list-item-icon>
            <v-icon>mdi-clipboard-text</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Project</v-list-item-title>
    </v-list-item>
</template>

<script lang="ts">
import { storeService } from "@/store";
import { defineComponent } from "vue";

export default defineComponent({
    data: function () {
        return {
            projectId: null as number | null
        }
    },
    created: function (): void {
        const userData = storeService.user.getUser();
        this.projectId = userData.projectId;
    }
});
</script>