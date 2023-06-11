<template>
    <v-list>
        <v-list-item v-for="item in items" :key="item.id">
            <v-list-item-avatar>
                <v-icon :class="color" dark>
                    {{ item.icon }}
                </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</template>

<script lang="ts">
import { ListElementInterface } from "@/modules/common";
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        items: {
            type: Array as () => ListElementInterface[],
            required: true
        },
        color: {
            type: String,
            required: false,
            default: 'secondary'
        }
    }
});
</script>