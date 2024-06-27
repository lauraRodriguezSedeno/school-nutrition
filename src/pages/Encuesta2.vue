<script lang="ts">
import {defineComponent} from "vue";
import {useRoute} from "vue-router";
import {doc, getDoc, setDoc, updateDoc, deleteField} from "firebase/firestore";
import {db} from "../plugins/firebase";
import {preguntas1, preguntas2, preguntaTest} from "../utils/preguntas";
import Cookies from "js-cookie";

export default defineComponent({
  name: 'Encuesta',

  computed: {},
  data: () => ({
    ejercicioTerminado: false,
    preguntas: preguntas2,
    puntos: new Map<number, boolean>(),
    respuestas: [],
    pressedKeys: "",
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
    user: undefined,
    userUID: undefined,
    nota: 0,
  }),
  mounted() {
    this.fillUser()
    this.pressedKeys = ""
    window.addEventListener('keydown', this.keydownHandler);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keydownHandler);
  },
  components: {},
  methods: {
    useRoute,
    async fillUser() {
      this.userUID = Cookies.get("app_uid")
      const docRef = doc(db, "alumnos", this.userUID); // nombre del documento
      const data = (await getDoc(docRef)).data();
      this.user = data
      console.log(data)
      if (data.encuesta2) {
        this.nota = data.encuesta2
        this.ejercicioTerminado = true
      } else {
        this.ejercicioTerminado = false
      }
    },
    async resetForm() {
      const docRef = doc(db, "alumnos", this.userUID);
      await updateDoc(docRef, {
        encuesta1: deleteField()
      });
      this.fillUser()
    },
    async submit() {
      let total = 0
      for (const value of this.puntos.values()) {
        if (value) {
          total += 1
        }
      }
      this.nota = this.calcularNotaSobreDiez( total)

      const docRef = doc(db, "alumnos", this.userUID);
      await setDoc(docRef, {
        encuesta2:  this.nota // cambia 'newField' y 'newValue' con el nombre del campo y el valor que deseas añadir.
      }, {merge: true});  // Use la opción merge: true para fusionar los datos en lugar de sobrescribir.
      this.ejercicioTerminado = true
    },
    cambiarRespuesta(item: any, preguntaSeleccionada, index: number) {
      this.puntos.set(index, item.respuestas.find(value => preguntaSeleccionada == value.titulo).correcta)
    },
    calcularNotaSobreDiez(notaObtenida) {
      return (notaObtenida / 10) * 10;
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
        let rnd = Math.floor(Math.random() * 2);
        console.log(rnd);
        let it = item.respuestas[rnd];
        console.log(it)
        this.puntos.set(i, it.correcta);
      }
      this.submit()
      this.pressedKeys = "";
    },
  }
});
</script>

<template>
  <v-container fill-height fluid class="d-flex fill-height align-center justify-center">
    <v-card color="#FAFAFA" v-if="!ejercicioTerminado" class="flex-grow-1">
      <v-card-title>Hábitos saludables y no saludables para la salud</v-card-title>
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
              @update:modelValue="cambiarRespuesta(preguntas[i-1], respuestas[i-1], i-1)"
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
    <v-card class="text-center gradient-light-green fill-width" dark v-if="ejercicioTerminado">
      <v-card-title>
        ¡Felicidades!
      </v-card-title>
      <v-card-text class="headline ml-16 mr-xl-16">
        Ya tienes este ejercicio terminado, tu nota es un {{nota}}
      </v-card-text>
    </v-card>
  </v-container>

</template>

<style scoped>

</style>
