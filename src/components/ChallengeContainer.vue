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
    <br/>
    <v-row v-if="isAdmin == true" justify="center">
      <v-btn @click="deleteChallenge" color="red">Delete</v-btn>
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
        <v-list-item v-for="(comment,index) in challengeContent.comments" :key='index'>{{comment.text}}--{{comment.postedBy}}</v-list-item>
      </v-list>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DocContainer",
  data: function () {
    return {
      challengeContent: this.$store.state.currentDataSet,
      isAdmin: false,
      commentText: ""
    };
  },
  methods: {
    deleteChallenge() {
      console.log(this.challengeContent);
      this.$http
        .delete(
          `${process.env.VUE_APP_API_URL}/api/delete/challenges`,
          this.postContent
        )
        .then((result) => {
          alert(result);
          console.log(result);
        });
    },
    async comment() {
      try {
        var comment = await this.$http.post(`${process.env.VUE_APP_API_URL}/api/post-comment/challenges`, {
        comment: {
          postedBy: this.$store.state.userAccount.username,
          text: this.commentText
        },
          post: this.postContent._id
        }, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`
          }
        })
        // update comments, oush current user ones in case fetch fails, then run fetch to get new ones and update entire obj
        this.postContent.comments.push({
          postedBy: this.$store.state.userAccount.username,
          text: this.commentText
        })
        this.commentText = "";
        // run fetch
        try {
          var fetch = await this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/challenges/?title=${this.challengeContent.title}`)
          console.log(fetch)
          this.challengeContent = fetch.data[0];
        } catch (err) {
          // error if fetch fails
          console.log(err)
        }
        console.log('Method Done')
      } catch (error) {
        // error if post fails
        console.log(error)
      }
      
    }
  },
  beforeCreate() {
    // route back if first nav -- help with state
    if (this.$store.state.currentDataSet.hasOwnProperty("title") == false) {
      this.$router.push("/challenges");
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
