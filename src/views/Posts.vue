<template>
  <v-container>
    <v-row align="center" justify="center">
      <h1>Posts</h1>
    </v-row>
    <v-row align="center" justify="center" fluid  v-for="(post, index) in this.$store.state.posts" :key="index" class='ma-4'>
          <v-card width='60%'>
            <v-card-title>{{post.title}}</v-card-title>
            <v-card-text v-html="post.text.substring(0,256)"></v-card-text>
            <v-card-subtitle>Posted by <strong>{{post.postedBy}}</strong> at {{post.createdAt.toLocaleString()}}</v-card-subtitle>
          </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Posts"
};
</script>