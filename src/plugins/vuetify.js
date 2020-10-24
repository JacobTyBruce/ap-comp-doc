import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: {
            customProperties: true
        },
        themes: {
            light: {
                background: '#FFFFFF',
                primary: '#0f4c75',
                secondary: '#F4F3EE',
                accent: '#FBEACA'
            },
            dark: {
                background: "#121212",
                primary: '#0f4c75',
                secondary: '#1E1E1E',
                accent: '#FFFFFF'
            }
        }
    }
});
