<template>
    <v-container>
        <v-row justify="center" align="center">
            <v-col cols='12' sm="12" md="6" lg="8" xl="6">
                <v-card color="secondary">
                    <v-card-title :class="bgColor"> Need Help? </v-card-title>
                    <v-card-subtitle :class="bgColor"> Send Me An Email! </v-card-subtitle>
                        <v-form>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="First Name" v-model="first"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="Last Name" v-model="last"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field label="Subject" v-model="subject"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-textarea label="Describe What you Need Help With" :class="bgColor" class="pa-2" v-model="body">
                                        </v-textarea>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-btn :href='emailURI' target="_blank" @click="first='';last='';subject='';body=''">Send</v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-form>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center" align="center">
            <v-col cols='12' sm="12" md="6" lg="8" xl="6">
                <v-card color="secondary">
                    <v-card-title>Doesn't Work?</v-card-title>
                    <v-card-text>If the form above doesn't work, your browser probably has the email protocol handler disabled. You can enable it by <a href="https://support.procore.com/faq/how-do-i-change-my-web-browsers-default-email-client-for-mailto-links">enabling it in your browser settings</a> or you can email me @<strong>jacobbrucedev@gmail.com</strong></v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'Help',
    computed: {
        bgColor: function() {
            return (this.$vuetify.theme.dark) ? 'secondary' : 'secondary darken-1';
        },
        emailURI: function() {
            return `mailto:jacobbrucedev@gmail.com?subject=${this.subject}&body=${this.bodyText}`
        },
        name: function() {
            return (this.last != "") ? this.first + " " + this.last : this.first; 
        },
        bodyText: function() {
            return `${this.name} says...%0D$0D${this.body}`
        }
    },
    data: function() {
        return {
            subject: "",
            first: "",
            last: "",
            body: ""
        }
    }
}
</script>