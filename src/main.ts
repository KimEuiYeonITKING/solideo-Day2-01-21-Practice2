import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Leaflet CSS 임포트 (중요!)
import 'leaflet/dist/leaflet.css';

const app = createApp(App);

app.use(router);

app.mount('#app');
