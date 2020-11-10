<<template>
  <v-container>
    <h1>Create a Challenge</h1>
    <v-form>
      <v-text-field label="Title" v-model="title" />
      <v-textarea label='Description' v-model="desc" />
      <v-textarea label="Challenge" v-model="challenge" />
      <v-textarea label="Text/Explanation" v-model="text" />
      <v-checkbox label="Post Immediately?" v-model="post" />
      <v-btn color='blue' @click="submitReview()"> Submit</v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: "PostCreator",
  data: function () {
    return {
      title: "",
      desc: "",
      challenge: "",
      text: "",
      post: false,
    };
  },
  methods: {
    submitReview() {
      alert("Subit Request Made");
      var request = {
        title: this.title,
        desc: this.desc,
        challenge: this.challenge,
        text: this.text,
        posted: this.post,
      };
      this.$http
        .post(`${process.env.VUE_APP_API_URL}/api/post/challenges`, request, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        })
        .then((data) => {
          alert(data);
          this.title = "";
          this.text = "";
          this.desc = "";
          this.challenge = "";
          this.post = false;
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>