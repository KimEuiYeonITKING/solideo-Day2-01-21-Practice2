import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import ResultPage from '../pages/ResultPage.vue';

/**
 * Vue Router 설정
 *
 * GitHub Pages 배포를 위해 createWebHashHistory를 사용합니다.
 * Hash 모드를 사용하면 서버 설정 없이도 SPA 라우팅이 정상 작동합니다.
 *
 * 만약 서버에서 적절한 리다이렉션 설정을 할 수 있다면,
 * createWebHistory()를 사용할 수도 있습니다.
 */

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/result',
      name: 'result',
      component: ResultPage,
    },
  ],
});

export default router;
