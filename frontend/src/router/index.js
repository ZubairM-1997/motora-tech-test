import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from '../components/MainPage.vue';
import UploadImage from '../components/UploadImage.vue';
import UserLoginPage from '../components/UserLoginPage.vue';
import AdminLoginPage from '../components/AdminLoginPage.vue';

const routes = [
  { path: '/main', component: MainPage },
  { path: '/upload', component: UploadImage },
  { path: '/user-login', component: UserLoginPage },
  { path: '/admin-login', component: AdminLoginPage },
  // Add other routes as needed
];


const router = createRouter({
  history: createWebHashHistory(),
  routes,
})


export default router;
