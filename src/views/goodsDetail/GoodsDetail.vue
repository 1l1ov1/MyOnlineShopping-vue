<script setup>
import NavigationComponent from '../components/NavigationComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import ShopHeader from './components/ShopHeader.vue'
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { GetGoodsDetailService } from '@/api/goods'
import GoodsImage from './components/GoodsImage.vue'
import GoodsItem from './components/GoodsItem.vue'
const route = useRoute()
const searchContent = ref('')
// const offset = ref(document.body.clientHeight / 2)
// 得到该商品的信息
const goods = ref({

})
// 得到该商品的商店信息
const store = ref({

})
const getDetail = async () => {
  const res = await GetGoodsDetailService(route.params.id)
  goods.value = res.data
  store.value = goods.value.store
}
// 接收子组件GoodsItem的通知
const goodsUpdate = (newValue) => {
  goods.value = newValue
}

// 监听键盘回车事件
const handleEnterPress = (event) => {
  router.push({
    path: '/searchGoods', // 导航到搜索界面
    query: { // 添加查询参数
      search: searchContent.value // 用户输入的值
    }
  })
}
onMounted(() => {
  getDetail()
})
</script>

<template>
      <NavigationComponent ></NavigationComponent>
    <div class="goods-page">
        <div class="search-header-root">
            <div class="search-header-content">
                <div class="search-header-right-content">
                    <div class="search-suggest" id="J_Search">
                        <el-form :inline="true" :model="inputValue" class="demo-form-inline">
                            <el-form-item size="large">
                                <div class="search-suggest-combobox">
                                    <el-input class="search-header-input" @keyup.enter="handleEnterPress" v-model="searchContent" placeholder="搜索宝贝"
                                        :prefix-icon="Search" />
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <ShopHeader :store="store"></ShopHeader>
            <div class="Item--content">
                <GoodsImage :coverPic="goods.coverPic"></GoodsImage>
                <div class="BasicContent--itemInfo">
                    <GoodsItem :goods="goods" @goodsUpdate="goodsUpdate"></GoodsItem>
                </div>
            </div>
        </div>
        <div class="toolkit">
            <el-affix position="bottom" :offset="-100" class="affix">
                <el-link class="cart aside-desc">
                    <div class="cart" @click="() => router.push('/myCart')">
                        <div class="img-desc"> <svg t="1710745460510" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="2863">
                            <path d="M246.4 912a2.1 2.1 0 1 0 134.4 0 2.1 2.1 0 1 0-134.4 0Z" p-id="2864"></path>
                            <path d="M716.8 912a2.1 2.1 0 1 0 134.4 0 2.1 2.1 0 1 0-134.4 0Z" p-id="2865"></path>
                            <path
                                d="M905.6 764.8l-537.6 0c-28.8 0-57.6-25.6-64-54.4l-96-566.4c-9.6-54.4-60.8-96-115.2-96l-22.4 0c-12.8 0-25.6 12.8-25.6 25.6 0 12.8 12.8 25.6 25.6 25.6l22.4 0c28.8 0 57.6 25.6 64 54.4l96 566.4c9.6 54.4 60.8 96 115.2 96l537.6 0c12.8 0 25.6-12.8 25.6-25.6C931.2 777.6 921.6 764.8 905.6 764.8z"
                                p-id="2866"></path>
                            <path
                                d="M880 179.2l-572.8 0c-12.8 0-25.6 12.8-25.6 25.6 0 12.8 12.8 25.6 25.6 25.6l572.8 0c25.6 0 38.4 16 32 41.6l-70.4 281.6c-6.4 32-41.6 57.6-73.6 60.8l-396.8 28.8c-12.8 0-25.6 12.8-22.4 28.8 0 12.8 12.8 25.6 28.8 22.4l396.8-28.8c54.4-3.2 105.6-48 118.4-99.2l70.4-281.6C976 230.4 937.6 179.2 880 179.2z"
                                p-id="2867"></path>
                        </svg>
                    </div>
                    <div class="descWrap"> <span class="desc">购物车</span></div>
                    </div>
                </el-link>
            </el-affix>
        </div>
    </div>
     <el-backtop :right="100" :bottom="100" />
    <FooterComponent></FooterComponent>
</template>

<style lang="less" scoped>
.goods-page {
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

.Item--content {
    position: relative;
    background-color: #fff;
    margin: 12px auto 40px;
    width: 1192px;
    border-radius: 24px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 12px 0;
    height: 600px;
}

.BasicContent--itemInfo {
    float: left;
    margin-left: 21px;
    width: 694px;
}

.toolkit {
    position: fixed;
    right: 5px;
    bottom: 50%;
    -webkit-transform: translateY(50%);
    -moz-transform: translateY(50%);
    -ms-transform: translateY(50%);
    -o-transform: translateY(50%);
    transform: translateY(50%);
    z-index: 999;
    background-color: #F7F9FA;
    -webkit-box-shadow: -2px 0 30px 2px rgba(97, 105, 119, 0.18);
    -moz-box-shadow: -2px 0 30px 2px rgba(97, 105, 119, 0.18);
    box-shadow: -2px 0 30px 2px rgba(97, 105, 119, 0.18);
    border-radius: 18px 0 0 18px;
    width: 100px;
}
/deep/.aside-desc {
    width: 100%;
    display: block;
    font-size: 12px;
    color: #333;
    text-decoration: none;
}

/deep/.el-link__inner,
.img-desc {
    width: 100%;
}

/deep/.affix {
    margin-bottom: 3px;
}

svg {
    display: block;
    width: 100%;
    height: 50px;
    background-position: center;
    background-repeat: no-repeat;
    // background-size: 28px;
    margin-bottom: 5px;
}

.desc {
    display: block;
    font-size: 1.5em;
    text-align: center;
}
</style>
