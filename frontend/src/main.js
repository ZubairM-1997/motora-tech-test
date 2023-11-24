import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';

// Create a Vue app instance
const app = createApp(App);

// Use the router
app.use(router);

// Mount the app to the element with id 'app'
app.mount('#app');
