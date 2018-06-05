<template>
    <div class="recommend" ref="recommend">
        <scroll ref="scroll" class="recommend-content" :data="discList">
            <div>
                <div v-if="recommedList.length" class="slider-wrapper">
                    <slider>
                        <div class="sliderli" v-for="item in recommedList">
                            <a :href="item.linkUrl">
                                <img @load="loadImage" class="needclick" :src="item.picUrl" alt="">
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="recommend-list">
                    <h2 class="list-title">热门歌曲推荐</h2>
                    <ul>
                        <li @click="selectItem(item)" v-for="item in discList" class="item">
                            <div class="icon"><img v-lazy="item.imgurl" alt=""></div>
                            <div class="text">
                                <h2 class="name" v-html="item.creator.name"></h2>
                                <p class="desc" v-html="item.dissname"></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container" v-if="!discList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>
<script type="text/ecmascript-6">
    import Loading from 'base/loading/loading'
    import Slider from 'base/slider/slider'
    import Scroll from 'base/scroll/scroll'
    import {getRecommend, getDiscList} from 'api/recommend'
    import {ERR_OK} from 'api/config'
    import {playlistMixin} from 'common/js/mixin'
    import {mapMutations} from 'vuex'

    export default {
        mixins: [playlistMixin],
        data() {
            return {
                recommedList: [],
                discList: []
            }
        },
        created() {
            this._getRecommend()
            this._getDiscList()
        },

        methods: {
            handlePlaylist(playlist) {
                const bottom = playlist.length > 0 ? '1.2rem' : ''
                this.$refs.recommend.style.bottom = bottom
                this.$refs.scroll.refresh()
            },
            selectItem(item) {
                this.$router.push({
                    path: `/recommend/${item.dissid}`
                })
                this.setDisc(item)
            },
            _getRecommend() {
                getRecommend().then((res) => {
                    if (res.code === ERR_OK) {
                        this.recommedList = res.data.slider
                        console.log(this.recommedList);
                    }
                })
            },
            _getDiscList() {
                getDiscList().then((res) => {
                    if (res.code === ERR_OK) {
                        this.discList = res.data.list
                    }
                })
            },
            //加载图片后，重新刷新滚动高度
            loadImage() {
                if (!this.checkLoaded) {
                    this.$refs.scroll.refresh();
                    this.checkLoaded = true;
                }
            },
            ...mapMutations({
                setDisc: 'SET_DISC'
            })
        },
        components: {
            Slider,
            Scroll,
            Loading
        }
    }

</script>
<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";

    .recommend {
        position: fixed;
        top: 2rem;
        bottom: 0;
        width: 100%;
        .recommend-content {
            height: 100%;
            @extend .over;
            .slider-wrapper {
                @extend .rel;
                width: 100%;
                @extend .over;
            }
            .recommend-list {
                .list-title {
                    @include h(1.6rem);
                    @extend .text-center;
                    color: $color-theme;
                }
                .item {
                    display: flex;
                    box-sizing: border-box;
                    align-items: center;
                    padding: 0 .4rem .4rem .4rem;
                    .icon {
                        flex: 0 0 1rem;
                        width: 1.5rem;
                        margin-right: .4rem;
                        img {
                            width: 1.5rem;
                            @include h(1.5rem);
                        }
                    }
                    .text {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        flex: 1;
                        line-height: .6rem;
                        @extend .over;
                        .name {
                            margin-bottom: .1rem;
                            color: $FFF;
                        }
                        .desc {
                            color: $color-text-d;
                            line-height: .5rem;
                            max-height: 1.05rem;
                            @extend .over;
                        }
                    }
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