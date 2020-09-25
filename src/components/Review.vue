<<template>
    <div>
        <v-btn @click="fetch(); this.reviewItems = {name: 'gay'}"> Fetch </v-btn>
       {{this.reviewItems}} 
    </div>
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
            axios.get(`${process.env.VUE_APP_API_URL}/api/get/docs/?posted=false`).then((response) => {
                alert(response, typeof response)
                this.reviewItems.push(response)
            }).catch((error) => {
                alert("error getting docs");
            });/*
            // get challenges
            axios.get(`${process.env.VUE_APP_API_URL}/api/get/challenges/?posted=false`).then((response) => {
                this.reviewItems = this.reviewItems.concat(response)
            }).catch(() => {
                alert("error getting challenges");
            });
            // get posts
            axios.get(`${process.env.VUE_APP_API_URL}/api/get/posts/?posted=false`).then((response) => {
                this.reviewItems = this.reviewItems.concat(response)
            }).catch(() => {
                alert("error getting posts");
            });*/
        }
    },
}
</script>