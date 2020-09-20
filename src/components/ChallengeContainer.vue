<template>
  <v-container>
    <v-card>
      <v-card-title>{{this.challegeContent.title}}</v-card-title>
      <v-card-subtitle>{{this.challegeContent.desc}}</v-card-subtitle>
    </v-card>
    <v-divider></v-divider>
    <v-card>
        <v-card-text v-html="this.challegeContent.challenge"></v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "DocContainer",
  data: function() {
    return {
      challegeContent: this.$store.state.currentDataSet
    }
  },
  beforeCreate() {
    if(this.$store.state.currentDataSet.hasOwnProperty('title') == false) {
    this.$router.push('/challenges')
  }
  }
};
</script>