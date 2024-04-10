<script lang="ts">
import Cookies from "js-cookie";
import {defineComponent} from "vue";
import router from "../router";
import {getFirestore, collection, getDocs, doc, updateDoc, deleteField, getDoc} from 'firebase/firestore';
import {alumnosRef, db} from "../plugins/firebase";
import {DoughnutChart} from "vue-chart-3";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);
export default defineComponent({
  name: 'PanelProfesorado',
  components: {DoughnutChart},
  data: () => ({
    search: '',
    tableHeight: 'auto',
    datosMedios: {

      labels: ["No saludable", "Neutro", "Saludable",],
      datasets: [
        {
          data: [2, 1, 3],
          backgroundColor: ['rgba(195,64,81,0.98)', '#46b0dd', '#59af5e'],
        },
      ],
    },
    headers: [
      {
        key: 'nombre',
        title: 'Alumno',
      },
      {
        key: 'calendario',
        title: 'calendario',
      },
      {
        key: 'nota1',
        title: 'Informacion encuesta 1',
      },
      {
        key: 'nota2',
        title: 'Nota encuesta 2',
      },
    ],
    alumnos: []
  }),
  mounted() {
    let nombres = ["Laura Rodriguez Sedeño", "Ana Garcia Perez", "Luisa Hernandez Ramos", "Antonio Fernandez Gomez", "Carlos Guerrero Ruiz",
      "Susana Gomes Dias", "Pedro Martinez Guzman", "José Morales Ramires", "Miguel Belmonte Vera", "Maria Abascal Prado", "Mario Cuenca Lopez",
      "Silvia Marengo Dot", "Adriana Ros Vega", "Rodrigo Lluis Pere", "Ruben Gomez Gonzalo", "Nuria Vega Nuevas", "Antonia Jove Guardiola",
      "Pilar Pinzon Velez", "Alfredo Esteban Giraldo", "Rafael Montes Agudelo", "Alejandro Giraldo Soto", "Cecilia Vela Zamora", "Diana Mendiola Soto", "Eduardo Mendoza Ochoa"];
    let calendarios = ["realizado", "no realizado"];
    let datos = [];
    let totalSaludable = 0
    let totalneutro = 0
    let totaNoSaludable = 0
    for (let i = 0; i < 24; i++) {
      let saludable = Math.floor(Math.random() * 11);
      let neutro = Math.floor(Math.random() * (11 - saludable));
      let no_saludable = 10 - saludable - neutro;
      let nota2 = Math.floor(Math.random() * 11);

      totalSaludable+=saludable
      totalneutro+=neutro
      totaNoSaludable+=no_saludable

      datos.push({
        nombre: nombres[i % nombres.length],
        calendario: calendarios[Math.floor(Math.random() * 2)],
        nota1: "Saludable: " + saludable + ", Neutro: " + neutro + ", No saludable: " + no_saludable,
        nota2: nota2
      });
    }
  this.datosMedios.datasets[0].data[0] = totalSaludable
  this.datosMedios.datasets[0].data[1] = totalneutro
  this.datosMedios.datasets[0].data[2] = totaNoSaludable
    console.log(datos);
    this.alumnos = datos
  },
  setup() {
    return {}
  },
  methods: {
    async reset() {
      // Using database firestore remove property
      const q = collection(db, 'alumnos');
      getDocs(q).then(docu => {
        docu.forEach(result => {
          const docRef = doc(db, "alumnos", result.id);
          // Actualiza el documento
          updateDoc(docRef, {
            "encuesta2": deleteField()
          }).then(() => {
            console.log(`Se eliminó la encuesta2 del documento con ID: ${result.id}`);
          }).catch((error) => {
            console.log(`Error eliminando encuesta2 del documento: `, error);
          });
        })
      })
    },
    logout() {
      Cookies.remove("admin")
      Cookies.remove("app_uid")
      router.push("/")
    },
  },
  computed: {},
});
</script>

<template>
  <v-app-bar :elevation="2" color="primary">

    <v-app-bar-title>Panel del profesor</v-app-bar-title>
    <v-btn prepend-icon="mdi-trash-can"
           @click="reset">
      Reiniciar encuesta 2
    </v-btn>
    <template v-slot:append>
      <!--button for reset all activities -->
      <v-btn @click="logout" icon="mdi-exit-to-app"></v-btn>
    </template>
  </v-app-bar>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" class="pa-2"
             id="contenedor"
             ref="contenedor">
        <v-card
          color="secondary"
          dark
          class="custom-card"
          id="card1"
          ref="card1"
        >
          <v-card-item class="bg-orange-darken-4"
                       id="cabezera"
                       ref="cabezera">
            <v-card-title>
              Alumnos
            </v-card-title>
            <template v-slot:append>
              <v-btn
                color="white"
                icon="mdi-plus"
                size="small"
              ></v-btn>
            </template>
          </v-card-item>

          <v-divider></v-divider>
          <template v-slot:text>
            <v-text-field
              id="cabezera2"
              ref="cabezera2"
              v-model="search"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </template>

          <v-data-table
            class="child"
            :headers="headers"
            :items="alumnos"
            :search="search"
          >
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
        <v-row no-gutters>
          <v-col cols="12" class="pa-2">
            <v-card
            >
              <v-card-title>Resultados globales de la primera encuesta</v-card-title>
              <DoughnutChart class="ma-5" :chartData="datosMedios"/>
            </v-card>
          </v-col>
        </v-row>
  </v-container>
</template>

<style scoped>
.custom-card {
  height: 75vh;
}

.child {
  height: 60vh /* Altura del hijo es el 75% del padre */
}
</style>
