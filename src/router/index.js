import { createRouter, createWebHashHistory } from 'vue-router'
import ShoppingIndex from '../views/index/ShoppingIndex.vue'
import { userStore } from '@/store'

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
router.beforeEach((to) => {
  // 如果没有token, 且访问的是非登录页且不是主页，拦截到登录，其他情况正常放行
  const userStoreInstance = userStore()
  if (!userStoreInstance.token && to.path !== '/login' && to.path !== '/' && to.path !== '/register') return '/login'
})

export default router
