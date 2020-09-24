<template>
    <v-container> 
        <v-row fluid>
            <v-col cols='12'>
                <v-btn to="/admin/create-post"> Posts </v-btn>
                <v-spacer />
                <v-btn to="/admin/create-doc"> Docs </v-btn>
                <v-spacer />
                <v-btn to="/admin/create-challenge"> Challenges </v-btn>
            </v-col>
        </v-row>
        <v-row fluid>
            <v-col cols='12'>
                <router-view></router-view>
            </v-col>
        </v-row>
    </v-container>
</template>

<<script>
export default {
    name: 'Admin'
}
</script>