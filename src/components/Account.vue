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
            <v-col cols="4" class="text-center">
              <v-card class="text-left">
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
              <v-btn class="ma-8" @click="logout()" color="red">Logout</v-btn>
            </v-col>
            <v-col cols="8">
              <v-card>
                <v-card-title>Dashboard</v-card-title>
                <v-btn
                  v-if="this.$store.state.userAccount.roles.includes('admin')" 
                  color="orange"
                  :to="{ name: 'Admin' }"
                  >Go to Admin Console</v-btn
                >
              </v-card>
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
            
        }
    },
    computed: {
      // get acc
      account: function() {
        return this.$store.state.userAccount
      }
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
        }    
    }
}
</script>