<template>
  <v-container>
    <v-row fluid>
      <v-col cols="3">
        <v-btn to="/admin/create-post">Posts</v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn to="/admin/create-doc">Docs</v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn to="/admin/create-challenge">Challenges</v-btn>
      </v-col>
      <v-col cols='3' class='text-center'>
          <v-btn to='/admin/review'> Review and Submit </v-btn> <v-spacer class='ma-2'/> <v-btn to='/admin/update'> Update </v-btn> <v-spacer class='ma-2' /> <v-btn to='/admin/text-editor'> Edit </v-btn>
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