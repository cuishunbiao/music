<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper">
                <div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <Scroll :data="songs" @scroll="scroll" :listen-scroll="listenScroll"
                :probe-type="probeType" class="list" ref="list">
            <div class="song-list-wrapper">
                <song-list :rank="rank" @select="selectItem" :songs="songs"></song-list>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </Scroll>
    </div>
</template>
<script type="text/ecmascript-6">
    import Scroll from 'base/scroll/scroll'
    import SongList from 'base/song-list/song-list'
    import Loading from 'base/loading/loading'
    import {prefixStyle} from 'common/js/dom'
    import {mapActions} from 'vuex'
    import {selectPlay} from "../../store/actions"
    import {playlistMixin} from 'common/js/mixin'

    const transform = prefixStyle('transform')
    const backdrop = prefixStyle('backdrop-filter')

    export default {
        mixins: [playlistMixin],
        props: {
            bgImage: {
                type: String,
                default: ''
            },
            songs: {
                type: Array,
                default: []
            },
            title: {
                type: String,
                default: ''
            },
            rank: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                scrollY: 0,
                headerHeight: 0
            }
        },
        computed: {
            bgStyle() {
                return `background-image:url(${this.bgImage})`
            }
        },
        created() {
            this.probeType = 3
            this.listenScroll = true
        },
        mounted() {
            this.headerHeight = document.getElementById('header').clientHeight
            this.imageHeight = this.$refs.bgImage.clientHeight
            this.minTranslateY = -this.imageHeight + this.headerHeight
            this.$refs.list.$el.style.top = `${this.imageHeight}px`
        },
        methods: {
            handlePlaylist(playlist) {
                const bottom = playlist.length > 0 ? '1.2rem' : ''
                this.$refs.list.$el.style.bottom = bottom
                this.$refs.list.refresh()
            },
            //回退到上一级页面
            back() {
                this.$router.back()
            },
            scroll(pos) {
                this.scrollY = pos.y
            },
            selectItem(item, index) {
                this.selectPlay({
                    list: this.songs,
                    index
                })
                console.log(1);
            },
            random() {
                this.randomPlay({
                    list: this.songs
                })
            },
            ...mapActions([
                'selectPlay',
                'randomPlay'
            ])
        },
        watch: {
            scrollY(newY) {
                let tranlateY = Math.max(this.minTranslateY, newY)
                let zIndex = 0
                let scale = 1
                let blur = 0
                this.$refs.layer.style[transform] = `translate3d(0,${tranlateY}px,0)`

                //下拉图片放大
                const percent = Math.abs(newY / this.imageHeight)
                if (newY > 0) {
                    scale = 1 + percent
                    console.log(scale)
                    zIndex = 10
                } else {
                    blur = Math.min(10 * percent, 20)
                }

                this.$refs.filter.style[transform] = `blur(${blur}px)`

                if (newY < this.minTranslateY) {
                    zIndex = 10
                    this.$refs.bgImage.style.paddingTop = 0
                    this.$refs.bgImage.style.height = `${this.headerHeight}px`
                    this.$refs.playBtn.style.display = 'none'
                } else {
                    this.$refs.bgImage.style.paddingTop = '70%'
                    this.$refs.bgImage.style.height = 0
                    this.$refs.playBtn.style.display = 'block'
                }
                this.$refs.bgImage.style.zIndex = zIndex
                this.$refs.bgImage.style['transform'] = `scale(${scale})`
                this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`

            }
        },
        components: {
            Scroll,
            SongList,
            Loading
        }
    }

</script>

<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";

    .music-list {
        position: fixed;
        z-index: 100;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: $color-background;
        .back {
            @extend .abs;
            top: 0;
            left: 0;
            z-index: 50;
            .icon-back {
                @extend .block;
                padding: .2rem .15rem;
                font-size: .5rem;
                color: $color-theme;
            }
        }
        .title {
            @extend .abs;
            top: 0;
            left: 10%;
            z-index: 40;
            width: 80%;
            @extend .no-wrap;
            @extend .text-center;
            line-height: 1rem;
            font-size: .37rem;
            color: $color-text;
        }
        .bg-image {
            @extend .rel;
            width: 100%;
            height: 0;
            padding-top: 70%;
            transform-origin: center;
            background-size: cover;
            .play-wrapper {
                @extend .abs;
                bottom: .5rem;
                z-index: 50;
                width: 100%;
                color: $color-theme;
                .play {
                    box-sizing: border-box;
                    width: 3.8rem;
                    padding: .2rem 0;
                    margin: 0 auto;
                    @extend .text-center;
                    border-radius: 1rem;
                    font-size: 0;
                    @include border($color-theme, 1px, solid);
                    .icon-play {
                        @extend .block-in;
                        vertical-align: middle;
                        font-size: .5rem;
                        margin-right: .2rem;

                    }
                    .text {
                        @extend .block-in;
                        vertical-align: middle;
                        font-size: .37rem;
                    }
                }
            }
            .filter {
                @extend .abs;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(7, 17, 27, 0.4);
            }
        }
        .bg-layer {
            @extend .rel;
            height: 100%;
            background: $color-background;
        }
        .list {
            position: fixed;
            top: 0;
            bottom: 0;
            width: 100%;
            background: $color-background;
            .song-list-wrapper {
                @include transition(all, .2s);
                padding: .3rem .6rem;
            }
            .loading-container {
                @extend .abs;
                width: 100%;
                top: 50%;
                transform: translateY(-50%);
            }
        }

    }

</style>
