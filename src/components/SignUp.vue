<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Sign Up</v-card-title>
          <v-card-actions>
            <v-form v-model="valid">
              <div v-if="error.length > 0">
                <v-alert type="error" v-for="(errors,index) in this.error" :key="index">{{errors}}</v-alert>
              </div>
              <v-text-field label="Email" v-model="email" outlined required :rules="rules.email"></v-text-field>
              <v-text-field label="Username" v-model="username" outlined required :rules="rules.username"></v-text-field>
              <v-text-field label="Password" v-model="password" outlined required :rules="rules.password" type="password"></v-text-field>
              <v-checkbox label="Agree to TOS" v-model="agree" required v-on="on"></v-checkbox>
              <v-btn text @click="dialog=true">View TOS</v-btn>
              <v-btn text @click="privacy=true">View Privacy Policy</v-btn>
              <v-btn text @click="disclaimer=true">View Disclaimer</v-btn>
              <br/>
              <br/>
              <v-btn color="success" @click="signup(username, email, password)" :disabled="!valid">Sign Up</v-btn>
            </v-form>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="50%">
      <v-card>
        <v-card-title>Website Terms and Conditions of Use</v-card-title>
        <v-card-text>
        <h2>1. Terms</h2>

        <p>By accessing this Website, accessible from www.apcompdoc.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.</p>

        <h2>2. Use License</h2>

        <p>Permission is granted to temporarily download one copy of the materials on APCompDoc's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>

        <ul>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose or for any public display;</li>
            <li>attempt to reverse engineer any software contained on APCompDoc's Website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transferring the materials to another person or "mirror" the materials on any other server.</li>
        </ul>

        <p>This will let APCompDoc to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format. These Terms of Service has been created with the help of the <a href="https://www.termsofservicegenerator.net">Terms Of Service Generator</a> and the <a href="https://www.generateprivacypolicy.com">Privacy Policy Generator</a>.</p>

        <h2>3. Disclaimer</h2>

        <p>All the materials on APCompDoc’s Website are provided "as is". APCompDoc makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, APCompDoc does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.</p>

        <h2>4. Limitations</h2>

        <p>APCompDoc or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on APCompDoc’s Website, even if APCompDoc or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.</p>

        <h2>5. Revisions and Errata</h2>

        <p>The materials appearing on APCompDoc’s Website may include technical, typographical, or photographic errors. APCompDoc will not promise that any of the materials in this Website are accurate, complete, or current. APCompDoc may change the materials contained on its Website at any time without notice. APCompDoc does not make any commitment to update the materials.</p>

        <h2>6. Links</h2>

        <p>APCompDoc has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by APCompDoc of the site. The use of any linked website is at the user’s own risk.</p>

        <h2>7. Site Terms of Use Modifications</h2>

        <p>APCompDoc may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.</p>

        <h2>8. Your Privacy</h2>

        <v-btn text @click="dialog=false;privacy=true">Please read our Privacy Policy.</v-btn>

        <h2>9. Governing Law</h2>

        <p>Any claim related to APCompDoc's Website shall be governed by the laws of us without regards to its conflict of law provisions.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" @click.stop="dialog=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="privacy" width="50%">
      <v-card>
        <v-card-title>Privacy Policy for APCompDoc</v-card-title>
        <v-card-text>
          <p>At APCompDoc, accessible from www.apcompdoc.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by APCompDoc and how we use it.</p>

          <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us. Our Privacy Policy was created with the help of the <a href="https://www.generateprivacypolicy.com">Privacy Policy Generator</a> and the <a href="https://www.privacypolicies.com/privacy-policy-generator/">Online Privacy Policy Generator</a>.</p>

          <h2>Cookies and Web Beacons</h2>

          <p>Like any other website, APCompDoc uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

          <p>For more general information on cookies, please read <a href="https://www.cookieconsent.com/what-are-cookies/">"What Are Cookies" from Cookie Consent</a>.</p>

          <p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites. What Are Cookies?</p>

          <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>

          <p>APCompDoc does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>

          <h2>Online Privacy Policy Only</h2>

          <p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in APCompDoc. This policy is not applicable to any information collected offline or via channels other than this website.</p>

          <h2>Consent</h2>

          <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" @click.stop="privacy=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="disclaimer" width="50%">
      <v-card>
        <v-card-title>Disclaimer for APCompDoc</v-card-title>
        <v-card-text>
          <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us. Our Disclaimer was generated with the help of the <a href="https://www.disclaimergenerator.org/">Disclaimer Generator</a></p>

          <h2>Disclaimers for APCompDoc</h2>

          <p>All the information on this website - www.apcompdoc.com - is published in good faith and for general information purpose only. APCompDoc does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website (APCompDoc), is strictly at your own risk. APCompDoc will not be liable for any losses and/or damages in connection with the use of our website.</p>

          <p>From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.</p>

          <p>Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their "Terms of Service" before engaging in any business or uploading any information. Our Privacy Policy was created by <a href="https://www.generateprivacypolicy.com/">the Privacy Policy Generator</a>.</p>

          <h2>Consent</h2>

          <p>By using our website, you hereby consent to our disclaimer and agree to its terms.</p>

          <h2>Update</h2>

          <p>Should we update, amend or make any changes to this document, those changes will be prominently posted here.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" @click.stop="disclaimer=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  data: function () {
    return {
      dialog: false,
      privacy: false,
      disclaimer: false,
      valid: false,
      email: "",
      username: "",
      password: "",
      agree: false,
      error: [],
      rules: {
        email: [
          v => !!v || 'Email is required',
          v => /.+@.+/.test(v) || 'Email must be valid'
        ],
        username: [
          v => !!v || 'Username is required',
          async v => {
            try {
              var usernames = await this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/users/?username=${this.username}`)
              console.log(usernames.data.length)
            } catch (error) {
              console.log('Trouble getting usernames')
            }
            if (usernames.data.length > 0) {
              return 'Try another username'
            } else {
              return true
            }
          }
        ],
        password: [
          v => !!v || 'Please Enter A Password',
          v => v.length >= 8 || 'Password Must Be At Least 8 Characters',
          v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g.test(v) || 'Password Must Contain An Uppercase Letter, Lowercase Letter, and a Number'
        ]
      }
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
