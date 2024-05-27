<script setup>
defineProps({
  coverPic: String
})

</script>

<template>
  <div class="BasicContent--mainPic" v-if="coverPic !== undefined">
            <div class="PicGallery--root">
                <div class="PicGallery--mainPicWrap" style="position: relative;">
                    <img class="PicGallery--mainPic"
                    :src="require('@/assets/uploadGoods/' + coverPic)"
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
