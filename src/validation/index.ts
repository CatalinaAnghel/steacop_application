import { extend } from 'vee-validate';
import { required, email, min } from 'vee-validate/dist/rules';

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
    message: '{_field_} must have more than {length} characters'
});

// extend('password',  value: string => {
//     if()
// });