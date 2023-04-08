import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: {
            customProperties: true
        },
        themes: {
            light: {
                // primary: '#004D40',
                // secondary: '#00BFA5',
                // warning: '#ff8c42',
                // error: '#ff5252',
                // accent: '#3854c8',
                // success: '#6dbaa1',
                neutral: '#ffffff',                
                primary: '#6dbaa1',
                secondary: '#8186f1',
                warning: '#ff8c42',
                error: '#ff5252',
                accent: '#ffffff',
                success: '#6dbaa1'
            }
        }
    },
});
