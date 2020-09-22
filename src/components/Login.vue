<template>
    <v-container>
    <v-row align="center">
      <v-col class="text-center">
        <v-card max-width='50%'>
            <v-card-title>Login</v-card-title>
            <v-card-actions>
              <v-form>
              <v-text-field label='Username' v-model="username" outlined></v-text-field>
              <v-text-field label='Password' v-model="password" outlined></v-text-field>
              <v-checkbox label='Remember Me' v-model="remember"></v-checkbox>
              <v-btn color='success' @click="login(this.username,this.password)">Login</v-btn>
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
        login: function(user,pass) {
            alert('Login')
            axios.get(`http://${process.env.VUE_APP_DB_URL}/api/login`, {
                auth: {
                    username: user,
                    password: pass
                }
            }).then((res) => {
                alert(res)
            }).catch((err) => {
                alert(err)
            })
        }
    }
}
</script>