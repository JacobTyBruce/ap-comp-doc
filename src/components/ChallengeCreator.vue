<<template>
  <v-container>
    <h1>Create a Challenge</h1>
    <v-form>
      <v-text-field label="Title" v-model="title" />
      <v-textarea label='Description' v-model="desc" />
      <v-textarea label="Challenge" v-model="challenge" />
      <v-textarea label="Text/Explaination" v-model="text" />
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
      desc: "",
      challenge: "",
      text: ""
    };
  },
  methods: {
      submitReview() {
          alert('Subit Request Made')
          var request = {
              title: this.title,
              desc: this.desc,
              challenge: this.challenge,
              text: this.text,
              updated: JSON.stringify(new Date().now),
              posted: false
          }
          this.$http.post(`${process.env.VUE_APP_API_URL}/api/post/challenges`, request).then((data) => {
              alert(data);
              this.title = ""
              this.text= ""
              this.desc = ""
              this.challenge = ""
              this.text = ""
          }).catch((err) => {
              alert(err)
          })
      }
  }
};
</script>