<!-- 基础组件 -->
<template>
    <div class="song-list">
        <ul>
            <li v-for="(song,index) in songs" class="item" @click="selectItem(song,index)">
                <div class="rank" v-show="rank">
                    <span :class="getRankcls(index)">{{getRankText(index)}}</span>
                </div>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        props: {
            songs: {
                type: Array,
                default: []
            },
            rank: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            getRankcls(index) {
                if (index <= 2) {
                    return `icon icon${index}`
                } else {
                    return 'text'
                }
            },
            getRankText(index) {
                if (index > 2) {
                    return index + 1
                }
            },
            selectItem(item, index) {
                //只派发事件
                this.$emit('select', item, index)
            },
            getDesc(song) {
                return `${song.singer} · ${song.album}`
            }
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";

    .song-list {
        .item {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            height: 1.4rem;
            font-size: .37rem;
            .rank {
                flex: 0 0 90px;
                width: 90px;
                margin-right: 50px;
                text-align: center;
                .icon {
                    display: inline-block;
                    width: 60px;
                    height: 60px;
                    background-size: 60px 60px;
                    &.icon0 {
                        @include bg-image('first')
                    }
                    &.icon1 {
                        @include bg-image('second')
                    }
                    &.icon2 {
                        @include bg-image('third')
                    }
                }
                .text {
                    color: $color-theme;
                    font-size: .4rem
                }
            }
            .content {
                flex: 1;
                line-height: .6rem;
                @extend .over;
                .name {
                    @extend .no-wrap;
                    color: $color-text;
                }
                .desc {
                    @extend .no-wrap;
                    font-size: .35rem;
                    color: $color-text-d;
                }
            }
        }
    }
</style>
