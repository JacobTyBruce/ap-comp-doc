<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col>hello</v-col>
      <v-col>
        <v-list>
          <v-list-item><v-btn color="info" :to="{name: 'DocContainer', params: {id: 'doc1', opt: {title: 'Opt Title', desc: 'Opt Desc', text: 'Opt Text'}}}">Go to doc</v-btn></v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Docs",
};
</script>