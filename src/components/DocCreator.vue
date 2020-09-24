<<template>
  <v-container>
    <h1>Create a Post</h1>
    <v-form>
      <v-text-field label="Title" v-model="title" />
      <v-textarea label="Text" v-model="text" />
      <v-btn color='blue' @click="submitReview()"> Submit</v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: "PostCreator",
  data: function() {
    return {
      title: "",
      text: "",
    };
  },
  methods: {
      submitReview() {
          alert('Subit Request Made')
          var request = {
              title: this.title,
              text: this.text,
              postedBy: this.$store.state.userAccount.username,
              dateCreated: JSON.stringify(new Date.now()),
              posted: false
          }
          this.$http.post(`${process.env.VUE_APP_API_URL}/api/post/docs`, request).then((data) => {
              alert(data);
              this.title = "";
              this.text = "";
          }).catch((err) => {
              alert(err)
          })
      }
  }
};
</script>
