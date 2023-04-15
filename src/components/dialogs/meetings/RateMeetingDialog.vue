<template>
    <v-dialog v-model="dialog" max-width="500px">
            <v-card :loading="processing ? 'secondary' : false">
                <v-card-title>
                    <span class="text-h5 primary--text text--darken-3">{{ formTitle }}</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="close()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col col="12" sm="12" md="12">
                                    <v-form ref="formDialog" @submit.prevent="rateMeeting">
                                        <base-rating @updated:rating="updateRating"></base-rating>
                                        <v-btn :disabled="processing" block dark type="submit" large class="my-3"
                                            color="secondary">Save</v-btn>
                                    </v-form>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BaseRating from "@/components/base/BaseRating.vue";

export default defineComponent({
    props: {
        meetingId: {
            type: Number,
            required: true
        },
        open: {
            type: Boolean,
            required: false,
            default: false
        },
        formTitle: {
            type: String,
            required: false,
            default: "Provide a rating"
        }
    },
    data() {
        return {
            dialog: false,
            rating: 0,
            processing: false
        }
    },
    components: {
        BaseRating
    },
    watch: {
        async open(val: boolean): Promise<void> {
            this.dialog = val;
            if (!val) {
                this.close();
            } else {
                this.$emit('open:dialog');
            }
        }
    },
    methods: {
        updateRating(value: number): void{
            this.rating = value;
        },
        rateMeeting(): void{
            console.log("rating meeting");
        },
        close() {
            this.dialog = false;
            this.$emit('close:dialog');
        }
    }
});
</script>