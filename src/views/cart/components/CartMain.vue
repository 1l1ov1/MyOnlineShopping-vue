<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import router from '@/router'
import { userStore } from '@/store/index'
import { getUserCartsService, deleteUserCartItemService, submitUserCartService } from '@/api/cart'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addFavoriteService } from '@/api/favorite'
const userStoreInstance = userStore()
// 要提交的参数
const params = ref({
  // 购买者的id
  userId: userStoreInstance.user.id,
  // 商品列表
  cartList: [],
  totalAmount: 0.00
})
const props = defineProps({
  // 提交
  submit: Boolean,
  myCheckAll: Boolean,
  mainDeleteCart: Boolean,
  fS: Boolean,
  clickAddFavorite: Boolean
})
// 监听其变化
watch(
  () => props.submit,
  (newValue) => {
    // 如果是true，即点击提交
    if (newValue) {
      // 每次提交前,重置数据
      params.value = {
        // 购买者的id
        userId: userStoreInstance.user.id,
        // 商品列表
        cartList: [],
        totalAmount: 0.00
      }
      // 就将被勾选中的商品提交
      for (let i = 0; i < tableData.value.length; i++) {
        for (let j = 0; j < tableData.value[i].cartList.length; j++) {
          // 得到商品
          const goods = tableData.value[i].cartList[j]
          // 得到是否被勾选
          const checked = goodsCheckBox.value[i][j]
          if (checked) {
            // 添加进params的cartList中
            params.value.cartList.push(goods)
          }
        }
      }
      // 设置总金额
      params.value.totalAmount = selectedGoodsTotalPrice.value
      // 购买
      buy()
      emit('isSubmit', false)
    }
  }

)
watch(
  () => props.myCheckAll,
  (newValue) => {
    checkAll.value = newValue
    changeAll(checkAll.value)
  }
)
watch(
  () => props.mainDeleteCart,
  (newValue) => {
    if (newValue) {
      let ids = []
      tableData.value.forEach((item, i) => {
        item.cartList.forEach((cartItem, j) => {
          // 如果该商品被勾选
          if (goodsCheckBox.value[i][j]) {
            // 添加到ids数组中
            ids.push(cartItem.id)
          }
        })
      })
      ids = ids.map(id => id).join(',')
      deleteCart(ids)
    }
  }
)
watch(
  () => props.fS,
  (newValue) => {
    // 如果是true，即点击提交
    if (newValue) {
      // 每次提交前,重置数据
      params.value = {
        // 购买者的id
        userId: userStoreInstance.user.id,
        // 商品列表
        cartList: [],
        totalAmount: 0.00
      }
      // 就将被勾选中的商品提交
      for (let i = 0; i < tableData.value.length; i++) {
        for (let j = 0; j < tableData.value[i].cartList.length; j++) {
          // 得到商品
          const goods = tableData.value[i].cartList[j]
          // 得到是否被勾选
          const checked = goodsCheckBox.value[i][j]
          if (checked) {
            // 添加进params的cartList中
            params.value.cartList.push(goods)
          }
        }
      }
      // 设置总金额
      params.value.totalAmount = selectedGoodsTotalPrice.value
      // 购买
      buy()
      // 取消兄弟组件的结算
      emit('footerSubmit', false)
      // 取消兄弟组件的勾选
      emit('checkAll', false)
    }
  }
)
watch(
  () => props.clickAddFavorite,
  (newValue) => {
    // 如果点击了添加收藏
    if (newValue) {
      const obj = new Map()
      for (let i = 0; i < tableData.value.length; i++) {
        for (let j = 0; j < tableData.value[i].cartList.length; j++) {
          if (goodsCheckBox.value[i][j]) {
            // 如果商品被勾选了
            const goods = tableData.value[i].cartList[j]
            const key = goods.goodsId
            // 如果Map中还没有这个goodsId，则添加它
            if (!obj.has(key)) {
              obj.set(key, { userId: user.value.id, goodsId: key })
            }
          }
        }
      }
      // 将Map的值转换为一个数组
      const res = Array.from(obj.values())
      // 添加商品收藏
      batchAddFavorite(res, 'product')
      // 通知添加结束
      emit('saveFavorite', false)
    }
  }
)
const user = ref({
  ...userStoreInstance.user
})
// 得到用户的购物车
const getUserCarts = async () => {
  const res = await getUserCartsService(user.value.id)
  tableData.value = res.data.cartList
  getLength()
}
// 表单数据
const tableData = ref()
// 判断是否需要修改多选框数量
const flag = ref(true)
watch(
  () => tableData.value,
  (newValue, oldValue) => {
    tableData.value = newValue
    if (flag.value) {
      // 如果要修改多选框数量
      // 先清空
      storeCheckBox.value = []
      goodsCheckBox.value = []
      for (let i = 0; i < tableData.value.length; i++) {
        storeCheckBox.value[i] = false
        goodsCheckBox.value[i] = []
        for (let j = 0; j < tableData.value[i].cartList.length; j++) {
          goodsCheckBox.value[i][j] = false
        }
      }
      flag.value = false
    }
  },
  {
    deep: true
  }
)
// 得到商品数量
const getLength = () => {
  let length = 0
  for (let i = 0; i < tableData.value.length; i++) {
    length += tableData.value[i].cartList.length
  }
  emit('length', length)
}
// 总体全选
const checkAll = ref(false)
// 勾选的商品总金额
const selectedGoodsTotalPrice = ref(0.00)
// 当绑定值变化时触发的事件
const handleCheckAllChange = (value) => {
  // 如果全选框为true
  if (value) {
    changeAll(true)
  } else {
    changeAll(false)
  }
  // 清空参数，只有当点击提交的时候，才能够放进去，其余都必须为空
  params.value = {
    userId: userStoreInstance.user.id,
    cartList: [],
    totalAmount: 0.00
  }
  // 通知父组件
  emit('isSubmit', false)
  emit('checkAll', value)
}

const changeAll = (flag) => {
  // 先清空
  selectedGoodsTotalPrice.value = 0.00
  // 勾选数量为0
  selectNumber.value = 0
  // 遍历
  for (let i = 0; i < tableData.value.length; i++) {
    // 将所有商店的多选框取消或勾选
    storeCheckBox.value[i] = flag
    for (let j = 0; j < tableData.value[i].cartList.length; j++) {
      // 将每个商品的多选框取消或勾选
      goodsCheckBox.value[i][j] = flag
      // 计算勾选的商品的总价
      selectedGoodsTotalPrice.value = flag
        ? selectedGoodsTotalPrice.value += getGoodsPrice(i, j)
        : selectedGoodsTotalPrice.value
        // 勾选数量
      selectNumber.value = flag ? selectNumber.value += 1 : selectNumber.value
      emit('isDisable', !flag)
      emit('totalPrice', selectedGoodsTotalPrice.value)
      emit('selectNumber', selectNumber.value)
    }
  }
  checkAll.value = flag
}
const totalPrice = computed(() => (item) => {
  return (item.goodsPrice * item.discount * item.number).toFixed(2)
})
// 将商店多选框勾选的放这里
const storeCheckBox = ref([])
// 将商品多选框勾选的放这里
const goodsCheckBox = ref([])

// 商店的多选框回调
const handleCheckedStore = (storeIndex) => {
  // 如果当前这个商店被勾选
  if (storeCheckBox.value[storeIndex]) {
    for (let i = 0; i < goodsCheckBox.value[storeIndex].length; i++) {
      /**
       * 这是为了防止商品已经被勾选并且 又勾选商店导致重复计算
       */
      // 如果该商品没有被勾选中
      if (!goodsCheckBox.value[storeIndex][i]) {
        // 其商品改为true 被勾选
        goodsCheckBox.value[storeIndex][i] = true
        // 加上价格
        selectedGoodsTotalPrice.value += getGoodsPrice(storeIndex, i)
        selectNumber.value += 1
      }
    }
    // 结算按钮应该不禁用
    // emit('isDisable', false)
    emit('totalPrice', selectedGoodsTotalPrice.value)
    emit('selectNumber', selectNumber.value)
  } else {
    // 否则全部为false
    for (let i = 0; i < goodsCheckBox.value[storeIndex].length; i++) {
      // 其下所有商品全部改为true 被勾选
      goodsCheckBox.value[storeIndex][i] = false
      // 减去价格
      selectedGoodsTotalPrice.value -= getGoodsPrice(storeIndex, i)
      selectNumber.value -= 1
    }
    // 结算按钮应该禁用

    emit('totalPrice', selectedGoodsTotalPrice.value)
    emit('selectNumber', selectNumber.value)
    checkAll.value = false
  }
  // 查看有多少个商店被勾选
  const checkedItemsCount = storeCheckBox.value
    .reduce((count, isChecked) => count + (isChecked ? 1 : 0), 0)

  // 如果说被勾选数大于0且小于等于storeCheckBox.value.length，则结算按钮不应该被禁用
  emit('isDisable', !checkedItemsCount > 0 && checkedItemsCount <= storeCheckBox.value.length)
  // 如果说被勾选数等于storeCheckBox.value.length，则全选框为true
  checkAll.value = checkedItemsCount === storeCheckBox.value.length
  // 清空参数，只有当点击提交的时候，才能够放进去，其余都必须为空
  params.value = {
    userId: userStoreInstance.user.id,
    cartList: [],
    totalAmount: 0.00
  }
  // 通知父组件
  emit('isSubmit', false)
  emit('checkAll', checkAll.value)
}
// 商品的多选框回调
const handleCheckedGoods = (storeIndex, goodsIndex) => {
  // 如果当前复选框为true
  if (goodsCheckBox.value[storeIndex][goodsIndex]) {
    // 结算按钮不禁用
    emit('isDisable', false)
    // 添加该商品的金额
    selectedGoodsTotalPrice.value += getGoodsPrice(storeIndex, goodsIndex)
    selectNumber.value += 1
  } else {
    checkAll.value = false
    // 减去该商品的金额
    selectedGoodsTotalPrice.value -= getGoodsPrice(storeIndex, goodsIndex)
    selectNumber.value -= 1
  }
  emit('totalPrice', selectedGoodsTotalPrice.value)
  emit('selectNumber', selectNumber.value)
  // 遍历该店铺的所有商品，如果该商店所有商品中有一个没被勾选，就取消勾选商店， 如果全部勾选就勾选商店
  storeCheckBox.value[storeIndex] = goodsCheckBox.value[storeIndex].every(checked => checked)
  // 清空参数，只有当点击提交的时候，才能够放进去，其余都必须为空
  params.value = {
    userId: userStoreInstance.user.id,
    cartList: [],
    totalAmount: 0.00
  }
  checkAll.value = storeCheckBox.value.every(check => check)
  isOK()
  // 通知父组件
  emit('isSubmit', false)
  emit('checkAll', checkAll.value)
}

// 根据商品和商店信息计算价格
const getGoodsPrice = (storeIndex, goodsIndex) => {
  const goods = tableData.value[storeIndex].cartList[goodsIndex]
  return parseFloat((goods.goodsPrice *
  goods.discount *
  goods.number).toFixed(2)) // 计算价格并保留两位小数
}
// 是否为禁用
const isOK = () => {
  let isAnyChecked = false
  for (let i = 0; i < tableData.value.length && !isAnyChecked; i++) {
    for (let j = 0; j < tableData.value[i].cartList.length && !isAnyChecked; j++) {
      // 只要有一个商品被勾选，就设置标志并退出循环
      if (goodsCheckBox.value[i][j]) {
        isAnyChecked = true
      }
    }
  }

  // 根据标志变量的值来调用emit
  emit('isDisable', !isAnyChecked)
}
// 删除购物车
const deleteCart = async (id) => {
  if (typeof id === 'number') {
    ElMessageBox.confirm(
      '您确定要删除这个宝贝吗？',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      // 删除
      await deleteUserCartItemService(id)
      flag.value = true
      // 刷新购物车
      getUserCarts()
      ElMessage.success('删除成功')
      changeAll(false)
    }).catch(() => {

    })
  } else if (typeof id === 'string') {
    await deleteUserCartItemService(id)
    flag.value = true
    getUserCarts()
    changeAll(false)
    ElMessage.success('删除成功')
  }
  // 不管成功还是失败，就通知父组件删除函数已经运行过,以便后续可以继续删除
  emit('batchDeleteCart', false)
  // 然后允许修改多选框的数量
  flag.value = true
}
// 将商品添加进收藏
const addFavorite = async (cartId, goodsId) => {
  const obj = [{ cartId: cartId, userId: user.value.id, goodsId: goodsId }]
  const res = await addFavoriteService(obj, 'product')
  if (res.code === 1) {
    ElMessage.success('添加成功')
    getUserCarts()
  }
}
// 批量添加
const batchAddFavorite = async (obj, target) => {
  const res = await addFavoriteService(obj, target)
  if (res.code === 1) {
    ElMessage.success('添加成功')
  }
}
// 数字输入框发生变化的时候的回调
const handleChange = (storeIndex, goodsIndex, currentValue) => {
  // 得到该商品是否被勾选
  const check = goodsCheckBox.value[storeIndex][goodsIndex]
  // 如果被勾选
  if (check) {
    selectedGoodsTotalPrice.value = 0.00
    goodsCheckBox.value.forEach((first, storeIndex) => {
      first.forEach((checked, goodsIndex) => {
        // 如果是被勾选
        if (checked) {
          selectedGoodsTotalPrice.value += getGoodsPrice(storeIndex, goodsIndex)
        }
      })
    })
    emit('totalPrice', selectedGoodsTotalPrice.value)
  }
  // 不管够没勾选，都要变化总金额
  tableData.value[storeIndex].cartList[goodsIndex].totalPrice = getGoodsPrice(storeIndex, goodsIndex)
}
// 购买
const buy = async () => {
  const userAddressEmpty = !userStoreInstance.user?.addressList ||
              userStoreInstance.user.addressList.length === 0
  if (userAddressEmpty) {
    ElMessage.error('请先去个人中心添加收货地址')
    return
  }
  const res = await submitUserCartService(params.value)
  if (res.code === 1) {
    ElMessage.success(res.msg)
    // 清空
    params.value = {
      userId: userStoreInstance.user.id,
      cartList: [],
      totalAmount: 0.00
    }
    // 通知
    emit('isSubmit', false)
    // 刷新
    getUserCarts()
    // 通知Navigation组件更新
    emit('updateUserInfo', true)
    selectedGoodsTotalPrice.value = 0.00
    // 取消所有被勾选的
    changeAll(false)
    checkAll.value = false
    flag.value = true
    // 通知footer全选取消
    emit('checkAll', false)
    emit('totalPrice', selectedGoodsTotalPrice.value)
    userStoreInstance.getUser()
  }
}
// 勾选数量
const selectNumber = ref(0)

// 通知header的结算是否为禁用
const emit = defineEmits(['isDisable',
  'totalPrice',
  'isSubmit',
  'length',
  'selectNumber',
  'checkAll',
  'saveFavorite',
  'batchDeleteCart'])
onMounted(() => {
  getUserCarts()
})

</script>

<template>
  <div id="J_CartMain" class="cart-main">
    <div class="cart-table-th">
      <div class="wp">
        <div class="th th-chk">
          <div id="J_SelectAll1" class="select-all J_SelectAll selected">
            <div class="cart-checkbox cart-checkbox-checked">
              <el-checkbox class="checkAll" label="全选" v-model="checkAll"
                @change="handleCheckAllChange"></el-checkbox>
            </div>&nbsp;全选
          </div>
        </div>
        <div class="th th-item">
          <div class="td-inner">商品信息</div>
        </div>
        <div class="th th-info">
          <div class="td-inner">&nbsp;</div>
        </div>
        <div class="th th-price">
          <div class="td-inner">单价</div>
        </div>
        <div class="th th-amount">
          <div class="td-inner">数量</div>
        </div>
        <div class="th th-sum">
          <div class="td-inner">金额</div>
        </div>
        <div class="th th-op">
          <div class="td-inner">操作</div>
        </div>
      </div>
    </div>
    <div class="J_OrderList">
      <div id="J_OrderHolder" style="height: auto;" v-for="(item, storeIndex) in tableData" :key="item">
        <div id="J_Order" class="J_Order order-body">
          <div class="J_ItemHead shop">
            <div class="shop-info">
              <div class="cart-checkbox">
                <el-checkbox class="store-checkbox" v-model="storeCheckBox[storeIndex]"
                  @change="handleCheckedStore(storeIndex)"></el-checkbox>
              </div>
              店铺：<el-link :underline="false"
               href="javascript:void(0)" @click="() => router.push(`/storeDetail/` + item.store.id)">{{ item.store.storeName }}</el-link>
            </div>
          </div>
          <div class="order-content">
            <div id="J_BundleList" class="item-list">
              <div id="J_ItemHolder" class="item-holder" v-for="(goods, goodsIndex) in item.cartList" :key="goods">
                <div id="J_Item" class="J_ItemBody">
                  <ul class="item-content">
                    <li class="td td-chk">
                      <div class="td-inner">
                        <el-checkbox class="goods-checkbox" size="large" width="15" height="15" style="float: left;"
                          v-model="goodsCheckBox[storeIndex][goodsIndex]"
                          @change="handleCheckedGoods(storeIndex, goodsIndex)"></el-checkbox>
                      </div>
                    </li>
                    <li class="td td-item">
                      <div class="td-inner">
                        <div class="item-pic J_ItemPic img-loaded">
                          <a :href="() => router.push('/goodsDetail/')">
                            <img class="itempic J_ItemImg" :src="require('@/assets/uploadGoods/' + goods.coverPic)">
                          </a>
                        </div>
                        <div class="item-info">
                          <div class="item-basic-info">
                            <a class="item-title J_GoldReport J_MakePoint" target="_blank"
                              @click="() => router.push('/goodsDetail/' + goods.goodsId)">{{ goods.goodsName }}</a>
                          </div>
                          <div class="item-other-info"></div>
                        </div>
                      </div>
                    </li>
                    <li class="td td-info">
                      <div class="item-props item-props-can">
                        <p class="sku-line" tabindex="0">....商品规格的地方</p>
                        <span tabindex="0" class="btn-edit-sku J_BtnEdit">修改</span>
                      </div>
                    </li>
                    <li class="td td-price">
                      <div class="td-inner">
                        <div class="item-price price-promo-">
                          <div class="price-content">
                            <div class="price-line">
                              <em class="J_Price price-now" tabindex="0">￥{{ (goods.goodsPrice *
                goods.discount).toFixed(2) }}</em>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="td td-amount">
                      <div class="td-inner">
                        <div class="amount-wrapper">
                          <div class="item-amount">
                            <el-input-number v-model="goods.number" :min="1" :step-strictly="true" precision="0" size="small"
                              @change="handleChange(storeIndex,goodsIndex, goods.number)" />
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="td td-sum">
                      <div class="td-inner">
                        <em tabindex="0" class="J_ItemSum number">￥{{ totalPrice(goods)
                          }}</em>
                      </div>
                    </li>
                    <li class="td td-op">
                      <div class="td-inner"><a title="移入收藏夹" class="btn-fav J_Fav J_MakePoint" href="javascript:void(0)" @click="addFavorite(goods.id, goods.goodsId)">移入收藏夹</a><a
                          href="javascript:void(0)" @click="deleteCart(goods.id)" class="J_Del J_MakePoint">删除</a></div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.cart-main {
  min-height: 210px;
  height: auto
}

#J_ItemHolder {
  height: 129px;
}

.cart-table-th {
  overflow: hidden;
  height: 50px;
  line-height: 50px;
  color: #3c3c3c;
  font-weight: 700;
}

.wp {
  margin: 0 auto;
}

.th-chk {
  width: 50px;
}

.cart-table-th .th-chk {
  font-size: 12px;
  text-align: left;
  position: relative;
  height: 50px;
}

.checkAll {
  top: -17px;
}

.cart-table-th .th-chk .select-all {
  position: absolute;
  left: 8px;
  top: 0;
  width: 80px;
  font-size: 13px;
}

.shop-info {
  position: relative;
  z-index: 2;
  line-height: 38px;
  padding-left: 15px;
  _padding-top: 8px;
}

.select-all {
  cursor: pointer;
}

.th-item {
  width: 342px;
}

.cart-table-th .th {
  float: left;
}

.shop .cart-checkbox {
  vertical-align: text-bottom;
}

.cart-checkbox {
  position: relative;
  display: inline-block;
  width: 15px;
  height: 15px;
  overflow: hidden;
}

.cart-table-th .th-item .td-inner {
  padding-left: 117px;
}

.th-info {
  width: 212px;
  padding-right: 42px;
}

.cart-table-th .th {
  float: left;
}

.th-price {
  width: 130px;
}

.th .td-inner {
  padding: 0 0 0 10px;
  font-size: 13px;
}

.th-amount {
  width: 120px;
}

.th-sum {
  width: 140px;
}

.th-op {
  width: 72px;
  padding: 0 0 0 30px;
}

.shop {
  position: relative;
  height: 38px;
  background: #fff;
  overflow: hidden;
}

.order-content {
  border: 1px solid #F5F5F5;
  background-color: #F5F5F5;
  -webkit-border-radius: 18px;
  -moz-border-radius: 18px;
  -ms-border-radius: 18px;
  border-radius: 18px;
  margin: 0 24px;
  overflow: hidden;
}

.order-content .bundle {
  overflow: hidden;
}

.item-holder {
  position: relative;
}

.item-content {
  padding-right: 12px;
}

.item-content .td-chk {
  position: relative;
  overflow: hidden;
}

.store-checkbox {
  width: 20px;
}

.store-checkbox {
  top: -10px
}

.item-content .td {
  float: left;
  min-height: 119px;
  _height: 119px;
  overflow: hidden;
  _overflow: visible;
  _zoom: 1;
}

.item-content .td .item-props-can:hover {
  border-color: #f60;
  background: #fff;
  .btn-edit-sku {
    display: block;
    position: absolute;
    right: -1px;
    top: -1px;
    color: #fff;
    cursor: pointer;
    background: #f60;
    padding: 2px 4px 0;
    width: auto;
    height: 16px;
    line-height: 1;
  }
}

.td-item {
  width: 342px;
}

.td-inner {
  padding-top: 20px;
  _zoom: 1;
}

.goods-checkbox {
  width: 20px;
}

.goods-checkbox .el-checkbox_input {
  left: -15px
}

.item-content .item-props {
  padding: 16px 0;
  min-height: 84px;
  _height: 84px;
  border: 1px dashed transparent;
  position: relative;
  _border-color: #EEF6FF;
}

.item-content .img-loaded {
  background: #fff;
}

.item-content .item-pic {
  width: 80px;
  height: 80px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -ms-border-radius: 3px;
  border-radius: 3px;
  border: 1px solid #eee;
  float: left;
  overflow: hidden;
}

.item-content .item-pic a {
  display: table-cell;
  width: 80px;
  height: 80px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -ms-border-radius: 3px;
  border-radius: 3px;
  vertical-align: middle;
  text-align: center;
}

.item-content .item-pic img {
  max-height: 80px;
  max-width: 80px;
  vertical-align: middle;
}

img {
  border: 0;
}

.td-item .item-info {
  margin: -3px 0 0 91px;
  padding-right: 12px;
}

.td-item .item-basic-info {
  min-height: 40px;
}

.item-content .item-title {
  font-size: 12px;
  display: block;
  max-height: 36px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-content .item-title:hover {
  color: #f60;
  cursor: pointer;
}

.td-info {
  width: 212px;
}

.item-content .sku-line {
  margin: 0 5px 0 15px;
  color: #9c9c9c;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-content .btn-edit-sku {
  display: none;
}

.td-price {
  width: 130px;
}

.item-content .td-price {
  color: #9c9c9c;
}

.item-content .price-content {
  padding: 8px 0 0 10px;
  line-height: 1;
  width: 74px;
}

.item-content .td-price .price-line {
  padding: 0 0 4px 0;
}

.item-content .price-now {
  color: #3c3c3c;
  font-weight: 700;
  font-family: Verdana, Tahoma, arial;
  font-size: 12px;
}

.td-amount {
  width: 120px;
}

.item-content .item-amount {
  height: 25px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  width: 77px
}

::v-deep(.el-input-number--small) {
  width: 100%;
}

.item-content .td-sum {
  color: #f40;
  font-weight: 700;
}

.item-content .td-sum .td-inner {
  padding-top: 16px;
}

.number,
.price {
  font-family: Verdana, Tahoma, arial;
  font-size: 12px;
}

.th-op,
.td-op {
  width: 72px;
  padding: 0 0 0 30px;
}

.item-content .td-op .td-inner {
  padding-top: 17px;
}

.btn-fav {
  display: block;
}

.item-content .td-op a {
  padding-bottom: 3px;
  font-size: 12px;
}

.item-content .td {
  float: left;
  min-height: 119px;
  _height: 119px;
  overflow: hidden;
  _overflow: visible;
  _zoom: 1;
}

.th-sum,
.td-sum {
  width: 140px;
}
</style>
