<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" md="6">
        <v-card>
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
                :type="'password'"
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
              <v-btn text v-on="on" @click="page1 = true"
                >Forgot Username or Password?</v-btn
              >
            </template>
            <v-card>
              <v-container>
                <v-btn icon
                  ><v-icon
                    @click="
                      dialog = !dialog;
                      page1 = page2 = page3 = page4 = resetUsername = resetPassword = false;
                    "
                    >mdi-close</v-icon
                  ></v-btn
                >
                <v-row justify="center" v-if="page1">
                  <v-col cols="6">
                    <v-card-title> Select Your Problem </v-card-title></v-col
                  >
                </v-row>
                <v-row v-if="page1">
                  <v-col cols="12">
                    <v-card-actions>
                      <v-btn
                        @click="
                          page1 = false;
                          page2 = true;
                          resetUsername = true;
                        "
                      >
                        Forgot Username
                      </v-btn>
                      <v-spacer />
                      <v-btn
                        @click="
                          page1 = false;
                          page2 = true;
                          resetPassword = true;
                        "
                        >Forgot Password
                      </v-btn>
                    </v-card-actions>
                  </v-col>
                </v-row>
                <v-row v-if="page2">
                  <v-col cols="12">
                    <v-card-actions>
                      <v-text-field
                        label="Enter Account Email"
                        class="mr-4"
                        v-model="resetEmail"
                      ></v-text-field>
                      <v-btn @click="sendReset()">Send Reset Email</v-btn>
                    </v-card-actions>
                  </v-col>
                </v-row>
                <v-row
                  align="center"
                  justify="center"
                  class="text-center"
                  v-if="page3"
                >
                  <v-col cols="6">
                    <v-card-actions class="text-center">
                      <v-form>
                        <v-text-field
                          label="Enter Code"
                          v-model="resetCode"
                        ></v-text-field>
                        <v-btn @click="checkReset()">Enter</v-btn>
                      </v-form>
                    </v-card-actions>
                  </v-col>
                </v-row>
                <v-row
                  justify="center"
                  align="center"
                  v-if="page4 && resetUsername"
                >
                  <v-col cols="6">
                    <v-card-actions>
                      <v-form class="text-center">
                        <v-text-field
                          label="Enter New Username"
                          v-model="newData"
                        ></v-text-field>
                        <v-text-field
                          label="Confirm New Username"
                        ></v-text-field>
                        <v-btn @click="submitData()">Submit</v-btn>
                      </v-form>
                    </v-card-actions>
                  </v-col>
                </v-row>
                <v-row
                  justify="center"
                  align="center"
                  v-if="page4 && resetPassword"
                >
                  <v-col cols="6">
                    <v-card-actions>
                      <v-form class="text-center">
                        <v-text-field
                          label="Enter New Password"
                          v-model="newData"
                        ></v-text-field>
                        <v-text-field
                          label="Confirm New Password"
                        ></v-text-field>
                        <v-btn @click="submitData()">Submit</v-btn>
                      </v-form>
                    </v-card-actions>
                  </v-col>
                </v-row>
              </v-container>
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
      // dialog data
      dialog: false,
      resetUsername: false,
      resetPassword: false,
      resetEmail: "",
      resetCode: null,
      newData: "",
      page1: true,
      page2: false,
      page3: false,
      page4: false,
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
            // commit data
            this.$store.dispatch("commitLoggedIn", true);
            this.$store.dispatch("commitUserAccount", res.data);
            window.localStorage.setItem("token", res.data.access);
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
    async sendReset() {
      try {
        var setReset = await this.$http.post(
          `${process.env.VUE_APP_API_URL}/api/set-reset`,
          { email: this.resetEmail }
        );
        this.page2 = false;
        this.page3 = true;
      } catch (err) {
        console.log(err);
        alert('Error when sending email, try another or try again')
      }
    },
    async checkReset() {
      try {
        var result = await this.$http.post(
          `${process.env.VUE_APP_API_URL}/api/check-reset`,
          { email: this.resetEmail, userCode: this.resetCode }
        );
        console.log(result);
        this.page3 = false;
        this.page4 = true;
      } catch (err) {
        console.log(err);
        alert("Bad Code");
      }
    },
    async submitData() {
      var type = this.resetUsername ? "username" : "password";
      try {
        if ((type = "username")) {
          var validity = await this.$http.get(
            `${process.env.VUE_APP_API_URL}/api/get/users/?username=${this.newData}`
          );
          console.log('Validity Data');
          console.log(validity.data);
          if (validity.data.length > 0) {
            alert("Username already taken, please try another one");
          } else {
            var result = await this.$http.post(
              `${process.env.VUE_APP_API_URL}/update-account`,
              { type: type, email: this.resetEmail, newData: this.newData }
            );
            console.log(result);
            this.page4 = false;
            this.dialog = !this.dialog;
            this.resetPassword = false;
            this.resetUsername = false;
          }
        } else {
          var result = await this.$http.post(
            `${process.env.VUE_APP_API_URL}/update-account`,
            { type: type, email: this.resetEmail, newData: this.newData }
          );
          console.log(result);
          this.page4 = false;
          this.dialog = !this.dialog;
          this.resetPassword = false;
          this.resetUsername = false;
        }
      } catch (err) {
        console.log(err);
        alert("Error Updating Account, Please Try Again");
      }
    },
  },
};
</script>