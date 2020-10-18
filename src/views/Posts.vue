<template>
  <v-container>
    <v-row align="center" justify="center">
      <h1>Posts</h1>
    </v-row>
    <v-row fluid justify="center">
          <v-card width='40%' v-for="(post, index) in this.$store.state.posts" :key="index" class='ma-4'>
            <v-card-title>{{post.title}}</v-card-title>
            <v-card-text v-html="post.text.substring(0,256)"></v-card-text>
            <v-divider />
            <v-card-subtitle>Posted by <strong>{{post.postedBy}}</strong> at {{new Date(post.createdAt).toLocaleString('en-US')}}</v-card-subtitle>
            <v-divider />
            <v-card-actions class='text-center'> <v-btn color='info' @click="navigate(post)">Read</v-btn></v-card-actions>
          </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Posts",
  methods: {
    navigate: function (post) {
      this.$store.dispatch("commitCurrentDataSet", post);
      this.$router.push({ name: "PostContainer", params: { id: post.title } });
    },
  },
  created() {
    this.$http
      .get(`${process.env.VUE_APP_API_URL}/api/get/posts/?posted=true`)
      .then((response) => {
        this.$store.dispatch("commitPosts", response.data);
      })
      .catch(() => {
        alert("error getting posts");
      });
  }
};
</script>