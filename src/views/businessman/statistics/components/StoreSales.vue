<script setup>
import { ref, watch } from 'vue'
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
  width: 100%;
    display: inline-block;
}
</style>
