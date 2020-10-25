<template>
  <v-container>
    <v-row align="center">
      <v-col class="text-center">
        <h1>AP Computer Science Documentation</h1>
      </v-col>
    </v-row>
    <v-col class="text-center">
      <v-divider/>
      <h1>New Posts</h1>
      <v-divider/>
    </v-col>
    <v-row>
      <v-carousel cycle :show-arrows="false" hide-delimiter-background delimiter-icon="mdi-minus">
        <v-carousel-item v-for="(slide, i) in latestPosts" :key="i" @click="navigate(slide)">
          <v-sheet height="100%" tile>
            <v-row class="fill-height" align="center" justify="center">
              <v-card flat class="ma-2">
                <v-card-title>{{slide.title}}</v-card-title>
                <v-card-subtitle>{{slide.desc}}</v-card-subtitle>
                <v-card-text v-html="slide.challenge"></v-card-text>
                <v-card-text v-html="slide.text"></v-card-text>
              </v-card>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  data: function() {
    return {
      latestPosts: []
    }
  },
  async created() {
  // get posts/docs/challenges to get latest post
    try {
      var allPosts = await this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/posts/?posted=true`)
      var allDocs = await this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/docs/?posted=true`)
      var allChallenges = await this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/challenges/?posted=true`)
      this.latestPosts.push(allPosts.data[0], allDocs.data[0], allChallenges.data[0])
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    navigate: function (post) {
      var type = (post.hasOwnProperty('challenge')) ? 'Challenge' : (post.hasOwnProperty('desc')) ? 'Doc' : 'Post';
        this.$store.dispatch("commitCurrentDataSet", post);
        setTimeout(() => {
          this.$router.push({ name: type+"Container", params: { id: post.title } });
        }, 100)
      },
  }
};
</script>
