import { createApp, defineAsyncComponent } from 'vue';
import i18n from '../../i18n';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import store from '../utils/store';

const vuetify = defineAsyncComponent(() =>
  import('vuetify').then((m) => m.createVuetify()),
);
const App = defineAsyncComponent(() => import('./App.vue'));

const app = createApp(App);

app.use(vuetify);
app.use(i18n);
app.use(store);

app.mount('#app');
