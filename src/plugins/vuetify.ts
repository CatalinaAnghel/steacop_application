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
                neutral: '#ffffff',                
                primary: '#00BFA5',
                secondary: '#0091EA',
                warning: '#ff8c42',
                error: '#FF5252',
                accent: '#ffffff',
                success: '#6dbaa1'
            }
        }
    },
});
