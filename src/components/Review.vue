<template>
  <v-container>
    <v-row>
      <v-btn @click="fetch()">Fetch</v-btn>
    </v-row>
    <v-row>
      <v-col v-for="items in this.reviewItems" :key="items._id" cols="4">
        <v-card>
          <v-card-title>{{items.title}}</v-card-title>
          <v-card-subtitle>{{items.desc}}</v-card-subtitle>
          <v-card-text>{{items.challenge}}</v-card-text>
          <v-card-text v-html="items.text"></v-card-text>
          <v-card-subtitle v-if="items.hasOwnProperty('postedBy')">Posted by: {{items.postedBy}}</v-card-subtitle>
          <v-btn color="red" @click="review(items)">Review</v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="50%">
      <v-card>
        <v-card-title>{{this.currentItem.title}}</v-card-title>
        <v-card-subtitle v-html="this.currentItem.desc"></v-card-subtitle>
        <v-card-subtitle v-html="this.currentItem.challenge"></v-card-subtitle>
        <v-card-subtitle v-html="this.currentItem.text"></v-card-subtitle>
        <v-card-subtitle>{{this.currentItem.refs}}</v-card-subtitle>
        <v-card-subtitle>{{this.currentItem.tags}}</v-card-subtitle>
        <v-card-subtitle>{{this.currentItem.postedBy}}</v-card-subtitle>
        <v-divider />
        <v-card-actions>
          <v-btn @click="dialog = false">Close</v-btn>
          <v-spacer />
          <v-btn @click="post(currentItem)" color="blue">Post</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<<script>
export default {
    name: 'Review',
    data: function() {
        return {
            reviewItems: [],
            dialog: false,
            currentItem: {}
        }
    },
    methods: {
        fetch() {
            this.reviewItems = []
            // get docs
            this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/docs/?posted=false`).then((response) => {
                this.reviewItems = this.reviewItems.concat(response.data)
            }).catch((error) => {
                alert("error getting docs");
            });
            // get challenges
            this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/challenges/?posted=false`).then((response) => {
                this.reviewItems = this.reviewItems.concat(response.data)
            }).catch(() => {
                alert("error getting challenges");
            });
            // get posts
            this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/posts/?posted=false`).then((response) => {
                this.reviewItems = this.reviewItems.concat(response.data)
            }).catch(() => {
                alert("error getting posts");
            });
        },
        review(item) {
            this.currentItem = item
            this.dialog = true
        },
        post(item) {
            var patchBody = {
                query: item,
                replace: {
                    posted: true
                }
            }
            // check if doc
            if (item.hasOwnProperty('tags')) {
                console.log('Doc')
                this.$http.patch( `${process.env.VUE_APP_API_URL}/api/update/docs/`, patchBody).then((result) => {
                    console.log(result)
                })
            }
            // check if post
            if (item.hasOwnProperty('postedBy')) {
                console.log('Post')
                this.$http.patch( `${process.env.VUE_APP_API_URL}/api/update/posts/`, patchBody).then((result) => {
                    console.log(result)
                })
            }
            // check if challenge
            if (item.hasOwnProperty('challenge')) {
                console.log('Challenge')
                this.$http.patch( `${process.env.VUE_APP_API_URL}/api/update/challenges/`, patchBody).then((result) => {
                    console.log(result)
                })
            }
            // close and refresh
            this.currentItem = {}
            this.dialog = false
            this.fetch()
        }
    },
}
</script>