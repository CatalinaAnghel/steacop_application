import { extend } from 'vee-validate';
import { required, email, min, max_value, min_value, between } from 'vee-validate/dist/rules';

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