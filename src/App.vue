  
<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <!-- Home -->
        <v-list-item link :to="{name: 'Home'}">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Docs -->
        <v-list-item link :to="{name: 'Docs'}">
          <v-list-item-action>
            <v-icon>mdi-file-document-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Docs</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Challenges -->
        <v-list-item link :to="{name: 'Challenges'}">
          <v-list-item-action>
            <v-icon>mdi-code-braces</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Challenges</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Topics -->
        <v-list-item link :to="{name: 'Topics'}">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Topics</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Posts -->
        <v-list-item link :to="{name: 'Posts'}">
          <v-list-item-action>
            <v-icon>mdi-forum</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Posts</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Help -->
        <v-list-item link :to="{name: 'Help'}">
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
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="shrink">
            <router-view> </router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  props: {
    source: "www.google.com",
  },
  data: () => ({
    drawer: null,
  }),
  created() {
    this.$vuetify.theme.dark = true;
  },
};
</script>