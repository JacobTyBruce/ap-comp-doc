<template>
  <v-container>
    <v-row justify-center>
      <v-col text="center">
        <v-card max-width="50%">
          <v-form class="ma-4">
            <v-select :items="options" v-model="choice" label="Type" />
            <v-text-field
              label="Props to search for"
              v-model="searchForProps"
            />
            <v-text-field
              label="Values to search for"
              v-model="searchForVals"
            />
            <v-divider />
            <v-text-field
              label="Props to replace with"
              v-model="replacePropsWith"
            />
            <v-text-field
              label="Values to replace with"
              v-model="replaceValsWith"
            />
            <v-btn color='blue' @click='findAndReplace()'> Search and Replace </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Update",
  data: function() {
    return {
      options: ["Docs", "Posts", "Challenges"],
      choice: null,
      searchForProps: "",
      searchForVals: "",
      replacePropsWith,
      replaceValsWith,
    };
  },
  methods: {
      findAndReplace() {
          var searchPropsArray = this.searchForProps.split(',')
          var searchValsArray = this.searchForVals.split(',')
          var urlQuery = `?${searchPropsArray[0]}=${searchValsArray[0]}`
          alert(urlQuery)
          for (let i = 1; i < searchForProps.length; i++) {
              urlQuery += `&&${searchPropsArray[i]}=${searchValsArray[i]}`
          }
          alert(urlQuery)
      }
  },
};
</script>
