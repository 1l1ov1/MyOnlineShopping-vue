<script setup>
import { ref, watch } from 'vue'
// StarFilled
import { ArrowDown, Star, StarFilled } from '@element-plus/icons-vue'
import AddressDialog from './AddressDialog.vue'
import CountGoods from './countGoods.vue'
import { userStore } from '@/store/index'
import { addCartService } from '@/api/cart'
import { buyGoodsService } from '@/api/user'
import { addFavoriteService, queryFavoriteIsExistService, batchDeleteFavoriteService } from '@/api/favorite'
import { ElMessage } from 'element-plus'
const userStoreInstance = userStore()
const user = ref({
  ...userStoreInstance.user
})
const props = defineProps({
  goods: Object
})
const selectedAddress = ref({})

const dialogRef = ref()
const onDialog = (val) => {
  selectedAddress.value = val
  params.value.address = selectedAddress.value
}
// 得到用户默认地址
const getDefaultAddress = () => {
  for (const address of user.value.addressList) {
    if (address.isDefault === 1) {
      selectedAddress.value = address
      break
    }
  }
}

const onOpenDialog = () => {
  dialogRef.value.open()
}
getDefaultAddress()
const emit = defineEmits(['goodsUpdate'])
// 监听
watch(
  () => props.goods,
  async (newValue, oldValue) => {
    // 通知父组件修改goods
    emit('goodsUpdate', newValue)
    params.value.goodsId = newValue.id
    params.value.storeId = newValue.storeId
    params.value.goodsName = newValue.goodsName
    params.value.store = newValue.store
    params.value.totalPrice = (newValue.price * newValue.discount).toFixed(2)
    params.value.goodsPrice = newValue.price
    params.value.discount = newValue.discount

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
// 参数
const params = ref({
  id: undefined, // 购物车id
  goodsId: props.goods.id, // id
  userId: user.value.id, // 用户id
  storeId: props.goods.storeId,
  goodsName: props.goods.goodsName, // 商品名字
  number: 1, // 选中的商品数量
  goodsPrice: undefined,
  discount: undefined,
  totalPrice: undefined, // 商品价钱
  store: props.goods.store, // 商店
  address: selectedAddress.value // 收获地址
})
// 接收子组件传递过来的商品数量
const goodsCount = (newValue) => {
  params.value.number = newValue
  // 计算商品价格
  params.value.totalPrice = ((props.goods.price * props.goods.discount).toFixed(2) * newValue).toFixed(2)
}
// 购买
const buy = async () => {
  if (props.goods.total <= 0) {
    ElMessage.error('该商品已售罄')
    return
  }
  const res = await buyGoodsService(params.value)
  if (res.code === 1) {
    ElMessage.success('购买成功')
  }
}
// 加入购物车
const addCart = async () => {
  const res = await addCartService(params.value)
  if (res.code === 1) {
    ElMessage.success('添加成功')
  }
}
// 加入收藏
const FavoriteType = {
  PRODUCT: 'product',
  STORE: 'store'
}
const isFavorite = ref(false)
const addCollection = async () => {
  // 如果是收藏状态
  if (isFavorite.value) {
    // 如果有收藏, 就应该删除
    const res = await batchDeleteFavoriteService(props.goods.id, FavoriteType.PRODUCT)
    if (res.code === 1) {
      isFavorite.value = false
      ElMessage.success('取消收藏')
    }
  } else {
    // 如果不是收藏状态
    const obj = []
    obj.push(params.value)
    const res = await addFavoriteService(obj, FavoriteType.PRODUCT)
    if (res.code === 1) {
      isFavorite.value = true
      ElMessage.success('添加成功')
    }
  }
}

const findFavorite = async () => {
  const res = await queryFavoriteIsExistService(props.goods.id, FavoriteType.PRODUCT)
  const favoriteList = res.data.favoriteList
  // 如果没有收藏
  if (favoriteList.length === 0) {
    return true
  }
  // 如果收藏了
  return false
}
</script>

<template>

    <div class="ItemHeader--root">
        <h1 class="ItemHeader--mainTitle">
            {{ goods.goodsName }}
        </h1>
        <div class="ItemHeader--subTitle">
            <span class="ItemHeader--salesDesc">
                已售 1000+
            </span>
        </div>
    </div>
    <div class="totalPrice--root">
        <div class="totalPrice--normal">
            <div>
                <div>
                    <div class="totalPrice--priceWrap">
                        <div class="totalPrice--originPrice" style="color: rgb(255,79,0);">
                            <span></span>
                            <span class="totalPrice--symbol">¥</span>
                            <span class="totalPrice--priceText">{{ (goods.price * goods.discount).toFixed(2)  }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="Promotion--root"></div>
    <div class="MCDelivery">
        <span class="label">配送：</span>
        <div class="delivery-content">
            <div class="delivery-content-inner" v-if="goods.store">
                <div class="delivery-from-addr">
                    {{ goods.store.address.provinceName + goods.store.address.cityName}}
                    <span class="delivery-from-connect">至</span>
                </div>
                <div id="select-trigger" class="select-trigger">
                    <span class="mui-addr-tri-1">{{ selectedAddress.cityName }}</span>
                    <span class="mui-addr-tri-2">{{ selectedAddress.districtName }}</span>
                    <!-- <i class="mui-addr-icon"></i> -->
                    <el-icon @click="onOpenDialog"><ArrowDown /></el-icon>
                    <AddressDialog ref="dialogRef" @selected="onDialog"></AddressDialog>
                </div>
            </div>
            <div class="delivery-info"><span class="freight">快递: 免运费</span><span></span></div>
        </div>
    </div>
    <div class="BasicContent--sku"></div>
    <div class="quantityLine">
        <CountGoods :total="goods.total" @goodsCount="goodsCount"></CountGoods>
    </div>
    <div class="Actions--root">
      <div class="Actions-left">
        <div class="Actions-leftButton">
            <el-button type="danger" class="leftButton button" size="large" @click="buy">立即购买</el-button>
        </div>
        <div class="Actions-rightButton">
            <el-button type="warning" class="rightButton button" size="large" @click="addCart">加入购物车</el-button>
        </div>
      </div>
      <div class="Actions-divider"></div>
      <div class="Actions-right">
        <el-button :icon="Star" class="collectionButton" @click="addCollection" v-if="!isFavorite">收藏</el-button>
        <el-button :icon="StarFilled" class="collectionButton" @click="addCollection" v-else>收藏</el-button>
    </div>
    </div>
</template>

<style lang="less" scoped>
.ItemHeader--root {
    width: 684px;
}
.ItemHeader--mainTitle {
    line-height: 28px;
    color: #000;
    letter-spacing: 0;
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 900;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.ItemHeader--subTitle {
    margin-top: 8px;
    height: 14px;
    font-family: PingFang SC;
    font-size: 14px;
    color: rgba(0, 0, 0, .4);
    line-height: 14px;
}
.ItemHeader--subTitle>span {
    display: inline-block;
    vertical-align: top;
}
.totalPrice--root {
    letter-spacing: 0;
    margin-top: 14px;
    width: 426px;
}
.totalPrice--normal {
    position: relative;
    height: 32px;
}
.totalPrice--symbol {
    display: inline-block;
    vertical-align: baseline;
    margin-right: 2px;
}
.totalPrice--priceText {
    font-size: 28px;
    line-height: 28px;
    vertical-align: baseline;
    font-family: AlibabaSans102-Bold;
}

.MCDelivery {
    margin-top: 15px;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-flex-direction: row;
    -moz-box-orient: horizontal;
    -moz-box-direction: normal;
    flex-direction: row;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #000;
    position: relative;
    line-height: 22px;
}

.MCDelivery .label {
    display: inline-block;
    width: 75px;
    font-family: PingFang SC;
    color: #7f7f7f;
}

.delivery-content {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -moz-box-orient: vertical;
    -moz-box-direction: normal;
    flex-direction: column;
}
.delivery-content-inner {
    display: flex;
}
.delivery-from-connect {
    padding: 0 12px;
}
.select-trigger {
    cursor: pointer;
}
.mui-addr-tri-1, .mui-addr-tri-2 {
    color: #333;
    padding-right: 12px;
    cursor: pointer;
    background: none;
    border: none;
    position: relative;
    z-index: 2;
}

.mui-addr-tri-2 {
    padding-left: 12px;
}

.delivery-info {
    -webkit-box-align: center;
    -webkit-align-items: center;
    -moz-box-align: center;
    align-items: center;
}
.freight {
    margin-right: 8px;
}

.quantityLine {
    margin-top: 9px;
}

.Actions--root {
    position: relative;
    margin-top: 180px;
}
.Actions-left {
    display: inline-block;
}
.Actions-leftButton, .Actions-rightButton {
    display: inline-block;
}

.button {
    font-size: 1.5em;
}
.leftButton {
    border-top-left-radius: 34px;
    border-bottom-left-radius: 34px;
}
.rightButton {
    border-top-right-radius: 34px;
    border-bottom-right-radius: 34px;
}
.Actions-divider {
    margin: 0 19px;
    display: inline-block;
}
.Actions-right, .collectionButton {
    display: inline-block;
}
</style>
