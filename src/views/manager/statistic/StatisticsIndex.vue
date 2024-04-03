<script setup>
import PageContainer from '@/components/PageContainer.vue'
import StoreSales from './components/StoreSales.vue'
import UserCount from './components/UserCount.vue'
import { ref, onMounted } from 'vue'
import { queryStoreSales, queryUserAndRegisterUser } from '@/api/manager'
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
const handleTabClick = (tab, event) => {
  const value = StoreSalesRangeType.getValueByLabel(tab.props.label).value
  queryStoreSalesInOneDay(value)
  queryUserCount(value)
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
  storeSalesList.value = res.data.storeSalesList

  // 格式化时间
  storeSalesStartTime.value = formatDateToString(new Date(res.data.start))
  storeSalesEndTime.value = formatDateToString(new Date(res.data.end))

  // 先清空上一次的
  dailySales.value = []
  // 存放每天的营业额
  getDailySales()
  // 先清空上一次的
  datesInRange.value = []
  // 每次查询后都得到时间区间
  datesInRange.value = getTimeRangeStrings(storeSalesStartTime.value, storeSalesEndTime.value)
  updateStoreSalesChartOptions()
}
// 用户数量
const userCount = ref()
// 注册用户数量
const registerUserCount = ref([])
const allRegisterCount = ref(0)
// 开始和结束时间
const userStartTime = ref()
const userEndTime = ref()
// 查询用户数量
const queryUserCount = async (day) => {
  const res = await queryUserAndRegisterUser(day)
  userCount.value = res.data.userCount
  registerUserCount.value = res.data.registerUserCount
  if (registerUserCount.value.length === 0) {
    registerUserCount.value.push(0)
  }
  // 格式化时间
  userStartTime.value = formatDateToString(new Date(res.data.start))
  userEndTime.value = formatDateToString(new Date(res.data.end))
  getRegister()
  updateUserRegisterChartOptions()
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
}
// 得到总注册人数
const getRegister = () => {
  allRegisterCount.value = 0
  for (const people of registerUserCount.value) {
    allRegisterCount.value += people
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
// 修改用户注册表
const updateUserRegisterChartOptions = () => {
  if (datesInRange.value.length > 0 && registerUserCount.value.length > 0) {
    userRegisterCountOption.value.xAxis.data = datesInRange.value
    userRegisterCountOption.value.series[0].data = registerUserCount.value
    userRegisterCountOption.value.title.text = activeName.value + '注册人数：' + allRegisterCount.value + '   ' + '总用户人数：' + userCount.value + '人'
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
    trigger: 'item',
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
    name: '营业额/元'
  },
  //   legend: {
  //     orient: 'horizontal',
  //     left: 'left'
  //   },
  series: [
    {
      data: dailySales.value,
      type: 'line',
      //   label: {
      //     show: true,
      //     position: 'bottom',
      //     textStyle: {
      //       fontSize: 8
      //     }
      //   },
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
const userRegisterCountOption = ref({
  title: {
    text: activeName.value + '注册人数：' + registerUserCount.value + '人' + '   ' + '总用户人数：' + userCount.value + '人'
  },
  tooltip: {
    trigger: 'item',
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
    name: '人数/人'
  },
  series: [
    {
      data: registerUserCount.value,
      type: 'line',
      emphasis: {
        label: {
          show: true
        }
      }

    }
  ]
})
// 数据导出
const handleExport = () => {

}
// 点击标签页之前
const beforeLeave = (activeName) => {
  if (activeName === '导出数据') {
    return false
  }
}

onMounted(() => {
  // 默认查询昨日的
  queryStoreSalesInOneDay(StoreSalesRangeType.YESTERDAY.value)
  queryUserCount(StoreSalesRangeType.YESTERDAY.value)
  now.value = formatDateToString(now.value)
})
</script>

<template>
  <PageContainer title="数据统计">
    <el-tabs v-model="activeName" @tab-click="handleTabClick" :before-leave="beforeLeave">
      <el-tab-pane label="昨日" name="昨日">
        <div class="chart-container">

        </div>
      </el-tab-pane>
      <el-tab-pane label="近7日" name="近7日">
        <div class="chart-container">

        </div>
      </el-tab-pane>
      <el-tab-pane label="近30日" name="近30日">
        <div class="chart-container">

        </div>
      </el-tab-pane>
      <el-tab-pane label="本周" name="本周">
        <div class="chart-container">

        </div>
      </el-tab-pane>
      <el-tab-pane label="本月" name="本月">
        <div class="chart-container">

        </div>
      </el-tab-pane>
      <el-tab-pane name="导出数据">
        <template #label>
          <div class="tab-label">
            <el-button class="right-el-button" @click="handleExport">导出数据</el-button>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div class="component-wrapper">
      <StoreSales :storeSalesOption="storeSalesOption" />
      <UserCount :activeName="activeName"
      :allRegisterCount="allRegisterCount"
      :datesInRange="datesInRange"
      :userCount="userCount"
      :userRegisterCountOption="userRegisterCountOption"/>
    </div>
    <!-- <el-row :gutter="30">
      <el-col :span="10" class="first-col">
        <StoreSales />
      </el-col>
      <el-col :span="10" :offset="3" class="first-col">
        <div class="grid-content ep-bg-purple" />2
      </el-col>
      <el-col :span="10">
        <div class="grid-content ep-bg-purple" />
      </el-col>
      <el-col :span="10" :offset="3">
        <div class="grid-content ep-bg-purple" />
      </el-col>
    </el-row> -->
  </PageContainer>
</template>

<style lang='less' scoped>
.el-row {
  margin-bottom: 20px;
  height: 100%
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
  width: 50%
}
.component-wrapper {
  display: flex;
}
</style>
