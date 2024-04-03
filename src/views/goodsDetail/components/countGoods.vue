<script setup>
import { ref } from 'vue'
defineProps({
  total: Number
})

const emit = defineEmits(['goodsCount'])
// 当数量发生改变的时候，就通知父组件
const handleChange = () => {
  emit('goodsCount', num.value)
}
const num = ref(1)
</script>

<template>
       <span class="countText">数量</span>
        <div class="countWrapper" style="display: inline-block;">
            <el-input-number v-model="num" :min="1" :max="total" :precision="0"  @change="handleChange" size="large" />
        </div>
</template>

<style lang='less' scoped>
.countText {
    display: inline-block;
    height: 14px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #7f7f7f;
    width: 75px;
    line-height: 14px;
    margin-top: 11px;
}
</style>
