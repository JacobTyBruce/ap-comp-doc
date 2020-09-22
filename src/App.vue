  
<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
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
        <!-- Topics -->
        <v-list-item link :to="{name: 'Topics'}" @click.stop="drawer = false">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Topics</v-list-item-title>
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
        <!-- Help -->
        <v-list-item link :to="{name: 'Help'}" @click.stop="drawer = false">
          <v-list-item-action>
            <v-icon>mdi-account-question</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Help</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>AP Computer Science Docs</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items><v-btn :to="{name:'Login'}" @click.stop="drawer = false">Login</v-btn></v-toolbar-items>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    source: "www.google.com",
  },
  data: () => ({
    drawer: null,
  }),
  created() {
    this.$vuetify.theme.dark = true;

    // get docs
    axios.get(`http://${process.env.VUE_APP_DB_URL}/api/get/docs/all`).then((response) => {
        this.$store.dispatch('commitDocs', response.data )
    }).catch((error) => {
        alert(process.env.SERVER_URL)
    })
    // get challenges
    axios.get(`http://${process.env.VUE_APP_DB_URL}/api/get/challenges/all`).then((response) => {
        this.$store.dispatch('commitChallenges', response.data )
    }).catch(() => {
        alert('error getting challenges')
    })
    // get users
    axios.get(`http://${process.env.VUE_APP_DB_URL}/api/get/users/all`).then((response) => {
        this.$store.dispatch('commitUsers', response.data )
    }).catch(() => {
        alert('error getting users')
    })
    // get posts
    axios.get(`http://${process.env.VUE_APP_DB_URL}/api/get/posts/all`).then((response) => {
        this.$store.dispatch('commitPosts', response.data )
    }).catch(() => {
        alert('error getting posts')
    })
    
  }
};
</script>