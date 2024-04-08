<template>
  <v-container fluid>
    <v-row>
      <v-col
          cols="12"
          md="6">
        <v-text-field label="Desayuno"></v-text-field>
      </v-col>
      <v-col
          cols="12"
          md="6">
        <v-text-field label="Almuerzo"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col
          cols="12"
          md="6">
        <v-text-field label="Merienda"></v-text-field>
      </v-col>
      <v-col
          cols="12"
          md="6">
        <v-text-field label="Cena"></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
export default {
  name: 'CalendarDay'
}
</script>