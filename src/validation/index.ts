import { extend } from 'vee-validate';
import { required, email, min, max_value, min_value, between, regex, mimes } from 'vee-validate/dist/rules';

interface ValidationRuleInterface {
    params: string[];
    validate: (value: string | number | (string | number)[]) => boolean;
    message: string;
}

extend('required', {
    ...required,
    message: 'This field is required'
});

extend('email', {
    ...email,
    message: 'Invalid email address'
});

extend('min', {
    ...min,
    message: '{_field_} must have at least {length} characters'
});

extend('min_value', {
    ...min_value,
});

extend('max_value', {
    ...max_value,
});

extend('between', {
    ...between,
});

extend('regex', {
    ...regex,
});

extend('mimes', {
    ...mimes,
    message: "{_field_} not valid"
});

extend('valid_weight', {
    params: ['target'],
    // eslint-disable-next-line
    validate: function (value: string | number | (string | number)[], { target }: any) : boolean{
        const total = Number(value) + Number(target);
        return total <= 100 && total > 0;
    },
    message: "Invalid weight"
} as ValidationRuleInterface);