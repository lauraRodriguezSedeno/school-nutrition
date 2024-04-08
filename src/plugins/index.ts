/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'

// Types
import type { App } from 'vue'
import { firebaseApp } from './firebase'
import { VueFire, VueFireAuth } from 'vuefire'
export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(VueFire, {
      // imported above but could also just be created here
      firebaseApp,
      modules: [
        // we will see other modules later on
        VueFireAuth(),
      ],
    })

}
