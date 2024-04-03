<script setup>
import { ref, watch } from 'vue'
// import { queryStoreSales } from '@/api/manager'

// 营业额范围
// const StoreSalesRangeType = {
//   YESTERDAY: {
//     value: -1,
//     label: '昨日'
//   },
//   LAST_7_DAYS: {
//     value: -7,
//     label: '近7日'
//   },
//   LAST_30_DAYS: {
//     value: -30,
//     label: '近30日'
//   },
//   THIS_WEEK: {
//     value: 7,
//     label: '本周'
//   },
//   THIS_MONTH: {
//     value: 30,
//     label: '本月'
//   },
//   getValueByLabel: (label) => {
//     const range = Object.values(StoreSalesRangeType)
//       .find(rangeItem => rangeItem.label === label)
//     return range || null // 返回匹配到的枚举项，否则返回null表示未找到
//   }
// }

// // 标签页名
// const activeName = ref('昨日')
// // 点击标签页
// const handleTabClick = (tab, event) => {
//   const value = StoreSalesRangeType.getValueByLabel(tab.props.label).value
//   queryStoreSalesInOneDay(value)
// }
// // 营业额
// const storeSalesList = ref()
// // 总营业额
// const totalRevenue = ref()
// const startTime = ref()
// const endTime = ref()
// const datesInRange = ref([])
// const dailySales = ref([])
// // 查询营业额
// const queryStoreSalesInOneDay = async (day) => {
//   const res = await queryStoreSales(day)

//   totalRevenue.value = res.data.totalRevenue
//   storeSalesList.value = res.data.storeSalesList

//   // 格式化时间
//   startTime.value = formatDateToString(new Date(res.data.start))
//   endTime.value = formatDateToString(new Date(res.data.end))

//   // 先清空上一次的
//   dailySales.value = []
//   // 存放每天的营业额
//   getDailySales()
//   // 先清空上一次的
//   datesInRange.value = []
//   // 每次查询后都得到时间区间
//   datesInRange.value = getTimeRangeStrings(startTime.value, endTime.value)
//   updateChartOptions()
// }

// // 得到今天日期（保持不变）
// const now = ref(new Date())

// // 更新formatDate函数，使其返回格式化后的日期字符串
// const formatDateToString = (date) => {
//   // const year = date.getFullYear()
//   const month = ('0' + (date.getMonth() + 1)).slice(-2)
//   const day = ('0' + date.getDate()).slice(-2)
//   return `${month}-${day}`
// }

// const getDailySales = () => {
//   dailySales.value = []
//   for (const storeSales of storeSalesList.value) {
//     dailySales.value.push({ value: storeSales.dailySales, name: storeSales.storeName })
//   }
// }
// // 修改图表
// const updateChartOptions = () => {
//   // 确保 datesInRange 和 dailySales 都有有效数据
//   if (datesInRange.value.length > 0 && dailySales.value.length > 0) {
//     option.value.xAxis.data = datesInRange.value
//     option.value.series[0].data = dailySales.value
//     option.value.title.text = activeName.value + '营业额（总金额' + totalRevenue.value + '元)'
//     // // 如果 ECharts 实例存在，则更新图表
//     // if (chartInstance.value) {
//     //   chartInstance.value.setOption(option.value, true); // 第二个参数为true表示不替换整个配置项，仅做增量更新
//     // }
//   }
// }

// // 得到时间范围（返回字符串数组）
// const getTimeRangeStrings = (startDate, endDate) => {
//   // 得到1天的毫秒值
//   const oneDay = 60 * 60 * 24 * 1000

//   // 将开始和结束时间转为毫秒
//   const startDateInMs = new Date(startDate).getTime()
//   const endDateInMs = new Date(endDate).getTime()

//   // 存放时间范围的数组
//   const datesInRange = []

//   for (let currentDateInMs = startDateInMs;
//     currentDateInMs <= endDateInMs;
//     currentDateInMs += oneDay) {
//     // 转换为日期对象并格式化为字符串，添加进数组
//     datesInRange.push(formatDateToString(new Date(currentDateInMs)))
//   }

//   return datesInRange
// }

// const option = ref({
//   title: {
//     text: activeName.value + '营业额（总金额' + totalRevenue.value + ')'
//   },
//   tooltip: {
//     trigger: 'item',
//     axisPointer: {
//       type: 'shadow',
//       snap: true
//     },
//     backgroundColor: '#fff', // 悬浮框背景色
//     borderColor: '#000', // 悬浮框边框颜色
//     borderWidth: 1, // 悬浮框边框宽度
//     textStyle: { // 悬浮框文字样式
//       color: '#000',
//       fontSize: 12
//     }
//   },
//   xAxis: {
//     type: 'category',
//     data: datesInRange.value,
//     name: '日期'
//   },
//   yAxis: {
//     type: 'value',
//     name: '营业额/元'
//   },
//   //   legend: {
//   //     orient: 'horizontal',
//   //     left: 'left'
//   //   },
//   series: [
//     {
//       data: dailySales.value,
//       type: 'line',
//       //   label: {
//       //     show: true,
//       //     position: 'bottom',
//       //     textStyle: {
//       //       fontSize: 8
//       //     }
//       //   },
//       emphasis: {
//         label: {
//           show: true
//         }
//       }

//     }
//   ]
// }
// )

// // 数据导出
// const handleExport = () => {

// }

// const beforeLeave = (activeName) => {
//   if (activeName === '导出数据') {
//     return false
//   }
// }
// onMounted(() => {
//   // 默认查询昨日的
//   queryStoreSalesInOneDay(StoreSalesRangeType.YESTERDAY.value)
//   now.value = formatDateToString(now.value)
// })

const props = defineProps({
  storeSalesOption: Object
})
const op = ref()
watch(
  () => props.storeSalesOption,
  (newValue) => {
    op.value = newValue
  },
  {
    deep: true
  }
)
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div class="container">
                    <h4 class="homeTitle">总营业额统计</h4>
                    <div class="chart-container">
                        <v-chart :option="op" autoresize></v-chart>
                    </div>

                </div>
            </el-header>
        </el-container>
    </div>

</template>

<style lang='less' scoped>
.chart-container {
    height: 500px;
}

.common-layout {
    width: 60%;
    display: inline-block;
}
</style>
