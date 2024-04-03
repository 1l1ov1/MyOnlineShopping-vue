<script setup>
import NavigationComponent from '../components/NavigationComponent'
import FooterComponent from '../components/FooterComponent'
import { ref } from 'vue'
import CartHeader from './components/CartHeader'
import CartMain from './components/CartMain'
import CartFoot from './components/CartFooter'
import router from '@/router'
const selectChoice = ref('宝贝')
const inputValue = ref()
const searchContent = ref('')
// 当select选择器发生改变的时候的回调
const onChange = (value) => {

}
const btnIsDisable = ref(true)
// 修改结算按钮的样式
const isDisable = (value) => {
  btnIsDisable.value = value
}
const goodsTotalPrice = ref(0.00)
// 修改结算的金额
const computedTotalPrice = (value) => {
  goodsTotalPrice.value = value
}
// 通知要提交了
const submit = ref(false)
const submitResult = (value) => {
  submit.value = value
}
// 是否要提交
const isSubmit = (value) => {
  submit.value = value
}
// 修改用户的钱包
const update = ref(false)
const updateUserInfo = (value) => {
  update.value = value
}
// 得到购物车的数量
const length = ref(0)
const getLength = (value) => {
  length.value = value
}
// footer的全选框
const myCheckAll = ref()
const isCheckAll = (value) => {
  myCheckAll.value = value
}
const myCheckAll2 = ref()
const selectAll = (value) => {
  myCheckAll2.value = value
}
// 被勾选的数量
const sN = ref(0)
const selectNumber = (value) => {
  sN.value = value
}
// 通知main删除被选中的购物车
const mainDeleteCart = ref()
const noticeMainDeleteCart = (value) => {
  mainDeleteCart.value = value
}
// footer 结算
const fS = ref()
const footerSubmit = (value) => {
  fS.value = value
}

// 处理搜索框
const handleSearchContent = () => {
  if (selectChoice.value === '宝贝') {
    router.push({
      path: '/searchGoods', // 导航到搜索界面
      query: { // 添加查询参数
        search: searchContent.value // 用户输入的值
      }
    })
  } else if (selectChoice.value === '店铺') {
    router.push({
      path: '/searchStores', // 导航到搜索界面
      query: { // 添加查询参数
        search: searchContent.value // 用户输入的值
      }
    })
  }
}
// 添加收藏夹
const clickAddFavorite = ref(false)
const saveFavorite = (value) => {
  clickAddFavorite.value = value
}
</script>

<template>
    <NavigationComponent :update="update"></NavigationComponent>
    <div class="container">
        <div class="search-header-root">
            <div class="search-header-content">
                <div class="search-header-right-content">
                    <div class="search-suggest" id="J_Search">
                        <el-form :inline="true" :model="inputValue" class="demo-form-inline">
                            <el-form-item size="large">
                                <el-select style="display: inline-block; width: 80px" @change="onChange" v-model="selectChoice">
                                    <el-option label="宝贝" value="宝贝"></el-option>
                                    <el-option label="店铺" value="店铺"></el-option>
                                </el-select>
                                <div class="search-suggest-combobox">
                                    <el-input class="search-header-input" @keyup.enter="handleSearchContent" v-model="searchContent" :placeholder="'搜索' + selectChoice"
                                        :prefix-icon="Search" />
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        <div id="content">
            <div class="cart-layout">
                <div id="J_Cart" class="cart">
                    <CartHeader :btnIsDisable="btnIsDisable"
                    :goodsTotalPrice="goodsTotalPrice"
                    @submitResult="submitResult"
                    :length="length"></CartHeader>

                    <CartMain @isDisable="isDisable"
                     @totalPrice="computedTotalPrice"
                     :submit="submit"
                     @isSubmit="isSubmit"
                     @updateUserInfo="updateUserInfo"
                     @length="getLength"
                     :myCheckAll="myCheckAll"
                     @selectNumber="selectNumber"
                     @checkAll="selectAll"
                     :mainDeleteCart="mainDeleteCart"
                     :fS="fS"
                     :clickAddFavorite="clickAddFavorite"
                     @saveFavorite="saveFavorite"></CartMain>

                    <CartFoot @checkAll="isCheckAll"
                    :length="length"
                    :goodsTotalPrice="goodsTotalPrice"
                    :btnIsDisable="btnIsDisable"
                    :selectNumber="sN"
                    :myCheckAll="myCheckAll2"
                    @batchDeleteCart="noticeMainDeleteCart"
                    @footerSubmit="footerSubmit"
                    @saveFavorite="saveFavorite"></CartFoot>
                </div>
            </div>
        </div>
    </div>
    <FooterComponent></FooterComponent>
</template>

<style lang='less' scoped>
.container {
    background-color: #676F79;
}
.search-header-right-content {
    padding-top: 19px;
}

.search-header-content {
    width: 1192px;
    height: 100%;
    margin: 0 auto;
    text-align: right;
    position: relative;
}

#content {
    width: 1190px;
    clear: both;
    margin: 0 auto;
    height: auto;
}

.cart {
    min-height: 400px;
    background-color: #fff;
    -webkit-border-radius: 24px;
    -moz-border-radius: 24px;
    -ms-border-radius: 24px;
    border-radius: 24px;
    overflow: hidden;
}
</style>
