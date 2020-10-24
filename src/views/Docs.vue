<template>
  <v-container>
    <v-row align="center" justify="start">
      <v-col
        v-for="(doc, index) in this.$store.state.docs"
        :key="index"
        cols="12"
        sm="6"
        md="6"
        lg="6"
        xl="4"
      >
        <v-card
          class="ma-2"
          color="secondary"
        >
          <v-card-title :class="headerColor">{{doc.title}}</v-card-title>
          <v-card-text class="" v-html="doc.desc"></v-card-text>
          <v-card-actions>
            <v-btn @click="navigate(doc)" color="info">Go</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
        
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Docs",
  computed: {
    headerColor: function() {
      return (this.$vuetify.theme.dark) ? 'secondary mb-1' : 'secondary darken-1 mb-1'
    }
  },
  methods: {
    navigate: function (doc) {
      this.$store.dispatch("commitCurrentDataSet", doc);
      this.$router.push({ name: "DocContainer", params: { id: doc.title } });
    },
  },
  created() {
    this.$http
      .get(`${process.env.VUE_APP_API_URL}/api/get/docs/?posted=true`)
      .then((response) => {
        this.$store.dispatch("commitDocs", response.data);
      })
      .catch((error) => {
        alert("error getting docs");
      });
  },
};
</script>