import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "../stores/user.js"
import HomeView from '../views/HomeView.vue'
import Login from "../components/auth/Login.vue"
import Register from "../components/auth/Register.vue"
import ChangePassword from "../components/auth/Passwords.vue"
import Dashboard from "../components/Dashboard.vue"
import Transaction from "../components/transactions/Transaction.vue"
import Transactions from "../components/transactions/Transactions.vue"
import Vcards from "../components/vcards/Vcards.vue"
import Users from "../components/users/Users.vue"
import Categories from "../components/categories/Categories.vue"
import Category from "../components/categories/Category.vue"
import Profile from "../components/auth/Profile.vue"
import NewTransactionCredit from "../components/transactions/TransactionCredit.vue"
import DashboardAdmin from "../components/DashboardAdmin.vue"
import User from "../components/users/User.vue"
import DeleteAcount from "../components/auth/DeleteAcount.vue"

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
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/password',
      name: 'ChangePassword',
      component: ChangePassword
    },
    {
      path: '/deleteAcount',
      name: 'DeleteAcount',
      component: DeleteAcount
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/dashboard/admin',
      name: 'DashboardAdmin',
      component: DashboardAdmin
    },
    
    
    {
      path: '/vcards',
      name: 'Vcards',
      component: Vcards,
    },


    //categorias
    {
      path: '/categories',
      name: 'Categories',
      component: Categories,
    },
    {
      path: '/categories/current',
      name: 'CurrentCategories',
      component: Categories,
      props: { onlyCurrentCategories: true, categoriesTitle: 'Current Categories' }
    },
    {
      path: '/categories/new',
      name: 'NewCategory',
      component: Category,
      props: { id: -1 }
    },
    {
      path: '/categories/:id',
      name: 'Category',
      component: Category,
      props: route => ({ id: parseInt(route.params.id) })
    },
    //fim categorias

    //categorias admin
    {
      path: '/categories/defaults',
      name: 'CategoriesDefaults',
      component: Categories,
    },
    {
      path: '/categories/defaults/current',
      name: 'CurrentCategoriesDefaults',
      component: Categories,
      props: { onlyCurrentCategories: true, categoriesTitle: 'Current Categories' }
    },
    {
      path: '/categories/defaults/new',
      name: 'NewCategoryDefaults',
      component: Category,
      props: { id: -1 }
    },
    {
      path: '/categories/defaults/:id',
      name: 'CategoryDefaults',
      component: Category,
      props: route => ({ id: parseInt(route.params.id) })
    },
    //fim categorias



    //transacoes


    {
      path: '/transactions/new',
      name: 'NewTransaction',
      component: Transaction,
      props: { id: -1 }
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: Transactions,
    },
    {
      path: '/transactions/credit/new',
      name: 'NewTransactionCredit',
      component: Transaction,
      props: { id: -1 }
    },
    {
      path: '/transactions/:id',
      name: 'Transaction',
      component: Transaction,
      props: route => ({ id: parseInt(route.params.id) })
    },











    //Gestão Users
    {
      path: '/users',
      name: 'Users',
      component: Users,
    },
    {
      path: '/users/:id',
      name: 'User',
    },
    {
      path: '/users/new',
      name: 'NewUser',
      component: User,
    },
  ]
})

router.beforeEach(async (to, from, next) => {  
  const userStore = useUserStore()  
  if (handlingFirstRoute) {
    handlingFirstRoute = false
    await userStore.restoreToken()
  }
  if ((to.name == 'Login') || (to.name == 'Register') || (to.name == 'home')) {
    next()
    return
  }
  if (!userStore.user) {
    next({ name: 'Login' })
    return
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

