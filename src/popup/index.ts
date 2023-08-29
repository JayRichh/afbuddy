import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import i18n from '../../i18n';

const vuetify = createVuetify();

const app = createApp(App);

app.use(vuetify);
app.use(i18n);

app.mount('#app');
