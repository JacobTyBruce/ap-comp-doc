<template>
  <v-container>
    <v-row align="center" justify="start">
        <v-card
          v-for="(doc, index) in this.$store.state.docs"
          :key="index"
          width="30%"
          class="ma-2"
        >
          <v-card-title>{{doc.title}}</v-card-title>
          <v-card-subtitle>{{doc.desc}}</v-card-subtitle>
          <v-card-actions>
            <v-btn @click="navigate(doc)">Go</v-btn>
          </v-card-actions>
        </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Docs",
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