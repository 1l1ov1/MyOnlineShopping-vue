<script setup>
import NavigationComponent from '@/views/components/NavigationComponent.vue'
import FooterComponent from '@/views/components/FooterComponent.vue'
import OrdersHeader from './components/OrdersHeader.vue'
import OrdersMain from './components/OrdersMain.vue'
import OrdersFooter from './components/OrdersFooter.vue'
import { userQueryOrdersService } from '@/api/user'
import { userStore } from '@/store'
import { onMounted, ref } from 'vue'
const userStoreInstance = userStore()
const user = ref({
  ...userStoreInstance.user
})
const activeName = ref('all')
const ordersList = ref()
const OrdersType = {
  ALL: 0,
  UNFILLED: 1,
  FILLED: 2,
  REFUND: 3
}
const translation = (activeName) => {
  switch (activeName) {
    case 'all': return OrdersType.ALL
    case 'unfilled': return OrdersType.UNFILLED
    case 'filled': return OrdersType.FILLED
    case 'refund': return OrdersType.REFUND
  }
}
// 当标签页转换的时候
const tabChange = (tabName) => {
  if (tabName === 'all') {
    queryOneTypeOrders(OrdersType.ALL)
  } else if (tabName === 'unfilled') {
    queryOneTypeOrders(OrdersType.UNFILLED)
  } else if (tabName === 'filled') {
    queryOneTypeOrders(OrdersType.FILLED)
  } else if (tabName === 'refund') {
    queryOneTypeOrders(OrdersType.REFUND)
  }
}

// 分页触发
const pageObj = ref({
  pageSize: 10,
  currentPage: 1,
  total: 0
})
const pagination = (page) => {
  pageObj.value.pageSize = page.pageSize
  pageObj.value.currentPage = page.currentPage
  queryOneTypeOrders(translation(activeName.value))
}
// 查询某一种类型的订单
const queryOneTypeOrders = async (target) => {
  const res = await userQueryOrdersService(user.value.id, target, pageObj.value.currentPage, pageObj.value.pageSize)
  if (res.code === 1) {
    ordersList.value = res.data.data
    pageObj.value.total = res.data.total
  }
}
onMounted(() => {
  queryOneTypeOrders(OrdersType.ALL)
})
</script>

<template>
  <NavigationComponent></NavigationComponent>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-change="tabChange" :before-leave="beforeLeave"
    @tab-click="tabClick">
    <el-tab-pane label="全部订单" name="all">
      <OrdersFooter :ordersList="ordersList" :pageObj="pageObj" @pagination="pagination"></OrdersFooter>
      <OrdersHeader></OrdersHeader>
      <OrdersMain :ordersList="ordersList"></OrdersMain>
      <OrdersFooter :ordersList="ordersList" :pageObj="pageObj" @pagination="pagination"></OrdersFooter>
    </el-tab-pane>
    <el-tab-pane label="未发货订单" name="unfilled">
      <OrdersFooter :ordersList="ordersList" :pageObj="pageObj" @pagination="pagination"></OrdersFooter>
      <OrdersHeader></OrdersHeader>
      <OrdersMain :ordersList="ordersList"></OrdersMain>
      <OrdersFooter :ordersList="ordersList" :pageObj="pageObj" @pagination="pagination"></OrdersFooter>
    </el-tab-pane>
    <el-tab-pane label="已发货订单" name="filled">
      <OrdersFooter :ordersList="ordersList" :pageObj="pageObj" @pagination="pagination"></OrdersFooter>
      <OrdersHeader></OrdersHeader>
      <OrdersMain :ordersList="ordersList"></OrdersMain>
      <OrdersFooter :ordersList="ordersList" :pageObj="pageObj" @pagination="pagination"></OrdersFooter>
    </el-tab-pane>
    <el-tab-pane label="退款订单" name="refund">
      <OrdersFooter :ordersList="ordersList" :pageObj="pageObj" @pagination="pagination"></OrdersFooter>
      <OrdersHeader></OrdersHeader>
      <OrdersMain :ordersList="ordersList"></OrdersMain>
      <OrdersFooter :ordersList="ordersList" :pageObj="pageObj" @pagination="pagination"></OrdersFooter>
    </el-tab-pane>
  </el-tabs>
  <FooterComponent></FooterComponent>
</template>

<style lang='less' scoped>
/deep/.el-tabs__item {
  font-size: 1.2em;
}
</style>
