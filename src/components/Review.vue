<template>
  <v-container>
    <v-row>
      <v-btn @click="getReview();option='review'">Under Review</v-btn>
      <v-spacer />
      <v-btn @click="getPosted();option='delete'">Posted</v-btn>
    </v-row>
    <v-row justify="space-around">

        <v-hover
          v-slot:default="{ hover }"
          v-for="items in this.reviewItems"
          :key="items._id"
        >
        <v-card width="45%" style="overflow: hidden" class="ma-4">
          <v-card-title>{{items.title}}</v-card-title>
          <v-card-subtitle v-html="items.desc"></v-card-subtitle>
          <v-card-text>{{items.challenge}}</v-card-text>
          <v-card-text v-html="items.text.substring(0,256)"></v-card-text>
          <v-card-subtitle v-if="items.hasOwnProperty('postedBy')">Posted by: {{items.postedBy}}</v-card-subtitle>
          <v-overlay :value="hover" absolute opacity=".2" color="orange">
              <v-btn color="red" @click="review(items)">View</v-btn>
            </v-overlay>
        </v-card>
        </v-hover>

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
          <v-btn v-if="option=='review'" @click="post(currentItem)" color="blue">Post</v-btn>
          <v-btn v-if="option=='delete'" @click="del(currentItem)" color="red">Delete</v-btn>
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
            currentItem: {},
            option: "",
            currentType: null
        }
    },
    methods: {
        getReview() {
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
        async getPosted() {
            this.reviewItems = []
            // get posted docs
            try {
                var postedDocs = await this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/docs/?posted=true`)
                console.log(postedDocs.data)
                this.reviewItems = this.reviewItems.concat(postedDocs.data)
            } catch (error) {
                console.log('Error Getting Posted Docs')
                alert('Error Getting Posted Docs')
                console.log(error)
            }
            // get posted posts
            try {
                var postedPosts = await this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/posts/?posted=true`)
                this.reviewItems = this.reviewItems.concat(postedPosts.data)
            } catch (error) {
                console.log('Error Getting Posted Posts')
                alert('Error Getting Posted Posts')
                console.log(error)
            }
            // get posted challenges
            try {
                var postedChallenges = await this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/challenges/?posted=true`)
                this.reviewItems = this.reviewItems.concat(postedChallenges.data)
            } catch (error) {
                console.log('Error Getting Posted Challenges')
                alert('Error Getting Posted Challenges')
                console.log(error)
            }
        },
        review(item) {
            this.currentItem = item
            this.dialog = true
            if (item.hasOwnProperty('tags')) {
                this.currentType = 'docs'
            } else if (item.hasOwnProperty('challenge')) {
                this.currentType = 'challenges'
            } else {
                this.currentType = 'posts'
            }
        },
        async post(item) {
            var patchBody = {
                query: item,
                replace: {
                    posted: true
                }
            }
            try {
                var postedContent = await this.$http.patch(`${process.env.VUE_APP_API_URL}/api/update/${this.currentType}`, patchBody, {
                    headers: {
                        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                    },
                })
                console.log(postedContent.data)
            } catch (error) {
                console.log('Error Posting Content')
                alert('Error Posting Content')
                console.log(error)
            }
            // close and refresh
            this.currentItem = {}
            this.dialog = false
            this.getReview()
        },
        async del(item) {
            console.log(item)
            console.log(window.localStorage.getItem("token"))
            try {
                var deletedContent = await this.$http.delete( `${process.env.VUE_APP_API_URL}/api/delete/${this.currentType}/${item._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                    }
                })
                console.log(deletedContent.data)
            } catch (error) {
                console.log('Error Deleting Content')
                alert('Error Deleting Content')
                console.log(error)
            }
            // close and refresh
            this.currentItem = {}
            this.dialog = false
            this.getPosted()
        }
    },
}
</script>