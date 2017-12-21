<template>
    <ul id="tabs" class="tabs">
        <router-link tag="li" class="tabsli" to="/recommend">
            <span class="tab-link">推荐</span>
        </router-link>
        <router-link tag="li" class="tabsli" to="/singer">
            <span class="tab-link">歌手</span>
        </router-link>
        <router-link tag="li" class="tabsli" to="/rank">
            <span class="tab-link">排行</span>
        </router-link>
        <router-link tag="li" class="tabsli" to="/search">
            <span class="tab-link">搜索</span>
        </router-link>
    </ul>
</template>
<script type="text/ecmascript-6">
    export default {

    }
</script>

<style lang="scss" type="text/scss">
    @import "~common/sass/common";
    .tabs{ display: flex; width:100%; @include h(.8rem);
        li{ flex: 1; @extend .text-center;
            span{ color: $color-text-d; }
            &.router-link-active{
                span{ @include h(.7rem); @extend .block-in; color: $color-theme; border-bottom: .05rem solid $color-theme;
                    padding-left: .05rem; padding-right: .05rem; }
            }
        }
    }
</style>