import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Dashboard from '@/views/authorized/Dashboard'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: function (to, from, next) {
      const authorized = Vue.prototype.$db.authorized()
      if (authorized) {
        if (from) {
          next(from)
        } else {
          next('/')
        }
      } else {
        next(true)
      }
    }
  },
  {
    path: '/',
    component: Home,
    beforeEnter: function (to, from, next) {
      const authorized = Vue.prototype.$db.authorized()
      if (authorized) {
        next(true)
      } else {
        next('/login')
      }
    },
    children: [
      {
        path: '',
        component: Dashboard
      },
      {
        path: '/dhcp/filter',
        component: () => import('../views/authorized/dhcp/filter/Index')
      },
      {
        path: '/dhcp/lease',
        component: () => import('../views/authorized/dhcp/lease/Index')
      },
      {
        path: '/dns/record/:zoneName',
        component: () => import('../views/authorized/dns/record/Index')
      },
      {
        path: '/svn/repository',
        component: () => import('../views/authorized/svn/repository/Index')
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes
})

export default router
