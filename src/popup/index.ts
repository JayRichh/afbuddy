import { createApp } from 'vue';
import { i18n } from '../../i18n';
import store from '../utils/store/store';
import naive from 'naive-ui';
import App from './App.vue';

const app = createApp(App);
app.use(naive);
app.use(store);
app.use(i18n);
app.mount('#app');
