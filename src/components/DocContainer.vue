<template>
  <v-container>
    <v-card>
      <v-card-title>{{this.title}}</v-card-title>
      <v-card-subtitle>{{this.desc}}</v-card-subtitle>
    </v-card>
    <v-divider></v-divider>
    <v-card>
        <v-card-text>{{this.text}}</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "DocContainer",
  data: function() {
      return {
          title: "",
          desc: "",
          text: ""
      }
  },
  created() {
      console.log(this.$route.params)
    const opt = this.$route.params.opt;
    this.title = opt.title;
    this.desc = opt.desc;
    this.text = opt.text;

  }
};
</script>