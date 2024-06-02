<script lang="ts">
import {defineComponent} from 'vue'
import router from "../router/index";
import Cookies from "js-cookie";
import {db} from '../plugins/firebase'
import {getDoc, doc} from "firebase/firestore";
import {tr} from "vuetify/locale";

export default defineComponent({
  name: 'Login',
  data: () => ({
    timeout: -1,
    userName: '',
    loading: false,
    errorText: '',
    errorExist: false,
    showPasswordField: false,
    password: ""
  }),
  mounted() {
  },
  components: {},
  setup() {
    return {}
  },
  methods: {
    async submit() {
      this.loading = true
      if (this.userName.length < 1) {
        this.loading = false
        return
      }
      if (this.userName == "profesor") {
        if (this.password == "claveprofe") {
          console.log("voy al panel profe")
          Cookies.set("admin", true)
          Cookies.set("app_uid", "profesor")
          this.loading = false
          this.errorExist = false
          router.push("/profesorado")
          return
        } else {
          this.errorExist = true
          this.errorText = "Te has equivocado de contraseña profe"
          this.loading = false
        }

      }
      const docRef = doc(db, "alumnos", this.userName); // nombre del documento
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        Cookies.set('app_uid', this.userName)
        Cookies.set('data', JSON.stringify(docSnap.data()))
        this.errorExist = false
        this.loading = false
        router.push("/")
      } else {
        this.errorExist = true
        this.errorText = "El usuario no existe"
        this.loading = false
      }
    },
  }
});
</script>

<template>
  <v-container fill-height fluid>
    <v-row align="center"
           justify="center">
      <v-col>
        <v-alert v-if="errorExist"
                 title="Error iniciando sesion"
                 :text="errorText"
                 type="error"
                 variant="tonal"
        ></v-alert>
      </v-col>
    </v-row>
    <v-row align="center"
           justify="center">
      <v-col>
        <v-card class="mx-auto" max-width="400" title="Inicio de sesion">
          <v-form validate-on="submit lazy" @submit.prevent="submit">
            <v-card-item>
              <v-text-field
                @input="() => {showPasswordField = userName == 'profesor'}"
                v-model="userName"
                label="Nombre"
                hint="nombre_primerApellido_segundoApellido"
              ></v-text-field>

              <v-text-field
                v-if="showPasswordField"
                v-model="password"
                type="password"
                label="Contraseña"
              ></v-text-field>
            </v-card-item>
            <v-card-actions>
              <v-btn
                :loading="loading"
                class="mt-2"
                text="¡Vamos alla!"
                type="submit"
                block
              ></v-btn>

            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<style scoped>

</style>
