import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import LoginComponent from '../views/Login'
import Users from '../views/Users'
import Categories from '../views/Categories'
import ShowCategory from '../components/Categories/showCategory'
import showVendor from '../components/Vendor/showVendor'
import Items from '../views/Items'
import Support from "../views/Support";
import Reports from "../views/Reports";


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
    path: '/user/categories/:id',
    name: 'showcategory',
    component: ShowCategory
  },
  {
    path: '/user/vendor/:id',
    name: 'showvendor',
    component: showVendor
  },
  {
    name: 'items',
    path: '/items',
    component: Items
  },
  {
    name: 'support',
    path: '/support',
    component: Support
  },
  {
    name: 'reports',
    path: '/reports',
    component: Reports
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
