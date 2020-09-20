<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col>

          <v-card v-for="(challenge, index) in this.$store.state.challenges" :key="index" max-width="300px" class="mb-4">
            <v-card-title>{{challenge.title}}</v-card-title>
            <v-card-subtitle>{{challenge.desc}}</v-card-subtitle>
            <v-card-actions>
              <v-btn @click="navigate(challenge)">Go</v-btn>
            </v-card-actions>
          </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Challenges",
  methods: {
      navigate: function(challenge) {
          this.$store.dispatch('commitCurrentDataSet', challenge);
          this.$router.push({ name: 'ChallengeContainer', params: {id: challenge.title}})
      }
  }
};
</script>