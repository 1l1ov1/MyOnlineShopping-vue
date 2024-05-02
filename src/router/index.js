import { createRouter, createWebHashHistory } from 'vue-router'
import ShoppingIndex from '../views/index/ShoppingIndex.vue'
import { userStore } from '@/store'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/',
    name: 'home',
    component: ShoppingIndex
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/login/LoginIndex.vue')
  },
  {
    path: '/register',
    name: 'register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/register/RegisterIndex.vue')
  },
  {
    path: '/forgetPassword',
    name: 'forgetPassword',
    component: () => import('../views/forgetPassword/forgetPassword.vue')
  },
  {
    path: '/goodsDetail/:id',
    name: 'goodsDetail',
    component: () => import('../views/goodsDetail/GoodsDetail.vue')
  },
  {
    path: '/createStore',
    name: 'createStore',
    component: () => import('../views/createStore/createStore.vue')
  },
  {
    path: '/myCart',
    name: 'myCart',
    component: () => import('../views/cart/myCart.vue')
  },
  {
    path: '/myFavorite',
    name: 'myFavorite',
    component: () => import('../views/favorite/UserFavorites.vue')
  },
  {
    path: '/myOrders',
    name: 'myOrders',
    component: () => import('../views/orders/AllOrders.vue')
  },
  {
    path: '/storeDetail/:id',
    name: 'storeDetail',
    component: () => import('../views/businessman/store/components/StoreDetail.vue')
  },
  {
    path: '/categoryDetail/:id',
    name: 'categoryDetail',
    component: () => import('../views/categoryDetail/CategoryDetail.vue')
  },
  {
    path: '/searchGoods',
    name: 'searchGoods',
    component: () => import('../views/search/SearchGoods.vue')
  },
  {
    path: '/searchStores',
    name: 'searchStores',
    component: () => import('../views/search/SearchStore.vue')
  },
  {
    path: '/userProfile',
    name: 'userProfile',
    component: () => import('../views/personCenter/UserProfile.vue')
  },
  {
    path: '/managerBack',
    name: 'managerBack',
    redirect: '/managerBack/user',
    component: () => import('../views/manager/WorkPlace.vue'),
    children: [
      {
        path: '/managerBack/statistic',
        component: () => import('../views/manager/statistic/StatisticsIndex.vue')
      },
      {
        path: '/managerBack/withdrawRecord',
        component: () => import('../views/manager/withdrawRecord/WithdrawRecord.vue')
      },
      {
        path: '/managerBack/user',
        component: () => import('../views/manager/user/ManageUser.vue')
      },
      {
        path: '/managerBack/goods',
        component: () => import('../views/manager/goods/ManageGoods.vue')
      },
      {
        path: '/managerBack/category',
        component: () => import('../views/manager/category/GoodsCategory.vue')
      },
      {
        path: '/managerBack/store',
        component: () => import('../views/manager/store/AllStores.vue')
      },
      {
        path: '/managerBack/orders/all',
        component: () => import('../views/manager/orders/AllOrders')
      },
      {
        path: '/managerBack/orders/UnfilledOrders',
        component: () => import('../views/manager/orders/UnfilledOrders')
      },
      {
        path: '/managerBack/orders/ShippedOrders',
        component: () => import('../views/manager/orders/FilledOrders')
      },
      {
        path: '/managerBack/orders/RefundOrder',
        component: () => import('../views/manager/orders/RefundOrders')
      },
      {
        path: '/managerBack/orders/UserReceiveProduct',
        component: () => import('../views/manager/orders/UserReceiveProduct')
      },
      {
        path: '/managerBack/orders/SuccessfulOrder',
        component: () => import('../views/manager/orders/SuccessfulOrders')
      },
      {
        path: '/managerBack/person/profile',
        component: () => import('../views/manager/user/UserProfile.vue')
      },
      {
        path: '/managerBack/person/password',
        component: () => import('../views/manager/user/UserPassword.vue')
      },
      {
        path: '/managerBack/apply/all',
        component: () => import('../views/manager/apply/allApply.vue')
      },
      {
        path: '/managerBack/apply/under_review',
        component: () => import('../views/manager/apply/underViewApply.vue')
      },
      {
        path: '/managerBack/apply/approved',
        component: () => import('../views/manager/apply/approvedApply.vue')
      },
      {
        path: '/managerBack/apply/review_rejection',
        component: () => import('../views/manager/apply/reviewReject.vue')
      },
      {
        path: '/managerBack/report/comment-report',
        component: () => import('../views/manager/report/CommentReport.vue')
      }
    ]
  },
  {
    path: '/businessBack',
    name: 'businessBack',
    component: () => import('../views/businessman/WorkPlace.vue'),
    children: [
      {
        path: '/businessBack/statistics',
        component: () => import('../views/businessman/statistics/StatisticsIndex.vue')
      },
      {
        path: '/businessBack/withdrawRecord',
        component: () => import('../views/businessman/withdrawRecord/WithdrawRecord.vue')
      },
      {
        path: '/businessBack/goods',
        component: () => import('../views/businessman/goods/ManageGoods.vue')
      },
      {
        path: '/businessBack/store',
        component: () => import('../views/businessman/store/MyStore.vue')
      },
      {
        path: '/businessBack/orders/all',
        component: () => import('../views/businessman/orders/AllOrders')
      },
      {
        path: '/businessBack/orders/UnfilledOrders',
        component: () => import('../views/businessman/orders/UnfilledOrders')
      },
      {
        path: '/businessBack/orders/ShippedOrders',
        component: () => import('../views/businessman/orders/FilledOrders')
      },
      {
        path: '/businessBack/orders/RefundOrder',
        component: () => import('../views/businessman/orders/RefundOrders')
      },
      {
        path: '/businessBack/orders/UserReceiveProduct',
        component: () => import('../views/businessman/orders/UserReceiveProduct')
      },
      {
        path: '/businessBack/orders/SuccessfulOrder',
        component: () => import('../views/businessman/orders/SuccessfulOrders')
      },
      {
        path: '/businessBack/report/comment-report',
        component: () => import('../views/businessman/report/CommentReport')
      },
      {
        path: '/businessBack/person/profile',
        component: () => import('../views/businessman/user/UserProfile.vue')
      },
      {
        path: '/businessBack/person/password',
        component: () => import('../views/businessman/user/UserPassword.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 登录访问拦截 默认直接放行 根据返回值决定，是放行，还是拦截
// 登录访问拦截 => 默认是直接放行的,不是next了
// 根据返回值决定，是放行还是拦截
// 返回值：
// 1. undefined / true  直接放行
// 2. false 拦回from的地址页面
// 3. 具体路径 或 路径对象  拦截到对应的地址
//    '/login'   { name: 'login' }
// 白名单
const whiteList = ['/login', '/register', '/forgetPassword']
router.beforeEach((to) => {
  // 如果没有token, 那么就只能访问登录、注册和忘记密码页面，其他的一律不允许访问
  const userStoreInstance = userStore()

  if (!userStoreInstance.token) {
    // 如果说用户在没有登录的情况下点击了去往首页的话，就要给予一个提示，然后拦截
    if (to.path === '/') {
      ElMessage({
        message: '<strong>请先登录，登陆后才能前往主页</strong>',
        type: 'warning',
        grouping: true,
        dangerouslyUseHTMLString: true
      })
      // 拦截
      return '/login'
    } else if (!whiteList.includes(to.path)) {
      // 如果在白名单内就直接跳去登录
      return '/login'
    }
  }
})

export default router
