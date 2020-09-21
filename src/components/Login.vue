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
        login() {
            
        }
    }
}
</script>