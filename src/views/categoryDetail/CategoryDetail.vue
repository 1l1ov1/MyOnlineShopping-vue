<script setup>
import { useRoute } from 'vue-router'
import { getGoodsByCategory } from '@/api/goods'
import { onMounted, ref } from 'vue'
import NavigationComponent from '@/views/components/NavigationComponent.vue'
import FooterComponent from '@/views/components/FooterComponent.vue'
import router from '@/router'
const route = useRoute()
const goodsList = ref(null)
const getGoodsDetailByCategory = async () => {
  const res = await getGoodsByCategory(route.params.id)
  goodsList.value = res.data.goodsList
}

onMounted(() => {
  getGoodsDetailByCategory()
})
</script>

<template>
    <NavigationComponent></NavigationComponent>
    <el-container class="goods-container" v-if="goodsList">
        <el-header>
            <div class="hot-goods-title"><span class="hgt-title">猜你喜欢</span></div>
        </el-header>
        <el-main>
            <div class="goods-wrapper" >
                <div class="goods-list">
                    <div class="goods-item" v-for="(item) in goodsList" :key="item.id" style="display: inline-block;">
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
    <el-empty v-else description="description" />
    <FooterComponent></FooterComponent>
</template>

<style lang='less' scoped>
.el-container {
    margin: auto;
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
