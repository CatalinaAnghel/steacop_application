<template>
    <v-rating :background-color="backgroundColor" :color="color"
        empty-icon="mdi-star-outline" full-icon="mdi-star"
        half-icon="mdi-star-half-full" half-increments hover :length="length" size="32"
        v-model="rating"></v-rating>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    emits: ['updated:rating'],
    props: {
        backgroundColor: {
            type: String,
            required: false,
            default: "warning"
        },
        color: {
            type: String,
            required: false,
            default: "warning"
        },
        length: {
            type: Number,
            required: false,
            default: 5
        }
    },
    data(){
        return {
            rating: 0
        }
    },
    watch: {
        rating: function(value){
            this.$emit('updated:rating', value);
        }
    }
});
</script>