<script setup>
defineProps({
  coverPic: String
})
</script>

<template>
  <div class="BasicContent--mainPic">
            <div class="PicGallery--root">
                <div class="PicGallery--mainPicWrap" style="position: relative;">
                    <img class="PicGallery--mainPic"
                    :src="(coverPic !== null &&coverPic !== undefined && coverPic !== '')
                    ? require('@/assets/uploadGoods/' + coverPic) : require('@/assets/默认商品图.png')"
                    style="padding-top: 0px; width: 338px; height: 450px;">
             </div>
         </div>
    </div>
</template>

<style lang="less" scoped>
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
</style>
