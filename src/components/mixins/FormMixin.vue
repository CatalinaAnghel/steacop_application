<script lang="ts">
require('@/validation/index');

import { ValidationObserver, ValidationProvider } from "vee-validate";
import BaseAlert from "../alerts/BaseAlert.vue";

import Vue from 'vue'
import { ResponseDto } from "@/modules/common";

import { ERROR_SERVER } from '@/common/errors';
import { SUCCESS_UPDATE_MESSAGE } from '@/common/constants';

export default Vue.extend({
    data() {
        return {
            loading: false,
            valid: false,
            showAlert: false,
            color: '',
            alertMessage: ''
        }
    },
    components: {
        ValidationProvider,
        ValidationObserver,
        BaseAlert
    },
    methods: {
        toggleLoader(): void {
            this.loading = !this.loading;
        },
        updateShowAlert(value: boolean): void {
            this.showAlert = value;
        },
        handleResponse(requestStatus: ResponseDto, successMessage :string|false = false, applyLoader: boolean|true = true): void {
            this.showAlert = true;
            if (requestStatus.success) {
                this.color = 'light-blue accent-4';
                this.alertMessage = !successMessage? SUCCESS_UPDATE_MESSAGE: successMessage;
            } else {
                this.color = 'red accent-2';
                this.alertMessage = ERROR_SERVER;
            }
            if(applyLoader){
                this.toggleLoader();
            }
            
        }
    }
});
</script>