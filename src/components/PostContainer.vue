<template>
  <v-container class='text-center'>
  <v-row class='mb-4' justify="center">
      <v-btn @click="$router.back()" class='ml-4' color='orange'> Back </v-btn>
    </v-row>
    <v-row justify="center">
    <v-card>
      <v-card-title>{{this.postContent.title}}</v-card-title>
      <v-card-subtitle v-html="this.postContent.text"></v-card-subtitle>
    <v-divider></v-divider>
      <v-card-text>Posted By {{this.postContent.postedBy}} at {{new Date(postContent.createdAt).toLocaleString('en-US')}}</v-card-text>
    </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PostContainer",
  data: function () {
    return {
      postContent: this.$store.state.currentDataSet,
    };
  },
  beforeCreate() {
    if (this.$store.state.currentDataSet.hasOwnProperty("title") == false) {
      this.$router.push("/community/posts");
    }
  },
};
</script>