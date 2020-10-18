<template>
  <v-container>
    <v-row class='mb-4'>
      <v-btn @click="$router.back()" class='ml-4' color='orange'> Back </v-btn>
    </v-row>
    <v-row justify="center">
      <v-card min-width="60%">
        <v-card-title>{{ this.challengeContent.title }}</v-card-title>
        <v-card-subtitle>{{ this.challengeContent.desc }}</v-card-subtitle>
        <v-divider />
        <pre v-html="this.challengeContent.challenge" class="ma-4"></pre>
        <v-divider />
        <v-card-title> Explaination & Help </v-card-title>
        <v-card-text v-html="this.challengeContent.text"></v-card-text>
      </v-card>
    </v-row>
    <v-row justify="center">
      <p> Last Update: {{new Date(this.challengeContent.updatedAt).toLocaleString('en-US')}} </p>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DocContainer",
  data: function() {
    return {
      challengeContent: this.$store.state.currentDataSet,
    };
  },
  beforeCreate() {
    if (this.$store.state.currentDataSet.hasOwnProperty("title") == false) {
      this.$router.push("/challenges");
    }
  },
};
</script>
