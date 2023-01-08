<template>
    <v-row justify="center" class="py-16">
        <v-col cols="10" sm="10" md="12" lg="6" xl="6">
            <v-card elevation="3" :loading="loading">
                <v-row justify="center" class="pt-3">
                    <v-col cols="auto">
                        <h2>Login</h2>
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col cols="8">
                        <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
                            <v-form v-model="valid" @submit.prevent="handleSubmit(login)">
                                <validation-provider rules="required|email" v-slot="{ errors }">
                                    <v-text-field label="Email" hide-details="auto" v-model="email"
                                        :error-messages="errors" class="mt-3"></v-text-field>
                                </validation-provider>
                                <validation-provider rules="required|min:4" v-slot="{ errors }" name="Password">
                                    <v-text-field label="Password" hide-details="auto" v-model="password"
                                        type="password" :error-messages="errors" :hint="hints.password"
                                        class="mt-3"></v-text-field>
                                </validation-provider>
                                <v-btn color="teal" :dark="!invalid" type="submit" :disabled="invalid" large
                                    class="my-3" @click="toggleLoader">Log
                                    in</v-btn>
                            </v-form>
                        </validation-observer>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
require('@/validation/index')
import { defineComponent } from "vue"
import AuthService from "@/services/AuthService"
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default defineComponent({
    data: () => {
        return {
            valid: false,
            email: "",
            password: "",
            hints: {
                password: "Password must contain symbols, numbers and upper and lower case characters"
            },
            loading: false
        }
    },
    components: {
        ValidationProvider,
        ValidationObserver
    },
    methods: {
        async login(): Promise<void> {
            const response = await AuthService.login({
                email: this.email,
                password: this.password
            });

            if (response.success) {
                this.loading = !this.loading;
                this.$router.push({ name: "home" });
            }
        },
        toggleLoader(): void {
            this.loading = !this.loading;
        }
    }
});
</script>
