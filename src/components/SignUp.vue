<template>
  <v-container>
    <v-row align="center">
      <v-col class="text-center">
        <v-card max-width="50%">
          <v-card-title>Sign Up</v-card-title>
          <v-card-actions>
            <v-form>
              <v-text-field
                label="Email"
                v-model="email"
                outlined
              ></v-text-field>
              <v-text-field
                label="Username"
                v-model="username"
                outlined
              ></v-text-field>
              <v-text-field
                label="Password"
                v-model="password"
                outlined
              ></v-text-field>
              <v-checkbox label="Agree to TOS" v-model="agree"></v-checkbox>
              <v-btn color="success" @click="signup(username, email, password)"
                >Login</v-btn
              >
            </v-form>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  data: function() {
    return {
      email: "",
      username: "",
      password: "",
      agree: false,
    };
  },
  methods: {
    signup(user, email, pass) {
      if (this.agree == true) {
        this.$http
          .post(
            "https://8081-a84fe534-1172-4d9c-8a40-4ff533376bf1.ws-us02.gitpod.io/api/signup", {
                username: user,
                email: email,
                password: pass
            }
          )
          .then((res) => {
            alert(res.data);
          })
          .catch((err) => {
            alert(err);
          });
          this.email = '';
          this.username = '';
          this.password = '';
          this.agree = false;
      }
    },
  },
};
</script>
