<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import NavigationComponent from '../components/NavigationComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import { Search } from '@element-plus/icons-vue'
import { GetGoodsDetailService } from '@/api/goods'
import { userStore } from '@/store/index'
const route = useRoute()
const userStoreInstance = userStore()
// 得到当前用户
const user = ref({
  ...userStoreInstance.user
})
console.log(user.value)
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
onMounted(() => {
  getDetail()
})
</script>

<template>
    <div class="common-layout">
        <div class="nav">
              <NavigationComponent ></NavigationComponent>
        </div>
        <el-container>
            <el-header>
                <div class="search-header-root">
                    <div class="search-header-content">
                        <div class="search-header-right-content">
                            <div class="search-suggest" id="J_Search">
                                <el-form :inline="true" :model="inputValue" class="demo-form-inline">
                                    <el-form-item size="large">
                                        <!--  <img class="search-header-icon"
                                            src="https://img.alicdn.com/imgextra/i2/O1CN01gdoY6h1caAtrjwYmU_!!6000000003616-2-tps-32-32.png"> -->
                                        <div class="search-suggest-combobox">
                                            <el-input class="search-header-input" aria-label="搜索宝贝" placeholder="搜索宝贝"
                                                :prefix-icon="Search"></el-input>
                                        </div>

                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>
            </el-header>
            <el-main>
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
                                    4.8
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
                            <img class="shopHeader--buttonIcon"
                                src="https://img.alicdn.com/imgextra/i4/O1CN01xQtwpn1ezwPauykYy_!!6000000003943-2-tps-30-32.png">
                            <span class="shopHeader--buttonText"
                                data-spm-anchor-id="pc_detail.27183998/evo365560b447259.202202.i1.4d057dd6kd3e70">联系客服</span>
                        </a>
                        <a class="shopHeader--button"
                            href=""
                            target="_blank" data-spm-anchor-id="pc_detail.27183998/evo365560b447259.202202.2"><img
                                class="shopHeader--buttonIcon"
                                src="https://img.alicdn.com/imgextra/i3/O1CN01k56JHw1scx9dVvirY_!!6000000005788-2-tps-32-32.png"><span
                                class="shopHeader--buttonText"
                                data-spm-anchor-id="pc_detail.27183998/evo365560b447259.202202.i0.4d057dd6kd3e70">进入店铺</span></a>
                    </div>
                </div>
                <div class="Item--content">
                    <div class="BasicContent--root">
                        <div class="BasicContent--main">
                            <div class="BasicContent--mainPic">
                                <div class="PicGallery--root">
                                    <div class="PicGallery--mainPicWrap" style="position: relative;">
                                        <img class="PicGallery--mainPic"
                                        :src="require('@/assets/uploadGoods/' + goods.coverPic)"
                                        style="padding-top: 0px; width: 338px; height: 450px;">
                                    </div>
                                </div>
                            </div>
                            <div class="BasicContent--itemInfo">
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
                                <div class="Price--root">
                                    <div class="Price--normal">
                                        <div>
                                            <div>
                                                <div class="Price--priceWrap">
                                                    <div class="Price--originPrice" style="color: rgb(255,79,0);">
                                                        <span></span>
                                                        <span class="Price--symbol">¥</span>
                                                        <span class="Price--priceText">{{ (goods.price * goods.discount).toFixed(2)  }}</span>
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
                                        <div class="delivery-content-inner">
                                            <div class="delivery-from-addr">
                                                广东广州
                                                <span class="delivery-from-connect">至</span>
                                            </div>
                                        </div>
                                        <div class="delivery-info"></div>
                                    </div>
                                </div>
                                <div class="BasicContent--sku"></div>
                                <div class="Actions--root"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
        <div class="footer">
            <FooterComponent></FooterComponent>
        </div>
    </div>
</template>

<style lang="less" scoped>
.common-layout {
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
.BasicContent--root {
    padding: 0 12px;
    margin-bottom: 39px;
}
.BasicContent--mainPic {
    float: left;
    width: 453px;
}
.PicGallery--root {
    display: inline-block;
}
.PicGallery--mainPicWrap{
    width: 450px;
    height: 450px;
}
.PicGallery--mainPic {
    margin: 0 auto;
    border-radius: 12px;
    display: block;
    max-width: 100%;
    max-height: 100%;
}
.BasicContent--itemInfo {
    float: left;
    margin-left: 21px;
    width: 694px;
}
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
.Price--root {
    letter-spacing: 0;
    margin-top: 14px;
    width: 426px;
}
.Price--normal {
    position: relative;
    height: 32px;
}
.Price--symbol {
    display: inline-block;
    vertical-align: baseline;
    margin-right: 2px;
}
.Price--priceText {
    font-size: 28px;
    line-height: 28px;
    vertical-align: baseline;
    font-family: AlibabaSans102-Bold;
}
</style>
