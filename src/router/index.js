import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Docs from '../views/Docs.vue'
import Challenges from '../views/Challenges.vue'
import Topics from '../views/Topics.vue'
import Posts from '../views/Posts.vue'
import Help from '../views/Help.vue'
import DocContainer from '../components/DocContainer.vue'
import ChallengeContainer from '../components/ChallengeContainer.vue'

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
    path: '/help',
    name: 'Help',
    component: Help
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
