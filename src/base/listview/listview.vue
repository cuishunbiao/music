<template>
    <scroll class="listview"
            :data="data"
            ref="listview"
            :listenScroll="listenScroll"
            :probeType="probeType"
            @scroll="scroll">
        <ul>
            <li v-for="group in data" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
                        <img class="avatar" :src="item.avatar" alt="">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li v-for="(item,index) in shortcutList"
                    class="item"
                    :data-index="index"
                    :class="{'current':currentIndex === index}">
                    {{item}}
                </li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle">
            <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>
        <div v-show="!data.length" class="loading-container">
            <loading></loading>
        </div>
    </scroll>
</template>
<script type="text/ecmascript-6">
    import Scroll from 'base/scroll/scroll'
    import Loading from 'base/loading/loading'
    import {getData} from 'common/js/dom'

    const ANCHOR_HEIGHT = 30

    export default {
        created() {
            this.touch = {}
            this.listenScroll = true
            this.listHeight = []
            this.probeType = 3
        },
        data() {
            return {
                scrollY: -1,
                currentIndex: 0,

            }
        },
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        computed: {
            shortcutList() {
                return this.data.map((group) => {
                    return group.title.substr(0, 1)
                })
            },
            fixedTitle() {
                if (this.scrollY > 0) {
                    return ''
                }
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
            }
        },
        methods: {
            selectItem(item) {
                this.$emit('select', item)
            },
            onShortcutTouchStart(e) {
                let anchorIndex = getData(e.target, 'index')//获取 data-index 的值
                let firstTouch = e.touches[0]//表示第一次点击的位置
                this.touch.y1 = firstTouch.pageY
                this.touch.anchorIndex = anchorIndex
                this._scrollTo(anchorIndex)
            },
            onShortcutTouchMove(e) {
                let firstTouch = e.touches[0]
                this.touch.y2 = firstTouch.pageY
                let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
                let anchorIndex = parseInt(this.touch.anchorIndex) + delta
                this._scrollTo(anchorIndex)
            },
            scroll(pos) {
                this.scrollY = pos.y
            },
            _scrollTo(index) {
                if (!index && index !== 0) {
                    return
                }
                if (index < 0) {
                    index = 0
                } else if (index > this.listHeight.length - 2) {
                    index = this.listHeight.length - 2
                }
                this.scrollY = -this.listHeight[index]
                this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
            },
            _calculateHeight() {
                this.listHeight = []
                const list = this.$refs.listGroup
                let height = 0
                this.listHeight.push(height)
                for (let i = 0; i < list.length; i++) {
                    let item = list[i]
                    height += item.clientHeight
                    this.listHeight.push(height)
                }
            },
            refresh(){
                this.$refs.listview.refresh();
            }
        },
        watch: {
            data() {
                setTimeout(() => {
                    this._calculateHeight()
                }, 20)
            },
            scrollY(newY) {
                const listHeight = this.listHeight
              console.log(listHeight);
                //当滚动到底部 newY > 0
                if (newY > 0) {
                    this.currentIndex = 0
                    return
                }
                //在中间部分滚动
                for (let i = 0; i < listHeight.length - 1; i++) {
                    let height1 = listHeight[i]
                    let height2 = listHeight[i + 1]
                    if (-newY >= height1 && -newY < height2) {
                        this.currentIndex = i
                        return
                    }
                }
                //当滚动到底部，且是 -newY 大于最后一个元素的上限
                this.currentIndex = listHeight.length - 2
            }
        },
        components: {
            Scroll,
            Loading
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";

    .listview {
        @extend .rel;
        width: 100%;
        height: 100%;
        @extend .over;
        @include backcolor($color-background);
        .list-group {
            padding-bottom: 30px;
        }
        .list-group-title {
            @include h(.8rem);
            padding-left: .55rem;
            color: $color-text-l;
            @include backcolor($color-highlight-background);
        }
        .list-group-item {
            display: flex;
            align-items: center;
            padding: .4rem 0 0 .6rem;
        }
        .avatar {
            width: 1.3rem;
            height: 1.3rem;
            @include border-radius(50%);
        }
        .name {
            margin-left: .4rem;
            color: $color-text-l;
            font-size: .35rem;
        }
        .list-shortcut {
            @extend .abs;
            z-index: 30;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: .2rem;
            padding: .2rem 0;
            border-radius: .1rem;
            @extend .text-center;
            background: $color-background-d;
            font-family: Helvetica;
        }
        .item {
            padding: .03rem;
            line-height: 1;
            color: $color-text-l;
            &.current {
                color: $color-theme
            }
        }
        .list-fixed {
            @extend .abs;
            top: -1px;
            left: 0;
            width: 100%;
            .fixed-title {
                @include h(.8rem);
                padding-left: .55rem;
                color: $color-text-l;
                background: $color-highlight-background;
            }
        }
        .list-shortcut {
            @extend .abs;
            z-index: 30;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: .6rem;
            padding: .2rem 0;
            @include border(.1rem);
            @extend .text-center;
            .item {
                padding: .05rem;
                line-height: 1.2;
                color: $color-text-l;
                font-size: .34rem;
                &.current {
                    color: $color-theme;
                }
            }
        }
    }

    .loading-container {
        @extend .abs;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }


</style>
