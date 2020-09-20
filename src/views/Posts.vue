<template>
  <v-container>
    <v-row align="center" justify="center">
      <h1>Posts</h1>
    </v-row>
    <v-row align="center" justify="center" fluid  v-for="(posts, index) in this.$store.state.posts" :key="index" class='ma-4'>
          <v-card width='500px'>
            <v-card-title></v-card-title>
          </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Posts",
};
</script>