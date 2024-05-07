import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Hls from 'hls.js';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App)
  .use(router)
  .use(vuetify);

// Configura Hls come plugin di Vue
app.config.globalProperties.$Hls = Hls;

app.mount('#app');