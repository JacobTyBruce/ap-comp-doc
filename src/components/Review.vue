<<template>
    <v-container>
    <v-row>
        <v-btn @click="fetch()"> Fetch </v-btn>
    </v-row>
    <v-row>
        <v-col v-for="items in this.reviewItems" :key="items._id" cols="4">
        <v-card>
            <v-card-title>{{items.title}}</v-card-title>
            <v-card-subtitle>{{items.desc}}</v-card-subtitle>
            <v-card-text>{{items.challenge}}</v-card-text>
            <v-card-text v-html="items.text"></v-card-text>
            <v-card-subtitle v-if="items.hasOwnProperty('postedBy')">Posted by: {{items.postedBy}}</v-card-subtitle>
        </v-card>
        </v-col>
    </v-row>
       
    </v-container>
</template>

<<script>
export default {
    name: 'Review',
    data: function() {
        return {
            reviewItems: []
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
        }
    },
}
</script>