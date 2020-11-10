<template>
  <v-container>
    <v-row fluid>
      <v-col cols="8">
        <v-row justify="center"> <h1>Create</h1> </v-row>
        <v-row justify="center">
          <v-col cols="3">
            <v-btn to="/admin/create-post">Posts</v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn to="/admin/create-doc">Docs</v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn to="/admin/create-challenge">Challenges</v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="3" class="text-center" align-self="space-around">
        <v-btn to="/admin/review"> Review and Remove </v-btn>
        <v-divider class="ma-5"></v-divider>
        <v-btn to="/admin/text-editor"> Text Editor </v-btn>
      </v-col>
    </v-row>
    <v-row fluid>
      <v-col cols="12">
        <v-divider />
        <router-view></router-view>
      </v-col>
    </v-row>
  </v-container>
</template>

<<script>
export default {
    name: 'Admin'
}
</script>