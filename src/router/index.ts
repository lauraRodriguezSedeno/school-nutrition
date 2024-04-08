/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import {createRouter, createWebHashHistory,} from 'vue-router'
import Login from '../pages/Login.vue'
import Calendario from '../pages/Calendario.vue'
import Encuesta from '../pages/Encuesta1.vue'
import Encuesta2 from '../pages/Encuesta2.vue'
import Cookies from 'js-cookie'
import PanelProfe from "../pages/PanelProfesorado.vue";

const routes = [
  {
    path: '/', redirect: {name: "calendario"}, name: 'home',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profesorado', component: PanelProfe, name: 'profesorado',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login', component: Login, name: 'login'
  },
  {
    path: '/calendario', name: 'calendario', component: Calendario,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/encuesta', name: 'encuesta', component: Encuesta,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/encuesta2', name: 'encuesta2', component: Encuesta2,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: {name: "calendario"}
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  // Comprueba si la ruta requiere autenticación y el usuario no está logueado.
  const admin = Cookies.get('admin');  // suponiendo que 'admin' es la clave que estás utilizando.
  const app_uid = Cookies.get('app_uid');
  if (to.matched.some(record => record.meta.requiresAuth) && !app_uid) {
    // Redirige al login.
    next({name: 'login'})
  } else if (admin === 'true') {
    if (to.path !== '/profesorado') {
      next({path: '/profesorado'});
    } else {
      next();
    }
  } else if (app_uid && to.path === '/profesorado') {
    next({path: '/calendario'});
  } else {
    next();  // en otro caso, simplemente sigue a la ruta a la que se intenta.
  }

})


export default router
