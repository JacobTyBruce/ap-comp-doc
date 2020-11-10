<template>
    <v-container fluid>
        <v-row justify="center">
            <h1>Your Security Matters</h1>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" md="6">
              <h3>
               This site is self-contained, meaning that no account information is never given out to any party. On top of this, I've spent many hours and sleepless nights researching techniques, methods, and best practices to ensure that your account and your data is safe and secure. 
            </h3>  
            </v-col>
        </v-row>
        <v-row justify="space-around">
            <v-col cols="6" sm="6" md="3">
                <v-card>
                    <v-card-title>Token-Based Sessions</v-card-title>
                    <v-card-text>
                        We use token-based sessions to ensure user experience quality and secure user sessions. No critical user information is ever stored in these tokens and rotate often.
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="6" md="3">
                <v-card>
                    <v-card-title>Secure API</v-card-title>
                    <v-card-text>
                        Whenever you visit a page on this site, you are mostly likely interacting with our API. We make sure our API is secure and that no one can use it who isn't authorized. We also never return any senstive data that is not needed in the request, for example we never return your account's password.
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="6" md="3">
                <v-card>
                    <v-card-title>Secure User Data</v-card-title>
                    <v-card-text>
                        User data is encrypted using a strong hashing-function and never given out to any party. You can be sure no data is ever given out to any party and that your data is secure.
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <br/>
        <v-row justify="center">
            <v-col cols="8">
                <h3>With all this in note, this site does use cookies, but are kept on this site only and are never given out. They are purely for user experience and to make the site functional. They do not track you in any way</h3>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" md="4">
                <h5>
                If you have any concerns or questions about your security, feel free to fill out <v-btn to="/help" text x-small>this</v-btn> form or email me! I will be happy to assist you!
            </h5>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'SecurityPolicy'
}
</script>