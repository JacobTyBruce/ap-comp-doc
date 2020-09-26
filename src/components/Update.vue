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
            <v-checkbox label='Replace all Values?' v-model='all' />
            <v-btn color='blue' @click='findAndReplace()'> Search and Replace </v-btn>
          </v-form>
          <v-divider />
            {{result}}
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
      replacePropsWith: "",
      replaceValsWith: "",
      all: false,
      result: null
    };
  },
  methods: {
      findAndReplace() {
          // get array of props and vals
          var searchPropsArray = this.searchForProps.split(',')
          var searchValsArray = this.searchForVals.split(',')
          var replacePropsArray = this.replacePropsWith.split(',')
          var replaceValsArray = this.replaceValsWith.split(',')
          // body for patch request -- to match
          var patchBody = {
            query: {},
            replace: {}
          }
          // for loop to populate query object with props and vals
          for (let i = 0; i < searchPropsArray.length; i++) {
              let prop = searchPropsArray[i]
              patchBody.query[prop] = searchValsArray[i]
          }
          // for loop to populate replace object with props and vals
          for (let i = 0; i < replacePropsArray.length; i++) {
              let prop = replacePropsArray[i]
              patchBody.replace[prop] = replaceValsArray[i]
          }
          console.log(patchBody)
          // url needed for request
          var urlReq = `${process.env.VUE_APP_API_URL}/api/update/${this.choice.toLowerCase()}/`
          // if this update all is true, append true to query
          if (this.all == true) {urlReq += '?all=true'}
          alert(urlReq)
          // call request
          this.$http.patch(urlReq, patchBody).then((result) => {
              console.log(result)
              this.result = result.data
          })
      }
  },
};
</script>
