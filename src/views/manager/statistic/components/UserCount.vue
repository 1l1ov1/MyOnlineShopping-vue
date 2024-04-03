<script setup>
import { watch, ref } from 'vue'
const props = defineProps({
  userRegisterCountOption: Object,
  userCount: Number,
  activeName: String,
  allRegisterCount: Number,
  datesInRange: Array
})
// 表设置
const op = ref({
  title: {
    text: props.activeName + '注册人数：' + props.allRegisterCount + '   ' + '总用户人数：' + props.userCount + '人'
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
    name: '人数/个'
  },
  series: [
    {
      data: props.registerUserCount,
      type: 'line',
      emphasis: {
        label: {
          show: true
        }
      }

    }
  ]
})
watch(
  () => props.userRegisterCountOption,
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
                    <h4 class="homeTitle">用户人数和注册人数</h4>
                    <div class="chart-container">
                        <v-chart :option="op === undefined ? userRegisterCountOption : op" autoresize></v-chart>
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
    width: 40%
}

.el-statistic {
    width: 20%;
}

</style>
