import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import axios from 'axios'
import Home from '../views/Home.vue'
import Docs from '../views/Docs.vue'
import Challenges from '../views/Challenges.vue'
import Topics from '../views/Topics.vue'
import Posts from '../views/Posts.vue'
import Help from '../views/Help.vue'
import DocContainer from '../components/DocContainer.vue'
import ChallengeContainer from '../components/ChallengeContainer.vue'
import PostContainer from '../components/PostContainer.vue'
import Login from '../components/Login.vue'
import SignUp from '../components/SignUp.vue'
import Account from '../components/Account.vue'
import Admin from '../components/Admin.vue'
import PostCreator from '../components/PostCreator.vue'
import DocCreator from '../components/DocCreator.vue'
import ChallengeCreator from '../components/ChallengeCreator.vue'
import Review from '../components/Review.vue'
import Update from '../components/Update.vue'
import TextEditor from '../components/TextEditor.vue'
import SecurityPolicy from '../components/Security.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/docs',
    name: 'Docs',
    component: Docs
  },
  {
    path: '/docs/:id',
    name: 'DocContainer',
    component: DocContainer
  },
  {
    path: '/challenges',
    name: 'Challenges',
    component: Challenges
  },
  {
    path: '/challenges/:id',
    name: 'ChallengeContainer',
    component: ChallengeContainer
  },
  {
    path: '/topics',
    name: 'Topics',
    component: Topics
  },
  {
    path: '/community/posts',
    name: 'Posts',
    component: Posts
  },
  {
    path: '/community/posts/:id',
    name: 'PostContainer',
    component: PostContainer
  },
  {
    path: '/help',
    name: 'Help',
    component: Help
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp
  },
  {
    path: '/my-account',
    name: 'Account',
    component: Account
  },
  {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      beforeEnter: (to, from, next) => {
        setTimeout(() => {console.log('BeforeEnter')
        var account = store.state.userAccount
        axios.get(`${process.env.VUE_APP_API_URL}/api/get/users/?userId=${account.userId}`).then(result => {
          if (result.data[0].roles.includes('admin')) {
            next()
          } else {
            next({name: 'Home'})
            alert('Do not have permission!')
          }
          
        })}, 1000)
      },
      children: [
          {
            path: 'create-post',
            component: PostCreator
          },
          {
            path: 'create-doc',
            component: DocCreator
          },
          {
            path: 'create-challenge',
            component: ChallengeCreator
          },
          {
            path: 'review',
            component: Review
          },
          {
            path: 'update',
            component: Update
          },
          {
            path: 'text-editor',
            component: TextEditor
          }
      ]
  },
  {
    path: '/security-policy',
    name: 'Security-Policy',
    component: SecurityPolicy
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
