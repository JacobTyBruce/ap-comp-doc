<<template>
  <v-container>
    <h1>Create a Doc</h1>
    <v-form>
      <v-text-field label="Title" v-model="title" />
      <v-textarea label="Description" v-model="desc" />
      <v-textarea label="Text" v-model="text" />
      <v-text-field label="Tags (Separated by commas" v-model="tags" />
      <v-checkbox label="Post Immediately?" v-model="post" />
      <v-btn color='blue' @click="submitReview()"> Submit</v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: "DocCreator",
  data: function () {
    return {
      title: "",
      desc: "",
      text: "",
      tags: "",
      refs: "",
      post: false,
    };
  },
  methods: {
    submitReview() {
      alert("Submit Request Made");
      var request = {
        title: this.title,
        desc: this.desc,
        text: this.text,
        tags: this.tags.split(","),
        posted: this.post,
      };
      this.$http
        .post(`${process.env.VUE_APP_API_URL}/api/post/docs`, request, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        })
        .then((data) => {
          alert(data);
          this.title = "";
          this.desc = "";
          this.text = "";
          this.posted = false;
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>
