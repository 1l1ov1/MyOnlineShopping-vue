<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  ordersList: Array,
  pageObj: Object
})

watch(
  () => props.pageObj,
  (newValue) => {
    pageSize.value = newValue.pageSize
    currentPage.value = newValue.currentPage
    total.value = newValue.total
  },
  {
    deep: true
  }
)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const emit = defineEmits(['pagination'])
// 处理每页多少变化
const handleSizeChange = (number) => {
  pageSize.value = number
  emit('pagination', { pageSize: pageSize.value, currentPage: currentPage.value })
}
// 处理每一页变化
const handleCurrentChange = (number) => {
  currentPage.value = number
  emit('pagination', { pageSize: pageSize.value, currentPage: currentPage.value })
}
</script>

<template>
   <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 40, 50, 100]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
</template>

<style lang='less' scoped>

</style>
