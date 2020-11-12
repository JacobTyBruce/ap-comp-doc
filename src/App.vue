  
<template>
  <v-app id="inspire" :style="{background: $vuetify.theme.themes[theme].background}">
    <v-navigation-drawer v-model="drawer" app clipped color="secondary">
      <v-list dense>
        <!-- Home -->
        <v-list-item link :to="{name: 'Home'}" @click.stop="drawer = false">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Docs -->
        <v-list-item link :to="{name: 'Docs'}" @click.stop="drawer = false">
          <v-list-item-action>
            <v-icon>mdi-file-document-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Docs</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Challenges -->
        <v-list-item link :to="{name: 'Challenges'}" @click.stop="drawer = false">
          <v-list-item-action>
            <v-icon>mdi-code-braces</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Challenges</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Posts -->
        <v-list-item link :to="{name: 'Posts'}" @click.stop="drawer = false">
          <v-list-item-action>
            <v-icon>mdi-forum</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Posts</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
         <!-- Topics -->
        <v-list-item link :to="{name: 'Topics'}" @click.stop="drawer = false" disabled>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Topics</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
        <!-- Help -->
        <v-list-item link :to="{name: 'Help'}" @click.stop="drawer = false">
          <v-list-item-action>
            <v-icon>mdi-account-question</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Help</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-icon @click='yummy()'>mdi-food-drumstick</v-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Make login slide from side rather than seperate page -->
    <v-app-bar app clipped-left color="primary" class="white--text">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="accent"></v-app-bar-nav-icon>
      <v-toolbar-title>{{this.appName}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <p style='color:red' v-if="this.errorStatus == true">{{this.error}}</p>
      <v-toolbar-items v-if="this.$store.state.loggedIn">
        <v-btn :to="{name:'Account'}" @click.stop="drawer = false" fab>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else>
        <v-btn :to="{name:'Login'}" @click.stop="drawer = false">Login</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer app color="secondary">
      <span>&copy; {{ new Date().getFullYear() }}</span><v-btn text x-small to="/security-policy">Security Policy</v-btn>
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  props: {
    source: "www.google.com",
  },
  data: () => ({
    drawer: null,
    errorStatus: false,
    error: "",
  }),
  computed: {
    userAccount() {
      return this.$store.state.userAccount
    },
    theme() {
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    },
    appName() {
      return (this.$vuetify.breakpoint.name == 'xs') ? 'AP Comp Doc' : 'AP Computer Science Doc'
    }
  },
  watch: {
    userAccount(newVal, oldVal) {
      if (Object.hasOwnProperty.call(newVal,'username')) {
        this.errorStatus = false
      }
    }
  },
  async created() {
    // set theme
    this.$vuetify.theme.dark = true;

    // set logged in status -- make logic later with stored 'remember me'
    this.$store.state.loggedIn = false;

    // check if login exists
    if (window.localStorage.getItem("login") == "true") {
      // fires if no session is already active but login is present in LS -- cookie is still present at this point
      console.log('Sending Login to Server');
      // sends cookie with request
      this.$http
      .get(`${process.env.VUE_APP_API_URL}/api/login`)
      .then((res) => {
        // check for correctness
        if (res.data === false) {
          alert("Error Logging In");
        } else {
          console.log(res.data);
          this.$store.dispatch("commitLoggedIn", true);
          this.$store.dispatch("commitUserAccount", res.data[0]);
          window.localStorage.setItem('token',res.data[0].sessionToken)
        }
      })
      .catch((err) => {
        console.log(err);
        this.errorStatus = true;
        this.error = "Error Logging In, Please Try Again"
        window.localStorage.removeItem('login')
      });
    }
  },
  methods: {
    yummy() {
      this.$vuetify.theme.themes.light.background = "#996236"
      this.$vuetify.theme.themes.light.primary = "#F8B12C"
      this.$vuetify.theme.themes.light.secondary = "#829D36"
      this.$vuetify.theme.themes.dark.background = "#382615"
      this.$vuetify.theme.themes.dark.primary = "#859D3C"
      this.$vuetify.theme.themes.dark.secondary = "#9D221E"
    }
  }
};
</script>

<style>
  html{
    overflow-y: auto;
  } 
</style>