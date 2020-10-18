<template>
  <v-container>
    <v-row align="stretch" justify="start">
        <v-card
          v-for="(challenge, index) in this.$store.state.challenges"
          :key="index"
          width="40%"
          class="ma-4"
        >
        <v-container>
          <v-row><v-card-title>{{challenge.title}}</v-card-title></v-row>
          <v-row><v-card-subtitle>{{challenge.desc}}</v-card-subtitle></v-row>
          <v-row><v-divider /></v-row>
          <v-row>
          <v-card-actions>
            <v-btn @click="navigate(challenge)">Go</v-btn>
          </v-card-actions></v-row>
        </v-container>
        </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Challenges",
  methods: {
    navigate: function (challenge) {
      this.$store.dispatch("commitCurrentDataSet", challenge);
      this.$router.push({
        name: "ChallengeContainer",
        params: { id: challenge.title },
      });
    },
  },
  created() {
      this.$http
        .get(`${process.env.VUE_APP_API_URL}/api/get/challenges/?posted=true`)
        .then((response) => {
          this.$store.dispatch("commitChallenges", response.data);
        })
        .catch(() => {
          alert("error getting challenges");
        });
    }
};
</script>