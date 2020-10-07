<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card max-width="50%">
          <v-card-title>Login</v-card-title>
          <v-card-subtitle>
            Or click <v-btn :to="{ name: 'SignUp' }" small text>Here</v-btn> To
            Sign Up
          </v-card-subtitle>
          <v-card-actions>
            <v-form>
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
              <v-alert type="error" v-if="error == true"
                >Wrong Password or Username</v-alert
              >
              <v-checkbox label="Remember Me" v-model="remember"></v-checkbox>
              <v-btn
                color="success"
                @click="login(username, password)"
                :loading="loading"
                >Login</v-btn
              >
            </v-form>
          </v-card-actions>
          <v-dialog
            v-model="dialog"
            persistent
            :overlay="false"
            max-width="500px"
            transition="dialog-transition"
          >
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">Forgot Username or Password?</v-btn>
            </template>
            <v-card>
              <v-btn icon
                ><v-icon @click="dialog = !dialog">mdi-close</v-icon></v-btn
              >
              <v-card-title> Select Your Problem </v-card-title>
              <v-card-actions>
                <v-btn> Forgot Username </v-btn> <v-spacer />
                <v-btn>Forgot Password </v-btn>
              </v-card-actions>
              <v-card-actions>
                      <v-text-field label='Enter Account Email' class='mr-4'></v-text-field>
                      <v-btn>Send Reset Email</v-btn>
              </v-card-actions>
              <v-card-actions class='text-center'>
                <v-form>
                    <v-text-field label='Enter Code'></v-text-field>
                  <v-btn>Enter</v-btn>
                </v-form>
              </v-card-actions>
              <v-card-actions v-if="resetUsername">
                  <v-form>
                  <v-text-field label='Enter New Username'></v-text-field>
                  <v-text-field label='Confirm New Username'></v-text-field>
                  <v-btn>Submit</v-btn>
                  </v-form>
              </v-card-actions>
              <v-card-actions v-if="resetPassword">
                  <v-form>
                  <v-text-field label='Enter New Password'></v-text-field>
                  <v-text-field label='Confirm New Password'></v-text-field>
                  <v-btn>Submit</v-btn>
                  </v-form>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  data: function () {
    return {
      username: "",
      password: "",
      remember: false,
      error: false,
      loading: false,
      dialog: false,
      resetUsername: true,
      resetPassword: false,
      resetEmail: "",
      resetCode: null
    };
  },
  methods: {
    login(user, pass) {
      this.loading = true;
      var remember = this.remember;
      this.$http
        .get(`${process.env.VUE_APP_API_URL}/api/login`, {
          auth: {
            username: user,
            password: pass,
          },
        })
        .then((res) => {
          // check for correctness
          if (res.data === false) {
            this.error = true;
          } else {
            console.log(res.data);
            this.$store.dispatch("commitLoggedIn", true);
            this.$store.dispatch("commitUserAccount", res.data);
            window.sessionStorage.setItem("token", res.data.access);
            if (remember == true) {
              window.localStorage.setItem("login", "true");
            }
            this.error = false;
            this.$router.back();
          }
        })
        .catch((err) => {
          //alert(err)
          console.log(err);
          this.error = true;
        });
      this.username = "";
      this.password = "";
      this.remember = false;
      setTimeout(() => {
        this.loading = false;
      }, 750);
    },
  },
};
</script>