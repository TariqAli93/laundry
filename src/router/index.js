import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import LoginComponent from '../views/Login.vue'
import Users from '../views/Users.vue'
import Categories from '../views/Categories'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginComponent
  },
  {
    path: '/users',
    name: 'users',
    component: Users
  },
  {
    path:'/categories',
    name: 'categories',
    component: Categories
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
