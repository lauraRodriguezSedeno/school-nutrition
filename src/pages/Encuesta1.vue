<script lang="ts">
import {defineComponent} from "vue";
import {useRoute} from "vue-router";
import {doc, getDoc, setDoc, updateDoc, deleteField} from "firebase/firestore";
import {alumnosRef, db} from "../plugins/firebase";
import {preguntas1, preguntaTest} from "../utils/preguntas";
import {ref} from "vue";
import {DoughnutChart} from "vue-chart-3";
import {Chart, registerables} from "chart.js";
import Cookies from "js-cookie";

Chart.register(...registerables);
export default defineComponent({
  name: 'Encuesta',

  computed: {},
  data: () => ({
    pressedKeys: "",
    preguntas: preguntas1,
    puntos: new Map<number, String>(),
    total: new Map<number, number>([
      [0, 0],
      [1, 0],
      [2, 0],
    ]),
    testData: {

      labels: ["No saludable", "Neutro", "Saludable",],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['rgba(195,64,81,0.98)', '#46b0dd', '#59af5e'],
        },
      ],
    },
    respuestas: [],
    rules: [
      value => {
        if (value) return true
        return 'No puede estar vacío'
      },
    ],
    respuestas0: undefined,
    respuestas1: undefined,
    respuestas2: undefined,
    respuestas3: undefined,
    respuestas4: undefined,
    respuestas5: undefined,
    respuestas6: undefined,
    respuestas7: undefined,
    respuestas8: undefined,
    respuestas9: undefined,
    showQuestions: false,
    showDonut: false,
    user: undefined,
    userUID: undefined,
  }),
  mounted() {
    this.fillUser()
    this.pressedKeys = ""
    window.addEventListener('keydown', this.keydownHandler);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keydownHandler);
  },
  components: {DoughnutChart},
  methods: {
    useRoute,
    async fillUser() {
      this.userUID = Cookies.get("app_uid")
      const docRef = doc(db, "alumnos", this.userUID); // nombre del documento
      const data = (await getDoc(docRef)).data();
      this.user = data
      console.log(data)
      if (data.encuesta1) {
        this.testData.datasets[0].data[0] = data.encuesta1[0]
        this.testData.datasets[0].data[1] = data.encuesta1[1]
        this.testData.datasets[0].data[2] = data.encuesta1[2]
        this.showDonut = true
        this.showQuestions = false
      } else {
        this.showDonut = false
        this.showQuestions = true
      }
      console.log(data)
    },
    async resetForm() {
      const docRef = doc(db, "alumnos", this.userUID);
      await updateDoc(docRef, {
        encuesta1: deleteField()
      });
      this.fillUser()
    },
    async submit() {
      this.total = 0
      this.testData.datasets[0].data[0] = 0;
      this.testData.datasets[0].data[1] = 0;
      this.testData.datasets[0].data[2] = 0;
      for (const value of this.puntos.values()) {
        this.testData.datasets[0].data[value] += 1
      }
      const docRef = doc(db, "alumnos", this.userUID);
      await setDoc(docRef, {
        encuesta1: {
          0: this.testData.datasets[0].data[0],
          1: this.testData.datasets[0].data[1],
          2: this.testData.datasets[0].data[2],
        } // cambia 'newField' y 'newValue' con el nombre del campo y el valor que deseas añadir.
      }, {merge: true});  // Use la opción merge: true para fusionar los datos en lugar de sobrescribir.
      this.showQuestions = false
      this.showDonut = true
    },
    cambiarPuntos(item: preguntaTest, preguntaSeleccionada, index: number) {
      this.puntos.set(index, item.respuestas.find(value => preguntaSeleccionada == value.titulo).puntos)
    },
    keydownHandler(e) {
      this.pressedKeys += e.key;
      if (this.pressedKeys.toLowerCase() === "vic") {
        this.executeFunction();
      } else if (!"vic".startsWith(this.pressedKeys.toLowerCase())) {
        console.log(this.pressedKeys);
        this.pressedKeys = ""
        console.log("Pressed Keys reset")
      }
    },
    executeFunction() {
      // Manejo del comando invisible aquí
      // Luego podrías querer resetear el string de teclas presionadas
      let autoRespuestas = ['respuesta0', 'respuesta1', 'respuesta2', 'respuesta3', 'respuesta4', 'respuesta5', 'respuesta6', 'respuesta7', 'respuesta8', 'respuesta9'];
      for (let i=0; i<10; i++) {
        this['respuestas'+i] = autoRespuestas[i];
        let item = this.preguntas[i];
        let rnd = Math.floor(Math.random() * 3);
        console.log(rnd);
        let it = item.respuestas[rnd];
        console.log(it)
        this.puntos.set(i, it.puntos);
      }
      this.submit()
      this.pressedKeys = "";
    },
  }
});
</script>

<template>
  <v-container fill-height fluid>
    <v-card v-if="showQuestions" color="#FAFAFA">
      <v-card-title>Acciones beneficiosas o perjudiciales para la salud</v-card-title>
      <form class="mt-4" @submit.prevent="submit">
        <v-row
          v-for="i in 10"
          :key="preguntas[i-1]"
          align="center"
          justify="center">

          <v-col cols="8">
            <v-select
              color="info"
              base-color="info"
              :key="preguntas[i-1]"
              v-model="respuestas[i-1]"
              :items="preguntas[i-1].respuestas.map(value => value.titulo)"
              :label="preguntas[i-1].pregunta"
              required
              @update:modelValue="cambiarPuntos(preguntas[i-1], respuestas[i-1], i-1)"
            >
            </v-select>
          </v-col>

        </v-row>

        <v-row align="center"
               justify="center">
          <v-col align="center"
                 justify="center" cols="8">
            <v-btn color="info" variant="outlined"
                   class="me-4 mb-4"
                   type="submit"
            >
              GUARDAR
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </v-card>
    <v-card v-if="showDonut">
      <v-card-title>Estos son tus resultados</v-card-title>
      <DoughnutChart :chartData="testData"/>
      <v-row  align="center"
              justify="center">
        <v-col align="center"
               justify="center" cols="12">
          <v-btn @click="resetForm()" color="accent" class="ma-4"> Reiniciar prueba</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>

</template>

<style scoped>

</style>
