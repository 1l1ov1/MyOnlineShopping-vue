<script setup>
import PageContainer from '@/components/PageContainer.vue'
import StoreSales from './components/StoreSales.vue'
import OrderUserCount from './components/OrderUserCount.vue'
import OrdersCount from './components/OrdersCount.vue'
import SalesTop10 from './components/SalesTop10.vue'
import { ref, onMounted } from 'vue'
import {
  queryStoreSales, queryOrdersUserCount,
  queryOrdersCountService, querySalesTop10Service, exportDate
} from '@/api/statistic'
import { ElMessageBox } from 'element-plus'

// 营业额范围
const StoreSalesRangeType = {
  YESTERDAY: {
    value: -1,
    label: '昨日'
  },
  LAST_7_DAYS: {
    value: -7,
    label: '近7日'
  },
  LAST_30_DAYS: {
    value: -30,
    label: '近30日'
  },
  THIS_WEEK: {
    value: 7,
    label: '本周'
  },
  THIS_MONTH: {
    value: 30,
    label: '本月'
  },
  getValueByLabel: (label) => {
    const range = Object.values(StoreSalesRangeType)
      .find(rangeItem => rangeItem.label === label)
    return range || null // 返回匹配到的枚举项，否则返回null表示未找到
  }
}

// 标签页名
const activeName = ref('昨日')
// 点击标签页
const handleTabClick = async (tab, event) => {
  if (tab.props.name === '导出数据' || tab.props.name === '营业额提现') {
    return
  }
  const value = StoreSalesRangeType.getValueByLabel(tab.props.label).value
  await queryStoreSalesInOneDay(value)
  queryOrderUserCount(value)
  queryOrdersCount(value)
  querySalesTop10(value)
}
// 营业额
const storeSalesList = ref()
// 总营业额
const totalRevenue = ref()
const storeSalesStartTime = ref()
const storeSalesEndTime = ref()
const datesInRange = ref([])
const dailySales = ref([])
// 查询营业额
const queryStoreSalesInOneDay = async (day) => {
  const res = await queryStoreSales(day)

  totalRevenue.value = res.data.totalRevenue
  // 如果没有营业额
  if (totalRevenue.value === null || totalRevenue.value === undefined) {
    totalRevenue.value = 0
  }
  storeSalesList.value = res.data.storeSalesList

  // 格式化时间
  storeSalesStartTime.value = formatDateToString(new Date(res.data.start))
  storeSalesEndTime.value = formatDateToString(new Date(res.data.end))

  // 存放每天的营业额
  getDailySales()

  // 每次查询后都得到时间区间
  datesInRange.value = getTimeRangeStrings(storeSalesStartTime.value, storeSalesEndTime.value)
  updateStoreSalesChartOptions()
}
// 用户数量
const totalUserCount = ref(0)
// 注册用户数量
const storeSalesAndCategoryNameList = ref([])
// 开始和结束时间
// 查询用户数量
const queryOrderUserCount = async (day) => {
  const res = await queryOrdersUserCount(day)
  totalUserCount.value = res.data.totalUserCount
  if (totalUserCount.value === undefined || totalUserCount.value === null) {
    totalUserCount.value = 0
  }
  const temp = res.data.storeSalesAndCategoryNameList
  // 清空上一次的
  storeSalesAndCategoryNameList.value = []
  if (temp.length === 0) {
    storeSalesAndCategoryNameList.value.push({ value: 0, name: '暂无' })
  } else {
    // 如果不空，就遍历
    for (const storeSales of temp) {
      storeSalesAndCategoryNameList.value.push({ value: storeSales.orderCount, name: storeSales.categoryName })
    }
  }
  // 格式化时间
  updateOrdersUserCountChartOptions()
}

const totalCountList = ref([])
const successfulOrdersCountList = ref([])
const ordersCompletionRate = ref(0.00)
const totalCount = ref(0)
const successfulOrdersCount = ref(0)
// 查询订单数量
const queryOrdersCount = async (day) => {
  const res = await queryOrdersCountService(day)

  totalCountList.value = []
  successfulOrdersCountList.value = []

  totalCountList.value = res.data.totalOrdersCountList
  totalCount.value = res.data.totalOrdersCount

  successfulOrdersCountList.value = res.data.successfulOrdersCountList
  successfulOrdersCount.value = res.data.successfulOrdersCount

  ordersCompletionRate.value = res.data.ordersCompletionRate
  if (totalCountList.value.length === 0) {
    totalCountList.value.push({ value: 0, name: '暂无' })
  }

  if (successfulOrdersCountList.value.length === 0) {
    successfulOrdersCountList.value.push({ value: 0, name: '暂无' })
  }

  updateOrdersCountChartOptions()
}
// 商品名集合
const goodsNameList = ref([])
// 商品数量集合
const numberList = ref([])

// 查询销量排名前十
const querySalesTop10 = async (day) => {
  const res = await querySalesTop10Service(day)

  // 获取商品名与数量列表
  const goodsNameData = res.data.goodsNameList
  const numberData = res.data.numberList
  // 如果两者都为空，则填充“暂无数据”
  if (goodsNameData.length === 0 && numberData.length === 0) {
    goodsNameList.value = [{ value: '暂无数据', name: '暂无数据' }]
    numberList.value = [{ value: 0, name: '暂无数据' }]
  } else {
    goodsNameList.value = goodsNameData
    numberList.value = numberData
  }
  updateSalesTop10ChartOptions()
}
// 得到今天日期（保持不变）
const now = ref(new Date())

// 更新formatDate函数，使其返回格式化后的日期字符串
const formatDateToString = (date) => {
  // const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  return `${month}-${day}`
}
// 得到营业额
const getDailySales = () => {
  dailySales.value = []
  for (const storeSales of storeSalesList.value) {
    dailySales.value.push({ value: storeSales.dailySales, name: storeSales.storeName })
  }
  // 如果没有营业额
  if (dailySales.value.length === 0) {
    dailySales.value.push({ value: 0, name: '暂无' })
  }
}
// 修改营业额图表
const updateStoreSalesChartOptions = () => {
  // 确保 datesInRange 和 dailySales 都有有效数据
  if (datesInRange.value.length > 0 && dailySales.value.length > 0) {
    storeSalesOption.value.xAxis.data = datesInRange.value
    storeSalesOption.value.series[0].data = dailySales.value
    storeSalesOption.value.title.text = activeName.value + '营业额（总金额' + totalRevenue.value + '元)'
  }
}
// 修改用户订单表
const updateOrdersUserCountChartOptions = () => {
  if (datesInRange.value.length > 0 && storeSalesAndCategoryNameList.value.length > 0) {
    orderUserCountOption.value.xAxis.data = datesInRange.value
    orderUserCountOption.value.series[0].data = storeSalesAndCategoryNameList.value
    orderUserCountOption.value.title.text = activeName.value + '订单人数：' + totalUserCount.value + '人'
  }
}
// 修改订单数表
const updateOrdersCountChartOptions = () => {
  if (datesInRange.value.length > 0 &&
    totalCountList.value.length > 0 &&
    successfulOrdersCountList.value.length > 0) {
    ordersCountOption.value.xAxis.data = datesInRange.value
    ordersCountOption.value.series[0].data = totalCountList.value
    ordersCountOption.value.series[1].data = successfulOrdersCountList.value
    ordersCountOption.value.title.text = activeName.value + '总订单数量：' +
      totalCount.value + '  成功订单数量：' +
      successfulOrdersCount.value + '  订单完成率：' +
      (ordersCompletionRate.value * 100).toFixed(2) + '%'
  }
}
// 修改销量表
const updateSalesTop10ChartOptions = () => {
  if (datesInRange.value.length > 0 &&
    goodsNameList.value.length > 0 &&
    numberList.value.length > 0) {
    // salesTop10Option.value.xAxis.data = numberList.value
    salesTop10Option.value.yAxis.data = goodsNameList.value
    salesTop10Option.value.series[0].data = numberList.value
    salesTop10Option.value.title.text = activeName.value + '销量前十'
  }
}
// 得到时间范围（返回字符串数组）
const getTimeRangeStrings = (startDate, endDate) => {
  // 得到1天的毫秒值
  const oneDay = 60 * 60 * 24 * 1000

  // 将开始和结束时间转为毫秒
  const startDateInMs = new Date(startDate).getTime()
  const endDateInMs = new Date(endDate).getTime()

  // 存放时间范围的数组
  const datesInRange = []

  for (let currentDateInMs = startDateInMs;
    currentDateInMs <= endDateInMs;
    currentDateInMs += oneDay) {
    // 转换为日期对象并格式化为字符串，添加进数组
    datesInRange.push(formatDateToString(new Date(currentDateInMs)))
  }

  return datesInRange
}
// 营业额表设置
const storeSalesOption = ref({
  title: {
    text: activeName.value + '营业额（总金额' + totalRevenue.value + ')'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      snap: true
    },
    backgroundColor: '#fff', // 悬浮框背景色
    borderColor: '#000', // 悬浮框边框颜色
    borderWidth: 1, // 悬浮框边框宽度
    textStyle: { // 悬浮框文字样式
      color: '#000',
      fontSize: 12
    },
    formatter: function (params) {
      const name = params[0].data.name
      const value = params[0].data.value
      return name === '暂无' ? '今天无营业额' : '商店：' + name + ' 营业额：' + value
    }
  },
  xAxis: {
    type: 'category',
    data: datesInRange.value,
    name: '日期'
  },
  yAxis: {
    type: 'value',
    name: '营业额/元'
  },
  series: [
    {
      data: dailySales.value,
      type: 'line',
      emphasis: {
        label: {
          show: true
        }
      }

    }
  ]
}
)
// 注册用户数量表设置
const orderUserCountOption = ref({
  title: {
    text: activeName.value + '订单数量' + totalUserCount.value + '人'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      snap: true
    },
    backgroundColor: '#fff', // 悬浮框背景色
    borderColor: '#000', // 悬浮框边框颜色
    borderWidth: 1, // 悬浮框边框宽度
    textStyle: { // 悬浮框文字样式
      color: '#000',
      fontSize: 12
    },
    formatter: function (params) {
      const value = params[0].data.value
      return '订单人数' + value
    }
  },
  xAxis: {
    type: 'category',
    data: datesInRange.value,
    name: '日期'
  },
  yAxis: {
    type: 'value',
    name: '人数/人'
  },
  series: [
    {
      data: storeSalesAndCategoryNameList.value,
      type: 'line',
      emphasis: {
        label: {
          show: true
        }
      }

    }
  ]
})
// 订单数表
const ordersCountOption = ref({
  title: {
    text: activeName.value + '总订单数量：' +
      totalCount.value + '  成功订单数量：' +
      successfulOrdersCount.value + '  订单完成率：' +
      (ordersCompletionRate.value * 100).toFixed(2) + '%'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      snap: true
    },
    backgroundColor: '#fff', // 悬浮框背景色
    borderColor: '#000', // 悬浮框边框颜色
    borderWidth: 1, // 悬浮框边框宽度
    textStyle: { // 悬浮框文字样式
      color: '#000',
      fontSize: 12
    }
  },
  xAxis: {
    type: 'category',
    data: datesInRange.value,
    name: '日期'
  },
  yAxis: {
    type: 'value',
    name: '订单数量/件'
  },
  legend: {
    orient: 'horizontal',
    right: 0,
    bottom: 0,
    data: ['总订单数量', '成功订单数量']
  },
  series: [
    {
      name: '总订单数量',
      data: totalCountList.value,
      type: 'line',
      emphasis: {
        label: {
          show: true
        }
      }

    },
    {
      name: '成功订单数量',
      data: successfulOrdersCountList.value,
      type: 'line',
      emphasis: {
        label: {
          show: true
        }
      }

    }
  ]
})
// 销量前10
const salesTop10Option = ref({
  title: {
    text: activeName.value + '销量前十'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      snap: true
    },
    backgroundColor: '#fff', // 悬浮框背景色
    borderColor: '#000', // 悬浮框边框颜色
    borderWidth: 1, // 悬浮框边框宽度
    textStyle: { // 悬浮框文字样式
      color: '#000',
      fontSize: 12
    }
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    name: '商品名',
    data: goodsNameList.value
  },
  series: [
    {
      name: '销量/件',
      data: numberList.value,
      type: 'bar',
      emphasis: {
        label: {
          show: true
        }
      }
    }
  ]
})
// 数据导出
const handleExport = async () => {
  ElMessageBox.confirm('是否确认导出最近一个月运营数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await exportDate()
    const url = window.URL.createObjectURL(res)
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.href = url
    a.download = '运营数据统计报表.xlsx'
    a.click()
    window.URL.revokeObjectURL(url)
  }).catch((error) => {
    console.log('error： ', error)
  })
}

// 点击标签页之前
const beforeLeave = (activeName) => {
  if (activeName === '导出数据' || activeName === '营业额提现') {
    return false
  }
}

onMounted(async () => {
  // 默认查询昨日的
  await queryStoreSalesInOneDay(StoreSalesRangeType.YESTERDAY.value)
  queryOrderUserCount(StoreSalesRangeType.YESTERDAY.value)
  queryOrdersCount(StoreSalesRangeType.YESTERDAY.value)
  querySalesTop10(StoreSalesRangeType.YESTERDAY.value)
  now.value = formatDateToString(now.value)
})
</script>

<template>
  <PageContainer title="数据统计">
    <el-tabs v-model="activeName" @tab-click="handleTabClick" :before-leave="beforeLeave">
      <el-tab-pane label="昨日" name="昨日">
      </el-tab-pane>
      <el-tab-pane label="近7日" name="近7日">
      </el-tab-pane>
      <el-tab-pane label="近一个月" name="近一个月">
      </el-tab-pane>
      <el-tab-pane label="本周" name="本周">
      </el-tab-pane>
      <el-tab-pane label="本月" name="本月">
      </el-tab-pane>
      <el-tab-pane name="导出数据">
        <template #label>
          <div class="tab-label">
            <el-button class="right-el-button" @click="handleExport">导出数据</el-button>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter="30">
      <el-col :span="12" class="first-col">
        <StoreSales :storeSalesOption="storeSalesOption" />
      </el-col>
      <el-col :span="12" class="first-col">
        <OrderUserCount :activeName="activeName" :storeSalesAndCategoryNameList="storeSalesAndCategoryNameList"
          :datesInRange="datesInRange" :totalUserCount="totalUserCount" :orderUserCountOption="orderUserCountOption" />
      </el-col>
      <el-col :span="12" class="first-col">
        <OrdersCount :ordersCountOption="ordersCountOption" />
      </el-col>
      <el-col :span="12">
        <SalesTop10 :salesTop10Option="salesTop10Option" />
      </el-col>
    </el-row>
  </PageContainer>
</template>

<style lang='less' scoped>
.el-row {
  margin-bottom: 20px;
  height: 1200px
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.first-col {
  width: 50%;
}

.component-wrapper {
  display: flex;
}
</style>
