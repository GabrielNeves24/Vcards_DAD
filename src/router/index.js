import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "../stores/user.js"
import HomeView from '../views/HomeView.vue'
import Login from "../components/auth/Login.vue"
import ChangePassword from "../components/auth/ChangePassword.vue"
import Dashboard from "../components/Dashboard.vue"
import Transaction from "../components/transactions/Transaction.vue"
import Transactions from "../components/transactions/Transactions.vue"
import Vcards from "../components/vcards/Vcards.vue"
import Users from "../components/users/Users.vue"


let handlingFirstRoute = true

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/password',
      name: 'ChangePassword',
      component: ChangePassword
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: Transactions,
    },
    {
      path: '/tasks/current',
      name: 'CurrentTasks',
      //component: Tasks,
      //props: { onlyCurrentTasks: true, tasksTitle: 'Current Tasks' }
    },
    {
      path: '/transactions/new',
      name: 'NewTransaction',
      component: Transaction,
      props: { id: -1 }
    },
    {
      path: '/vcards',
      name: 'Vcards',
      component: Vcards,
    },








    // {
    //   path: '/users',
    //   name: 'users',
    //   component: Users,
    // },






    {
      path: '/tasks/:id',
      name: 'Task',
      //component: Task,
      //props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/projects',
      name: 'Projects',
      //component: Projects,
    },
    {
      path: '/projects/new',
      name: 'NewProject',
      //component: Project,
      //props: { id: -1 }
    },
    {
      path: '/projects/:id',
      name: 'Project',
      //component: Project,
      //props: route => ({ id: parseInt(route.params.id) })
    },

    {
      path: '/users',
      name: 'Users',
      component: Users,
    },
    {
      path: '/users/:id',
      name: 'User',
      //component: User,
      //props: true
      // Replaced with the following line to ensure that id is a number
      //props: route => ({ id: parseInt(route.params.id) })
    }, 
    {
      path: '/projects/:id/tasks',
      name: 'ProjectTasks',
      //component: ProjectTasks,
      //props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/projects/:id/tasks/new',
      name: 'NewTaskOfProject',
      //component: Task,
      //props: route => ({ id:-1, fixedProject:  parseInt(route.params.id) })
    },
    {
      path: '/reports',
      name: 'Reports',
      //component: () => import('../views/AboutView.vue')
    },
  ]
})

router.beforeEach(async (to, from, next) => {  
  const userStore = useUserStore()  
  if (handlingFirstRoute) {
    handlingFirstRoute = false
    await userStore.restoreToken()
  }
  if ((to.name == 'Login') || (to.name == 'home')) {
    next()
    return
  }
  if (!userStore.user) {
    next({ name: 'Login' })
    return
  }
  if (to.name == 'Reports') {
    if (userStore.user.type != 'A') {
      next({ name: 'home' })
      return
    }
  }
  if (to.name == 'User') {
    if ((userStore.user.type == 'A') || (userStore.user.id == to.params.id)) {
      next()
      return
    }
    next({ name: 'home' })
    return
  }
  next()
})


export default router

