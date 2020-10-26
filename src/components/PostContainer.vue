<template>
  <v-container class="text-center">
    <v-row class="mb-4" justify="center">
      <v-btn @click="$router.back()" class="ml-4" color="orange">Back</v-btn>
    </v-row>
    <v-row justify="center">
      <v-card>
        <v-card-title>{{this.postContent.title}}</v-card-title>
        <v-card-subtitle v-html="this.postContent.text"></v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>Posted By {{this.postContent.postedBy}} at {{new Date(postContent.createdAt).toLocaleString('en-US')}}</v-card-text>
      </v-card>
    </v-row>
    <br/>
    <v-row v-if="isAdmin == true" justify="center">
      <v-btn @click="deletePost" color="red">Delete</v-btn>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="6">
        <v-text-field label="Post A Comment" v-model="commentText"></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-btn color="secondary" @click="comment()">Post</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-list>
        <v-list-item v-for="(comment,index) in postContent.comments" :key='index'>{{comment.text}}--{{comment.postedBy}}</v-list-item>
      </v-list>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PostContainer",
  data: function () {
    return {
      postContent: this.$store.state.currentDataSet,
      isAdmin: false,
      commentText: ""
    };
  },
  methods: {
    deletePost() {
      alert(this.postContent);
      console.log(this.postContent);
      this.$http
        .delete(
          `${process.env.VUE_APP_API_URL}/api/delete/posts`,
          this.postContent
        )
        .then((result) => {
          alert(result);
          console.log(result);
        });
    },
    async comment() {
      try {
        var comment = await this.$http.post(`${process.env.VUE_APP_API_URL}/api/post-comment/posts`, {
        comment: {
          postedBy: this.$store.state.userAccount.username,
          text: this.commentText
        },
          post: this.postContent._id
        }, {
          headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
          }
        })
        this.commentText = "";
        this.postContent.comments.push({
          postedBy: this.$store.state.userAccount.username,
          text: this.commentText
        })
      } catch (error) {
        console.log(error)
      }
      
    }
  },
  beforeCreate() {
    // route back if first nav -- help with state
    if (this.$store.state.currentDataSet.hasOwnProperty("title") == false) {
      this.$router.push("/community/posts");
    }

    // delete button
    var account = this.$store.state.userAccount;
      console.log(account);
      this.$http
        .get(
          `${process.env.VUE_APP_API_URL}/api/get/users/?userId=${account.userId}`
        )
        .then((result) => {
          console.log(result);
          if (result.data[0].roles.includes("admin")) {
            console.log(true);
            this.isAdmin = true;
          } else {
            this.isAdmin = false;
          }
        });
    },
};
</script>