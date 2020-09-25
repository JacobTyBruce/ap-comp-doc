<template>
  <v-container>
  <v-row class='mb-4'>
      <v-btn @click="$router.back()" class='ml-4' color='orange'> Back </v-btn>
    </v-row>
    <v-row>
    <v-card>
      <v-card-title>{{this.docContent.title}}</v-card-title>
      <v-card-subtitle>{{this.docContent.desc}}</v-card-subtitle>
    <v-divider></v-divider>
      <v-card-text v-html="this.docContent.text"></v-card-text>
      <v-card-subtitle><strong v-for="(tag,index) in this.docContent.tags" :key='index' class='ma-2'> {{tag}} </strong></v-card-subtitle>
    </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DocContainer",
  data: function () {
    return {
      docContent: this.$store.state.currentDataSet,
    };
  },
  beforeCreate() {
    if (this.$store.state.currentDataSet.hasOwnProperty("title") == false) {
      this.$router.push("/docs");
    }
  },
};
</script>