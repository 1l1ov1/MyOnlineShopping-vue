<script setup>
import { ref } from 'vue'
import { userStore } from '@/store/index'
import { Location } from '@element-plus/icons-vue'
const userStoreInstance = userStore()
const user = ref({
  ...userStoreInstance.user
})
const dialogVisible = ref(false)
// 暴露方法
const open = () => {
  dialogVisible.value = true
}
const selectedAddress = ref({})
// 点击li标签的时候触发点击事件，绑定被选中的地址
const emit = defineEmits(['selected'])
const chooseAddress = (item) => {
  selectedAddress.value = item
  dialogVisible.value = false
  // 通知父组件，已经修改了收获地址
  emit('selected', selectedAddress.value)
}
// 向外暴露
defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="dialogVisible" width="500" :modal="false" :draggable="true">
    <template #header>
      <el-icon>
        <Location />
      </el-icon>从我的收获地中选择
    </template>
    <ul class="address-lists">
      <li v-for="item in user.addressList" :key="item.id" class="address-item" @click="chooseAddress(item)">
        <div class="address-default" v-if="item.isDefault === 1">默认地址</div>
        <div class="address-sub clearfix">
          <div class="address-brief">
            {{ item.cityName }} {{ item.detail }}
          </div>
        </div>
        <div class="address-detail">
          {{ item.detail }} {{ user.phone }}
        </div>
      </li>
    </ul>
    <!-- <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template> -->
  </el-dialog>
</template>

<style lang="less" scoped>
ol,
ul {
  list-style: none;
}

div,
p,
li {
  word-break: break-all;
}

.dialog-content {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -moz-box-pack: center;
  justify-content: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -moz-box-align: center;
  align-items: center;
  min-height: 215px;

}

.address-lists {
  height: 215px;
  overflow: auto;
  padding: 0;
  margin: 0 -10px 0 0;
}

.address-item {
  width: 215px;
  height: 82px;
  margin: 0 10px 10px 0;
  display: block;
  float: left;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  padding: 5px 8px;
  background: url(//img.alicdn.com/tps/i2/T1VPiBXvpeXXbjLKQ7-237-106.png) no-repeat 0 0;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
}

.address-item:hover {
  background-image: url(//img.alicdn.com/tfs/TB1OVRCRpXXXXaMXFXXXXXXXXXX-237-106.png);
}

.address-item:nth-child(2n) {
  margin-right: 0;
}

li:last-child {
  border-bottom: none;
}

.address-default {
  position: absolute;
  right: 0;
  top: 0;
  background-color: #ccc;
  color: #fff;
  padding: 0 2px;
  // filter: alpha(opacity = 70);
  opacity: .7;
  font-size: 12px;
  line-height: 1.5;
}

.address-sub {
  font-weight: bolder;
  border-bottom: 1px dashed #ccc;
  line-height: 24px;
  height: 24px;
}

.address-brief,
.address-sub {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.address-detail {
  line-height: 19px;
  height: 57px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
