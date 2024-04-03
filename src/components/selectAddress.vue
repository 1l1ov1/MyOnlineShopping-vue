<script setup>
import {
  regionData // 省市区三级联动数据]
  // codeToText
  // pcaTextArr // 省市区三级联动数据，纯汉字
} from 'element-china-area-data'
import { ref, watch } from 'vue'

const props = defineProps({
  defaultAddress: Object
})
watch(
  () => props.defaultAddress,
  (newValue) => {
    selectedOptions.value[0] = props.defaultAddress.provinceCode
    selectedOptions.value[1] = props.defaultAddress.cityCode
    selectedOptions.value[2] = props.defaultAddress.districtCode
  }
)
const selectedOptions = ref([])
const options = ref(regionData)
const emit = defineEmits(['chooseAddress'])
// 选择完地址后的回调
const handleChange = (val) => {
/*   provinceCode = val[0]
  provinceName = codeToText[val[0]]

  cityCode = val[1]
  cityName = codeToText[val[1]]

  districtCode = val[2]
  districtName = codeToText[val[2]] */
  emit('chooseAddress', val)
  // 清空
  val = {}
}

</script>

<template>
    <el-cascader size="large" :options="options" clearable v-model="selectedOptions" placeholder="请选择地址"
        @change="handleChange" />
</template>

<style lang='less' scoped></style>
