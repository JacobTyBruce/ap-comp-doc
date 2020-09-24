<template>
  <v-container>
    <v-row class='mb-4'>
      <v-btn @click="$router.back()" class='ml-4' color='orange'> Back </v-btn>
    </v-row>
    <v-row>
      <v-card>
        <v-card-title>{{ this.challegeContent.title }}</v-card-title>
        <v-card-subtitle>{{ this.challegeContent.desc }}</v-card-subtitle>
        <v-divider />
        <pre v-html="this.challegeContent.challenge" class="ma-4"></pre>
        <v-divider />
        <v-card-title> Explaination & Help </v-card-title>
        <v-card-text v-html="this.challegeContent.text"></v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DocContainer",
  data: function() {
    return {
      challegeContent: this.$store.state.currentDataSet,
    };
  },
  beforeCreate() {
    if (this.$store.state.currentDataSet.hasOwnProperty("title") == false) {
      this.$router.push("/challenges");
    }
  },
};
</script>
