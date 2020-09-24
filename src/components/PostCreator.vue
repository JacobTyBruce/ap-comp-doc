<<template>
  <v-container>
    <h1>Create a Post</h1>
    <v-form>
      <v-text-field label="Title" v-model="title" />
      <v-textarea label="Text" v-model="text" />
      <v-btn color='blue' v-on=""> Submit </v-btn>
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
          var request = {
              title: this.title,
              text: this.text,
              postedBy: this.$store.state.userAccount.username,
              dateCreated: JSON.stringify(Date.now()),
              posted: false
          }
          this.$http.post(`${process.env.VUE_APP_API_URL}/api/post/posts`, request).then((data) => {
              alert(data);
          })
      }
  }
};
</script>
