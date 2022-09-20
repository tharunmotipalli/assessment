import Vue from 'vue'
import VueRouter from 'vue-router'
import CustomerTable from '../components/CustomerTable.vue'
import HotelTable from '../components/HotelTable.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/customers',
    name: 'customers',
    component:CustomerTable
  },
  {
    path: '/hotels',
    name: 'hotels',  
    component:HotelTable
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
