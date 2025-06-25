/**Add commentMore actions
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables

import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import ScenarioSelector from '@/layouts/ScenarioSelector.vue'
// import GamePlay from '@/layouts/GamePlay.vue'
import Narrations from '@/layouts/NarrationGame.vue'

const routes = [
  { path: '/', component: ScenarioSelector },
  { path: '/game', name: 'Game', component: Narrations },
]




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})





router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router