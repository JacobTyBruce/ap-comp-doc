<<template>
    <v-container>
    <v-row>
        <v-btn @click="fetch(); this.reviewItems = {name: 'gay'}"> Fetch </v-btn>
    </v-row>
    <v-row>
        {{this.reviewItems}}
        <v-card v-for="items in this.reviewItems" :key="items._id">
            <v-card-title>{{items.title}}</v-card-title>
        </v-card>
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
            console.log('fetched')
            // get docs
            this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/docs/?posted=false`).then((response) => {
                this.reviewItems.push(response.data)
            }).catch((error) => {
                alert("error getting docs");
            });
            // get challenges
            this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/challenges/?posted=false`).then((response) => {
                this.reviewItems = this.reviewItems.concat(response)
            }).catch(() => {
                alert("error getting challenges");
            });
            // get posts
            this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/posts/?posted=false`).then((response) => {
                this.reviewItems = this.reviewItems.concat(response)
            }).catch(() => {
                alert("error getting posts");
            });
        }
    },
}
</script>