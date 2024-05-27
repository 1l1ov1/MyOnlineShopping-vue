<script setup>
import { ref, watch } from 'vue'
import router from '@/router'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { addFavoriteService, queryFavoriteIsExistService, batchDeleteFavoriteService } from '@/api/favorite'
import { ElMessage } from 'element-plus'
import { userStore } from '@/store/index'
const props = defineProps({
  store: Object,
  star: Number
})

const userStoreInstance = userStore()
const user = ref({
  ...userStoreInstance.user
})
watch(
  () => props.store,
  async (newValue, oldValue) => {
    // 只要商店变化了，就去查找
    const flag = await findFavorite()
    // 如果没有收藏
    if (flag) {
      isFavorite.value = false
    } else {
      isFavorite.value = true
    }
  },
  {
    deep: true
  }
)
// 监听评论分数
const star = ref('暂无评分')
watch(
  () => props.star,
  (newValue) => {
    star.value = newValue.toFixed(1)
  }
)
const goToStore = () => {
  const url = router.resolve({
    path: '/storeDetail/' + props.store.id
  })
  window.open(url.href)
}
// 加入收藏
const FavoriteType = {
  PRODUCT: 'product',
  STORE: 'store'
}
const isFavorite = ref(false)
const isAddingOrDeleting = ref(false)
const addCollection = async () => {
  isAddingOrDeleting.value = true
  // 如果是收藏状态
  if (isFavorite.value) {
    // 如果有收藏, 就应该删除
    const res = await batchDeleteFavoriteService(props.store.id, FavoriteType.STORE)
    if (res.code === 1) {
      isFavorite.value = false
      isAddingOrDeleting.value = false
      ElMessage.success('取消收藏')
    }
  } else {
    // 如果不是收藏状态
    const obj = []
    const temp = props.store
    temp.storeId = props.store.id
    temp.userId = user.value.id
    obj.push(temp)
    const res = await addFavoriteService(obj, FavoriteType.STORE)
    if (res.code === 1) {
      isFavorite.value = true
      isAddingOrDeleting.value = false
      ElMessage.success('添加成功')
    }
  }
}

const findFavorite = async () => {
  const res = await queryFavoriteIsExistService(props.store.id, FavoriteType.STORE)
  const favoriteList = res.data.favoriteList
  // 如果没有收藏
  if (favoriteList.length === 0) {
    return true
  }
  // 如果收藏了
  return false
}

const goToChat = () => {
  const url = router.resolve({
    path: '/chatRoom/' + props.store.id
  })
  window.open(url.href)
}
</script>

<template>
  <div class="shopHeader--root">
    <a class="shopHeader--border">
      <div class="shopHeader--shopWrap">
        <div class="shopHeader--meta">
          <div class="shopHeader--title" :title="store.storeName">{{ store.storeName }}</div>
        </div>
      </div>
      <div class="shopHeader--driver"></div>
      <div class="shopHeader--dsr">
        <div class="shopHeader--evaluate">
          <div class="shopHeader--key">宝贝描述</div>
          <div class="shopHeader--scoreText">
            {{ star }}
          </div>
        </div>
        <div class="shopHeader--evaluate">
          <div class="shopHeader--key">卖家服务</div>
          <div class="shopHeader--scoreText">
            4.8
          </div>
        </div>
        <div class="shopHeader--evaluate">
          <div class="shopHeader--key">物流服务</div>
          <div class="shopHeader--scoreText">
            4.8
          </div>
        </div>
      </div>
    </a>
    <div class="shopHeader--actions">
      <a class="shopHeader--button">
        <el-button :icon="Star" class="collectionButton" @click="addCollection" v-if="!isFavorite"
          :disabled="isAddingOrDeleting">收藏</el-button>
        <el-button :icon="StarFilled" class="collectionButton" @click="addCollection" v-else
          :disabled="isAddingOrDeleting">收藏</el-button>
      </a>
      <a class="shopHeader--button" href="javascript:void(0)" @click="goToChat">
        <img class="shopHeader--buttonIcon"
          src="https://img.alicdn.com/imgextra/i4/O1CN01xQtwpn1ezwPauykYy_!!6000000003943-2-tps-30-32.png">
        <span class="shopHeader--buttonText"
          data-spm-anchor-id="pc_detail.27183998/evo365560b447259.202202.i1.4d057dd6kd3e70">联系客服</span>
      </a>
      <a class="shopHeader--button" href="javascript:void(0)" @click="goToStore" target="_blank"
        data-spm-anchor-id="pc_detail.27183998/evo365560b447259.202202.2"><img class="shopHeader--buttonIcon"
          src="https://img.alicdn.com/imgextra/i3/O1CN01k56JHw1scx9dVvirY_!!6000000005788-2-tps-32-32.png"><span
          class="shopHeader--buttonText"
          data-spm-anchor-id="pc_detail.27183998/evo365560b447259.202202.i0.4d057dd6kd3e70">进入店铺</span></a>
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.collectionButton) {
  width: 100%;
  border-radius: 40px;
  height: 100%
}

.shopHeader--root {
  margin: 12px auto 0;
  height: 80px;
  width: 1192px;
  border-radius: 40px;
  background-color: #fff;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 12px;
  position: relative;
}

.shopHeader--shopWrap {
  display: inline-block;
  position: relative;
}

.shopHeader--meta {
  padding: 4px 0;
  margin-left: 10px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.shopHeader--title {
  height: 22px;
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #000;
  letter-spacing: 0;
  line-height: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
  font-weight: 600;
}

.shopHeader--dsr {
  display: inline-block;
  vertical-align: middle;
}

.shopHeader--driver {
  display: inline-block;
  height: 26px;
  width: 1px;
  background-color: #eee;
  vertical-align: middle;
  margin: 0 20px 0 28px;
}

.shopHeader--evaluate:first-child {
  margin-left: 0;
}

.shopHeader--evaluate {
  margin-left: 49px;
  display: inline-block;
  line-height: 40px;
}

.shopHeader--key {
  height: 14px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #7f7f7f;
  line-height: 14px;
}

.shopHeader--scoreText {
  height: 26px;
  font-family: AlibabaSans102-Bold;
  font-size: 18px;
  color: #000;
  line-height: 26px;
  margin-top: 3px;
}

.shopHeader--actions {
  top: 0;
  right: 22px;
  position: absolute;
  padding: 22px 0;
}

.shopHeader--button {
  height: 36px;
  width: 102px;
  border: 1px solid #eee;
  border-radius: 18px;
  background-color: #fff;
  margin-left: 13px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  text-align: center;
  cursor: pointer;
}

.shopHeader--buttonIcon {
  height: 13px;
  width: 13px;
  line-height: 14px;
  vertical-align: -2px;
}

.shopHeader--buttonText {
  line-height: 34px;
  margin-left: 6px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  font-size: 14px;
  color: #000;
}
</style>
