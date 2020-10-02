<template>
    <v-container>
    <v-row align="center">
      <v-col>
        <v-card max-width='50%'>
            <v-card-title>Login</v-card-title>
            <v-card-subtitle> Or click <v-btn :to="{name: 'SignUp'}" small text>Here</v-btn> To Sign Up </v-card-subtitle>
            <v-card-actions>
              <v-form>
              <v-text-field label='Username' v-model="username" outlined></v-text-field>
              <v-text-field label='Password' v-model="password" outlined></v-text-field>
              <v-alert type='error' v-if="error == true">Wrong Password or Username</v-alert>
              <v-checkbox label='Remember Me' v-model="remember"></v-checkbox>
              
              <v-btn color='success' @click="login(username,password)">Login</v-btn>
              </v-form>
            </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    name: 'Login',
    data: function() {
        return {
            username: '',
            password: '',
            remember: false,
            error: false
        }
    },
    methods: {
        login(user,pass) {
            this.$http.get(`${process.env.VUE_APP_API_URL}/api/login`, {
                auth: {
                    username: user,
                    password: pass
                },
            }).then((res) => {
                // check for correctness
                if (res.data === false) {
                    this.error = true
                } else {
                  console.log(res.data)
                  this.$store.dispatch("commitLoggedIn", true)
                  this.$store.dispatch("commitUserAccount", res.data)
                  this.$router.back()
                  window.localStorage.setItem('token', res.data.access)
                }
            }).catch((err) => {
                alert(err)
            })
            this.username = ''
            this.password = ''
            this.remember = false
        }
    }
}
</script>