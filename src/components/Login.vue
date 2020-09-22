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
            remember: false
        }
    },
    methods: {
        login(user,pass) {
            alert('Login')
            this.$http.get('https://8081-a84fe534-1172-4d9c-8a40-4ff533376bf1.ws-us02.gitpod.io/api/login', {
                auth: {
                    username: user,
                    password: pass
                }
            }).then((res) => {
                alert(res.data)
            }).catch((err) => {
                alert(err)
            })
        }
    }
}
</script>