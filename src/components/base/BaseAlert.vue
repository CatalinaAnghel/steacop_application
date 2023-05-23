<template>
    <v-alert :type="type" :color="color" v-model="open" outlined dismissible :title="title">
        {{ text }}
    </v-alert>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        text: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: false,
            default: "success"
        },
        title: {
            type: String,
            required: false,
            default: ""
        },
        color: {
            type: String,
            required: true
        },
        showAlert: {
            type: Boolean,
            required: false,
            default: false
        }
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