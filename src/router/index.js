import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import LoginComponent from '../views/Login'
import Users from '../views/Users'
import Categories from '../views/Categories'
import ShowCategory from '../components/Categories/showCategory'
import Items from '../views/Items'

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
  },
  {
    path: '/categories/:id',
    name: 'showcategory',
    component: ShowCategory
  },
  {
    name: 'items',
    path: '/items',
    component: Items
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
