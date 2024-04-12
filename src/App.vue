<template>
  <v-app>
    <v-main class="gradient-background">

      <v-navigation-drawer
        v-if="router.currentRoute.value.name!='login' && router.currentRoute.value.name!='profesorado'" color="#3d3d3d"
        permanent>
        <!--          -->
        <v-list-item-media align="center" class="mt-2 ">
          <v-img aspect-ratio="1/1" width="128" class="rounded"
                 src="@/assets/profe.png">
          </v-img>
        </v-list-item-media>
        <v-list-item title="Ciencias Naturales 🔬💻 TIC" subtitle="Diseñada por la docente Laura Rodriguez Sedeño"></v-list-item>
        <v-divider></v-divider>
        <v-list-item link title="Inicio" to="inicio"></v-list-item>
        <v-list-item link title="Calendario" to="calendario"></v-list-item>
        <v-list-item link title="1º Encuesta" to="encuesta"></v-list-item>
        <v-list-item link title="2º Encuesta" to="encuesta2"></v-list-item>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn @click="logout" block>
              Salir
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import {doc, getDoc} from "firebase/firestore";
import {db} from "./plugins/firebase";
import router from "./router";
import Cookies from "js-cookie";

export default defineComponent({
  name: 'App',
  data: () => ({}),
  mounted() {
    console.log(router.currentRoute.value.name)
  },
  components: {},
  setup() {

    return {router}
  },
  methods: {
    logout() {
      for (let cookie in Cookies.get()) {
        Cookies.remove(cookie);
      }
      router.push("/login")
    }
  }
});
</script>
<style>
.gradient-background {
  /* Define el gradiente de color que va desde la esquina superior izquierda (top left)
     hasta la esquina inferior derecha (bottom right) */
  background: linear-gradient(to bottom right, #9be2ff, #bdf1ac);
}
</style>
