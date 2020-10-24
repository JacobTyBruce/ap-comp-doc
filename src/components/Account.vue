<template>
  <v-container>
    <v-row>
      <v-col>
        <div v-if="this.$store.state.loggedIn == false">
          <h1>Not Logged In or Error Loading Page, Try Again or Login Here</h1>
          <v-btn :to="{ name: 'Login' }">Login</v-btn>
        </div>
        <v-container v-else>
          <v-row>
            <v-col class="text-center"
              ><h1>{{ account.username }}</h1></v-col
            >
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="8" lg="8" xl="8">
              <v-card color="secondary">
                <v-card-title>Dashboard</v-card-title>
                <v-divider />
                <v-card-actions>
                <v-btn
                  v-if="this.$store.state.userAccount.roles.includes('admin')" 
                  color="#F6AA1C"
                  :to="{ name: 'Admin' }"
                  >Go to Admin Console</v-btn
                >
                </v-card-actions>
                <v-card-title>
                  Your Posts
                </v-card-title>
                <v-card-text v-if="posts.length == 0">No Posts :(</v-card-text>

                <v-hover v-for="post in posts" :key="post._id" v-slot="{ hover }">
                  <v-card flat outlined tile @click="navigate(post)" :class="hover ? 'secondary darken-1' : 'secondary'">
                    <v-card-title>{{post.title}}</v-card-title>
                    <v-card-subtitle>{{post.text}}</v-card-subtitle>
                </v-card>
                </v-hover>
                
              </v-card>
            </v-col>
            <v-col cols="12" sm="12" md="4" lg="4" xl="4" class="text-center">
              <v-card class="text-left" color="secondary">
                <v-card-title>Account Info</v-card-title>
                <v-card-text
                  >Username:
                  <strong>{{ account.username }}</strong></v-card-text
                >
                <v-card-text
                  >Email: <strong>{{ account.email }}</strong></v-card-text
                >
                <v-card-text
                  >Roles:
                  <strong v-for="(role, index) in account.roles" :key="index"
                    >{{ role }}
                  </strong></v-card-text
                >
                <v-card-text
                  >User ID: <strong>{{ account.userId }}</strong></v-card-text
                >
              </v-card>
              <v-switch v-model="$vuetify.theme.dark" :label="'Dark Mode'"></v-switch>
              <v-btn class="ma-8" @click="logout()" color="#BA1200">Logout</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    name: 'Account',
    data: function() {
        return {
          posts: Array,
        }
    },
    computed: {
      // get acc
      account: function() {
        return this.$store.state.userAccount
      },
    },
    created() {
      this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/posts/?postedBy=${this.$store.state.userAccount.username}`).then(data => {console.log(data.data);this.posts = data.data}).catch(err => {
        console.log(err)
      })
      
    },
    methods: {
      logout() {
          this.$http.get(`${process.env.VUE_APP_API_URL}/api/logout`).then(() => {
              this.$store.dispatch("commitLoggedIn", false)
              this.$store.dispatch("commitUserAccount", {})
              this.$router.push({name: 'Home'})
              window.sessionStorage.removeItem('token')
              window.localStorage.removeItem('login')
          }).catch(err => {
              console.log(err);
          })
      },
      navigate: function (post) {
        this.$store.dispatch("commitCurrentDataSet", post);
        this.$router.push({ name: "PostContainer", params: { id: post.title } });
      },
    }
}
</script>