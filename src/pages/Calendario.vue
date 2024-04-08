<script lang="ts">
import {defineComponent} from "vue";
import {useRoute} from "vue-router";
import {alumnosRef} from "../plugins/firebase";
import {doc, getDoc} from 'firebase/firestore'
import CalendarDay from "../components/CalendarDay.vue";

export default defineComponent({
  name: 'Calendario',
  data: () => ({
    nombre: 'laurita',
    edad: undefined,
    tab: null,
  }),
  mounted() {
    //this.fillUser()
  },
  components: {CalendarDay},
  methods: {
    useRoute,
    async fillUser() {
      let data = (await getDoc(doc(alumnosRef, useRoute().query.id as string))).data()
      console.log(data)
      this.edad = data.edad
      this.nombre = data.nombre
    }
  }
});
</script>

<template>
  <v-app-bar :elevation="2">
    <v-app-bar-title>Calendario semanal</v-app-bar-title>
  </v-app-bar>
  <v-container>
    <v-card>
      <v-tabs
        v-model="tab"
        align-tabs="center"
        color="primary"
      >
        <v-tab :value="1">Miercoles | 18</v-tab>
        <v-tab :value="2">Jueves | 19</v-tab>
        <v-tab :value="3">Viernes | 20</v-tab>
        <v-tab :value="4">Sabado | 21</v-tab>
        <v-tab :value="5">Domingo | 22</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item v-for="n in 5"
                       :key="n"
                       :value="n">
          <CalendarDay/>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

