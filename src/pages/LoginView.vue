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
                        <p class="red--text accent-2--text text-center" v-if="invalidCredentials">Invalid credentials</p>
                        <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
                            <v-form v-model="valid" @submit.prevent="handleSubmit(login)">
                                <validation-provider rules="required|email" v-slot="{ errors }">
                                    <v-text-field label="Email" hide-details="auto" v-model="email" :error-messages="errors"
                                        class="mt-3" @input="hideErrorMessage"></v-text-field>
                                </validation-provider>
                                <validation-provider rules="required|min:4" v-slot="{ errors }" name="Password">
                                    <v-text-field label="Password" hide-details="auto" v-model="password" type="password"
                                        :error-messages="errors" class="mt-3" @input="hideErrorMessage"></v-text-field>
                                </validation-provider>
                                <v-btn color="secondary" block :dark="!invalid" type="submit" :disabled="invalid" large
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
import AuthService from "@/services/auth-service"
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { eventBus } from "@/main";
import { EVENT_BUS_AUTH } from "@/common/constants";

export default defineComponent({
    data: () => {
        return {
            valid: false,
            email: "",
            password: "",
            loading: false,
            invalidCredentials: false,
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
            this.toggleLoader();
            if (response.success) {
                this.invalidCredentials = false;
                eventBus.$emit(EVENT_BUS_AUTH);
                this.$router.push({ name: "home" });
            } else {
                this.invalidCredentials = true;
                console.error(response.error);
            }
        },
        toggleLoader(): void {
            this.loading = !this.loading;
        },
        hideErrorMessage(): void {
            this.invalidCredentials = false;
        }
    }
});
</script>
