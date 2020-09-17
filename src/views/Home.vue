<template>
  <v-container>
    <v-row align="center">
      <v-col class="text-center">
        <h1>AP Computer Science Documentation</h1>
        <div>{{this.$store.state.users}} </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
};
</script>
