<template>
    <v-alert :type="type" :color="color" v-model="open" outlined dismissible :title="title">
        {{ text }}
    </v-alert>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        text: String,
        type: String,
        title: String,
        color: String,
        showAlert: Boolean
    },
    emits: ['update:showAlert'],
    computed: {
        open: {
            get(): boolean {
                return this.showAlert;
            },
            set(value: boolean) {
                this.$emit('update:showAlert', value);
            }
        }
    },
    watch: {
        open: function(value){
            if(value){
                setTimeout(() => {
                    this.open = false;
                }, 3000);
            }
        }
    }
});
</script>