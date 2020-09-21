<template>
    <v-container>
    <v-row align="center">
      <v-col class="text-center">
        <v-card max-width='50%'>
            <v-card-title>Login</v-card-title>
            <v-card-actions>
              <v-form>
              <v-input></v-input>
              <v-input></v-input>
              <v-checkbox></v-checkbox>
              </v-form>
            </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    name: 'Login'
}
</script>