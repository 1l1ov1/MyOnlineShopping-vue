<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  ordersCountOption: Object
})
const op = ref()
watch(
  () => props.ordersCountOption,
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
                    <h4 class="homeTitle">订单数量</h4>
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
    width: 100%;
    display: inline-block;
}
</style>
