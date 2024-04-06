<script setup>
import { watch, ref } from 'vue'
const props = defineProps({
  userRegisterCountOption: Object
})
const op = ref()
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
    width: 100%
}

.el-statistic {
    width: 20%;
}

</style>
