<template>
  <v-container>
    <v-row align="center" justify="center">
      <h1>Posts</h1>
    </v-row>
    <v-row fluid justify="center">
      <v-col
      v-for="(post, index) in this.$store.state.posts" 
      :key="index"
      cols="12"
      sm="6"
      md="6"
      lg="6"
      xl="4"
      >
        <v-card class='ma-4' color="secondary">
            <v-card-title :class="headerColor">{{post.title}}</v-card-title>
            <v-card-text v-html="post.text.substring(0,256)"></v-card-text>
            <v-divider />
            <v-card-subtitle>Posted by <strong>{{post.postedBy}}</strong> at {{new Date(post.createdAt).toLocaleString('en-US')}}</v-card-subtitle>
            <v-divider />
            <v-card-actions class='text-center'> <v-btn color='info' @click="navigate(post)">Read</v-btn></v-card-actions>
          </v-card>
      </v-col>
          
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Posts",
  computed: {
    headerColor: function() {
      return (this.$vuetify.theme.dark) ? 'secondary mb-1' : 'secondary darken-1 mb-1'
    }
  },
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