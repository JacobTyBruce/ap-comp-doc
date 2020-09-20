<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col>

          <v-card v-for="(doc, index) in this.$store.state.docs" :key="index" max-width="300px" class="mb-4">
            <v-card-title>{{doc.title}}</v-card-title>
            <v-card-subtitle>{{doc.desc}}</v-card-subtitle>
            <v-card-actions>
              <v-btn @click="navigate(doc)">Go</v-btn>
            </v-card-actions>
          </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Docs",
  methods: {
      navigate: function(doc) {
          this.$store.dispatch('commitCurrentDataSet', doc);
          this.$router.push({ name: 'DocContainer', params: {id: doc.title}})
      }
  }
};
</script>