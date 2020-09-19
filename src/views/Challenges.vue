<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col>

          <v-card v-for="(challenge, index) in this.$store.state.challenges" :key="index" max-width="300px" class="mb-4">
            <v-card-title>{{challenge.title}}</v-card-title>
            <v-card-subtitle>{{challenge.desc}}</v-card-subtitle>
            <v-card-actions>
              <v-btn :to="{name: 'ChallengeContainer', params: {id: challenge.title}}"  @click="console.log(challenge)">Go</v-btn>
            </v-card-actions>
          </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: "Challenges",
  methods: {
      setData: function(challenge) {
          this.$store.dispatch('commitCurrentDataSet', challenge)
      },
      ...mapActions([
          'commitCurrentDataSet'
      ])
  }
};
</script>