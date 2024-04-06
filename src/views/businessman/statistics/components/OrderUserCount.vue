<script setup>
import { watch, ref } from 'vue'
const props = defineProps({
  orderUserCountOption: Object,
  totalUserCount: Number,
  activeName: String,
  storeSalesAndCategoryNameList: Number,
  datesInRange: Array
})
// 表设置
/* const op = ref({
  title: {
    text: props.activeName + '订单数量' + props.totalUserCount + '人'
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
    data: props.datesInRange,
    name: '日期'
  },
  yAxis: {
    type: 'value',
    name: '人数/人'
  },
  series: [
    {
      data: props.storeSalesAndCategoryNameList,
      type: 'line',
      emphasis: {
        label: {
          show: true
        }
      }

    }
  ]
}) */
const op = ref()

watch(
  () => props.orderUserCountOption,
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
                    <h4 class="homeTitle">订单用户数量</h4>
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
    // margin-left: 50%;
    display: inline-block;
    width: 100%;
}

.el-statistic {
    width: 20%;
}

</style>
