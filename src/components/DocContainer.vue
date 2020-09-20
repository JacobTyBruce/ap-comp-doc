<template>
  <v-container>
    <v-card>
      <v-card-title>{{this.docContent.title}}</v-card-title>
      <v-card-subtitle>{{this.docContent.desc}}</v-card-subtitle>
    </v-card>
    <v-divider></v-divider>
    <v-card>
      <v-card-text>{{this.docContent.text}}</v-card-text>
    </v-card>
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