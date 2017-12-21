<template>
    <div class="loading">
        <img src="./loading.gif" alt="">
        <p class="desc">{{title}}</p>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        props:{
            title:{
                type:String,
                default:'正在加载中...'
            }
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";
    .loading{ width: 100%; @extend .text-center;
        img{ max-width: .8rem; height: auto;}
        .desc{ line-height: .8rem; font-size: .37rem; color: $color-text-l;}
    }
</style>