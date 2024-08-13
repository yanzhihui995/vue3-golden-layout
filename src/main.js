import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// import router from './router';
import { createPinia } from 'pinia';
import './assets/styles/global.css'; // Import the global styles
import 'golden-layout/dist/css/themes/goldenlayout-dark-theme.css';
import 'golden-layout/dist/css/goldenlayout-base.css';



const app = createApp(App)
const pinia = createPinia();
app.use(ElementPlus)
// app.use(router);
app.use(pinia);


app.mount('#app')
