<template>
    <div class="no-result">
        <div class="no-result-icon"></div>
        <p class="no-result-text">{{title}}</p>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            title: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";
    .no-result{text-align: center;
        .no-result-icon{ width: 86px; height: 90px;  margin: 0 auto; @include bg-image('no-result');  background-size: 86px 90px;  }
        .no-result-text{ margin-top: 30px;  font-size: .4rem; color: #666 }
    }
</style>