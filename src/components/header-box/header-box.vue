<template>
    <div id="header" class="header" ref="header">Music</div>
</template>

<script type="text/ecmascript-6">
    export default{

    }
</script>
<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";
    .header{ @extend .text-center; @include h(1rem); color: $color-theme; font-size: .5rem; }
</style>
