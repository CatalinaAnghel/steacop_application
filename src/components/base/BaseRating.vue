<template>
    <v-rating :background-color="backgroundColor" :color="color" :readonly="readonly"
        empty-icon="mdi-star-outline" full-icon="mdi-star"
        half-icon="mdi-star-half-full" half-increments hover :length="length" size="32"
        v-model="ratingValue" @input="updateRating"></v-rating>
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
        },
        rating: {
            type: Number,
            required: true
        },
        readonly: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data(){
        return {
            ratingValue: 0
        }
    },
    watch: {
        rating: function(): void{
            this.ratingValue = this.rating;
        }
    },
    methods: {
        updateRating: function(): void{
            this.$emit('updated:rating', this.ratingValue);
        }
    }
});
</script>