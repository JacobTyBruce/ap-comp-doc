<<template>
  <v-container>
    <h1>Create a Post</h1>
    <v-form>
      <v-text-field label="Title" v-model="title" />
      <v-textarea label="Text" v-model="text" />
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
      text: "",
      post: false,
    };
  },
  methods: {
    submitReview() {
      alert("Submit Request Made");
      var request = {
        title: this.title,
        text: this.text,
        postedBy: this.$store.state.userAccount.username,
        posted: false,
      };

      if (this.post == true) {
        request.posted = true;
      }

      this.$http
        .post(`${process.env.VUE_APP_API_URL}/api/post/posts`, request, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        })
        .then((data) => {
          alert(data);
          console.log(data)
          this.title = "";
          this.text = "";
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>
