import { createApp } from "vue";
import App from "./App.vue";
// import axios from 'axios';
// import VueAxios from 'vue-axios';

const app = createApp(App);

// Use axios and vue-axios globally
// app.use(VueAxios, axios);

app.mount("#app");
