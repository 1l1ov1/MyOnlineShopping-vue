<script setup>
import { onMounted, ref } from 'vue'
import NavigationComponent from '../components/NavigationComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import { getAllGoodsService, queryGoodsService } from '@/api/goods'
import router from '@/router'
import { getCategoryListService } from '@/api/category'
import { queryStoresService } from '@/api/store'
// import { userLogoutService } from '@/api/user'
// 创建路由

// 创建轮播图
const carouselContext = ref({
  imgUrlArr: [
    'https://gw.alicdn.com/tps/TB1Lw9SLVXXXXajaXXXXXXXXXXX-1130-500.jpg_570x10000Q75.jpg_.webp',
    'https://img.alicdn.com/imgextra/i4/O1CN01LHWdyp1yvAidcNMDR_!!6000000006640-0-tps-846-472.jpg',
    'https://img.alicdn.com/imgextra/i2/O1CN01jH9w4F1sEDtCgpH3r_!!6000000005734-0-tps-846-472.jpg'
  ]
})
// 创建参数
const goodsList = ref()
const getAllGoodsList = async () => {
  const res = await getAllGoodsService()
  goodsList.value = res.data
}
const categoryList = ref()
const getCategoryList = async () => {
  // 由于类别不会有很多，所以就这样简单的写死
  const res = await getCategoryListService({ page: 1, pageSize: 100 })
  categoryList.value = res.data.data
}
// 点击分类跳到对应的分类详情
const jumpToCategoryDetail = (id) => {
  const url = router.resolve({
    path: '/categoryDetail/' + id
  })

  window.open(url.href)
}

const selectChoice = ref('宝贝')
const searchContent = ref('')
const inputValue = ref()
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
const isLoading = ref(false)
const querySearch = async (queryString, cb) => {
  const remoteResult = []
  isLoading.value = false
  if (searchContent.value === '') {
    isLoading.value = true
    return
  }
  if (selectChoice.value === '宝贝') {
    const res = await queryGoodsService(searchContent.value)
    if (res.data.goodsList !== undefined) {
      // 由于商品名不是唯一的，所以查询出来的结果会有重复
      // 使用Set数据结构来存储唯一的商品名
      const uniqueGoodsNames = new Set()
      for (const goods of res.data.goodsList) {
        if (!uniqueGoodsNames.has(goods.goodsName)) {
          uniqueGoodsNames.add(goods.goodsName)
          remoteResult.push({ value: goods.goodsName, id: goods.id })
        }
      }
    }
  } else if (selectChoice.value === '店铺') {
    const res = await queryStoresService(searchContent.value)
    if (res.data.storeList !== undefined) {
      for (const store of res.data.storeList) {
        remoteResult.push({ value: store.storeName, id: store.id })
      }
    }
  }
  cb(remoteResult)
}

const handleSubmit = (item) => {
  if (selectChoice.value === '宝贝') {
    router.push({
      path: '/searchGoods', // 导航到搜索界面
      query: { // 添加查询参数
        search: item.value // 用户输入的值
      }
    })
  } else if (selectChoice.value === '店铺') {
    router.push({
      path: '/searchStores', // 导航到搜索界面
      query: { // 添加查询参数
        search: item.value // 用户输入的值
      }
    })
  }
}
onMounted(() => {
  getAllGoodsList()
  getCategoryList()
})
</script>

<template>
    <div class="common-layout">
        <el-container>
            <!-- 导航头 -->
            <el-header>
                <div class="operation">
                    <NavigationComponent></NavigationComponent>
                </div>
            </el-header>
            <!-- 分割线 -->
            <el-divider border-style="solid" class="divider" />
            <div class="container">
                <div class="search-header-root">
                    <div class="search-header-content">
                        <div class="search-header-right-content">
                            <div class="search-suggest" id="J_Search">
                                <el-form :inline="true" :model="inputValue" class="demo-form-inline">
                                    <el-form-item size="large" id="search">
                                        <el-select style="display: inline-block; width: 100px" @change="onChange"
                                            v-model="selectChoice">
                                            <el-option label="宝贝" value="宝贝"></el-option>
                                            <el-option label="店铺" value="店铺"></el-option>
                                        </el-select>
                                        <div class="search-suggest-combobox" style="width:75%;">
                                            <!-- <el-input class="search-header-input" @keyup.enter="handleSearchContent"
                                                v-model="searchContent" :placeholder="'搜索' + selectChoice"
                                                :prefix-icon="Search" /> -->
                                                <el-autocomplete
                                                class="search-header-input"
                                                v-model="searchContent"
                                                :fetch-suggestions="querySearch"
                                                :placeholder="'搜索' + selectChoice"
                                                @select="handleSubmit"
                                                @keyup.enter="handleSearchContent"
                                                :prefix-icon="Search"
                                                :hide-loading="isLoading"
                                                ></el-autocomplete>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <el-container>
                <!-- 类别 -->
                <el-aside width="300px" class="category-container">
                    <h3>类别</h3>
                    <div class="category-list-wrapper">
                        <ul class="category-list">
                            <li class="category" v-for="item in categoryList" :key="item.id">
                                <a href="javascript:void(0)" target="_blank" @click="jumpToCategoryDetail(item.id)">
                                    {{ item.categoryName }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </el-aside>
                <!-- 主要区域 -->
                <el-main class="carousel-main">
                    <!-- 轮播图 -->
                    <div class="carousel-wrapper">
                        <el-carousel :interval="4000" motion-blur height="300px" width="300px">
                            <el-carousel-item v-for="item in carouselContext.imgUrlArr" :key="item"
                                style="width: auto;">
                                <img :src="item" class="ca-img">
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </el-main>
            </el-container>
        </el-container>
        <el-container class="goods-container">
            <el-header>
                <div class="hot-goods-title"><span class="hgt-title">猜你喜欢</span></div>
            </el-header>
            <el-main>
                <div class="goods-wrapper">
                    <div class="goods-list">
                        <div class="goods-item" v-for="(item) in goodsList" :key="item.id"
                            style="display: inline-block;">
                            <a class="item-link" style="text-decoration: none;" target="_blank"
                                @click="() => router.push('/goodsDetail/' + item.id)">
                                <div class="img-wrapper">
                                    <el-image lazy :src="(item.coverPic !== null && item.coverPic != undefined && item.coverPic != '') ?
                                    require('@/assets/uploadGoods/' + item.coverPic) : require('@/assets/默认商品图.png')" />
                                </div>
                                <div class="info-wrapper">
                                    <div class="title">{{ item.goodsName }}</div>
                                </div>
                                <div class="price-wrapper">
                                    <span class="price-value">
                                        <em>￥</em>
                                        {{ (item.price * item.discount).toFixed(2) }}
                                        <span v-if="item.total === 0">
                                            <strong>已售罄</strong>
                                        </span>
                                    </span>

                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
        <FooterComponent></FooterComponent>
    </div>
</template>

<style scoped lang="less">
.el-container {
    margin: auto;
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

/deep/#search {
    width: 80%;
}
/deep/.el-autocomplete {
    width: 100%;
}
/deep/.category-container {
    margin: 24px 0 0 24px;
    position: relative;
    font-size: 14px;
    background-color: #F7F9FA;
    width: 270px;
    border-radius: 12px;
    float: left;
}

.category-container h3 {
    padding: 16px 0 0 20px;
    font-size: 18px;
    color: #111;
    letter-spacing: 0;
    line-height: 24px;
}

.category-list {
    padding: 16px 0 8px 20px;
    border-top: none;
}

ol,
ul {
    list-style: none;
}

.category-container .category-list li {
    overflow: hidden;
    line-height: 20px;
    height: 20px;
    position: relative;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 18px;
    width: 212px;
    color: #666;
}

.category-container .category-list li a {
    color: #666;
    text-decoration: none;
}

.category-container .category-list li a:hover {
    color: #FF5500;
    cursor: pointer;
}

.carousel-main {
    width: 600px;
    max-width: 600px;
}

.carousel-wrapper {
    // margin-left: 500px;
    width: 100%;
}

/deep/.el-carousel {
    width: 100%;
}

/deep/.el-carousel__container {
    width: 100%;
}

.el-carousel__item img {
    color: #475669;
    opacity: 0.75;
    margin: 0;
    text-align: center;
    width: 100%;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

.ca-img {
    width: 500px;
    height: 300px;
}

.goods-container {
    box-sizing: border-box;
}

.hot-goods-title {
    height: 24px;
    margin-bottom: 20px;
    margin-left: 6px;
}

.hot-goods-title .hgt-title {
    float: left;
    color: #111;
    font-weight: bold;
    font-size: 24px;
    line-height: 24px;
}

.goods-wrapper {
    margin-left: -16px;
}

.goods-list {
    margin-left: -18px;
}

.goods-item {
    position: relative;
    float: left;
    width: 372px;
    height: 174px;
    margin: 0 0 18px 18px;
    overflow: hidden;
    color: #333;
    background-color: #f7f9fa;
    border: 1px solid #f7f9fa;
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
    cursor: pointer;
    -webkit-transition: all 0.5s;
    -o-transition: all 0.5s;
    -moz-transition: all 0.5s;
    transition: all 0.5s;
}

.item-link {
    display: inline-block;
    width: 100%;
    height: 100%;
    padding: 11px;
    cursor: pointer;
}

.goods-item .img-wrapper {
    position: absolute;
    width: 150px;
    height: 150px;
    overflow: hidden;
    background-color: rgba(27, 23, 67, 0.03);
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
}

.goods-item .img-wrapper img {
    display: block;
    width: 100%;
    height: 100%;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;

    background: #fff;
    opacity: .9;
    -webkit-transition: all .2s;
    -moz-transition: all .2s;
    -o-transition: all .2s;
    transition: all .2s;
}

.goods-item .info-wrapper {
    height: 116px;
    margin-left: 162px;
    overflow: hidden;
}

.info-wrapper .title {
    display: inline-block;
    max-height: 46px;
    margin: 6px 0 2px 0;
    overflow: hidden;
    color: #333;
    font-size: 16px;
    line-height: 23px;
}

.price-wrapper {
    margin-left: 162px;
    color: #ff5000;
}

.price-wrapper .price-value {
    display: inline-block;
    font-size: 22px;
    line-height: 22px;
}

.price-wrapper .price-value em {
    margin-right: 4px;
    font-size: 14px;
    font-family: "Microsoft Yahei";
    vertical-align: middle;
}
</style>
