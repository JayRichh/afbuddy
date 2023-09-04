import { createApp } from 'vue';
import i18n from '../../i18n';
import 'vuetify/dist/vuetify.min.css';
import naive from 'naive-ui';
import App from './App.vue';

const app = createApp(App);
app.use(naive);
app.use(i18n);

import('../utils/store/store').then((storeModule) => {
  const store = storeModule.default;
  store.dispatch('initializeStore');
  app.use(store);
  app.mount('#app');
});
