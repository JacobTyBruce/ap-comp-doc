<template>
  <v-container>
    <v-row align="stretch" justify="start">
      <v-col
        v-for="(challenge, index) in this.$store.state.challenges"
        :key="index"
        cols="12"
        sm="6"
        md="6"
        lg="6"
        xl="4"
      >
        <v-card
          color="secondary"
          height="100%"
        >
          <v-card-title :class="headerColor">{{challenge.title}}</v-card-title>
          <v-card-text>{{challenge.desc.substring(0,512)}}</v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn @click="navigate(challenge)" color="info">Go</v-btn>
          </v-card-actions>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Challenges",
  computed: {
    headerColor: function() {
      return (this.$vuetify.theme.dark) ? 'secondary mb-1' : 'secondary darken-1 mb-1'
    }
  },
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