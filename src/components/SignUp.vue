<template>
  <v-container>
    <v-row align="center">
      <v-col class="text-center">
        <v-card max-width="50%">
          <v-card-title>Sign Up</v-card-title>
          <v-card-actions>
            <v-form>
              <div v-if="error.length > 0">
                <v-alert type="error" v-for="(errors,index) in this.error" :key="index">{{errors}}</v-alert>
              </div>
              <v-text-field label="Email" v-model="email" outlined></v-text-field>
              <v-text-field label="Username" v-model="username" outlined></v-text-field>
              <v-text-field label="Password" v-model="password" outlined></v-text-field>
              <v-checkbox label="Agree to TOS" v-model="agree"></v-checkbox>
              <v-btn color="success" @click="signup(username, email, password)">Sign Up</v-btn>
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
  data: function () {
    return {
      email: "",
      username: "",
      password: "",
      agree: false,
      error: [],
    };
  },
  methods: {
    signup(user, email, pass) {
      this.error = [];
      if (this.agree == true) {
        this.$http
          .post(`${process.env.VUE_APP_API_URL}/api/signup`, {
            username: user,
            email: email,
            password: pass,
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.hasOwnProperty("errors")) {
              this.error = res.data.errors;
            } else {
              this.email = "";
              this.username = "";
              this.password = "";
              this.agree = false;
              this.$router.push({name: 'Account'})
              this.$store.dispatch("commitLoggedIn", true)
              this.$store.dispatch("commitUserAccount", res.data)
            }
          })
          .catch((err) => {
            alert(err);
          });
      } else {
        this.error.push("Please Agree to the TOS");
      }
    },
  },
};
</script>
