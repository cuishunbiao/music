<template>
    <Scroll class="suggest"
            :data="result"
            :pullup="pullup"
            @scrollToEnd="searchMore"
            :beforeScroll="beforeScroll"
            @beforeScroll="listScroll"
            ref="suggest"
    >
        <ul class="suggest-list">
            <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div v-show="!hasMore && !result.length" class="no-result-wrapper">
            <no-result title="没有搜索结果"></no-result>
        </div>
    </Scroll>
</template>

<script type="text/ecmascript-6">
    import Scroll from 'base/scroll/scroll'
    import Loading from 'base/loading/loading'
    import NoResult from 'base/no-result/no-result'
    import { search } from 'api/search'
    import { ERR_OK } from 'api/config'
    import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
    import { mapMutations, mapActions } from 'vuex'
    import Singer from 'common/js/singer'

    const TYPE_SINGER = 'singer';
    const perpage = 20

    export default {
        props: {
            query: {
                type: String,
                default: ''
            },
            showSinger: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                page: 1,
                result: [],
                pullup: true,
                hasMore: true,
                beforeScroll: true,
            }
        },
        methods: {
            refresh() {
                this.$refs.suggest.refresh()
            },
            listScroll() {
                this.$emit('listScroll');
            },
            selectItem(item) {
                if (item.type === TYPE_SINGER) {
                    const singer = new Singer({
                        id: item.singermid,
                        name: item.singername,
                    })
                    this.$router.push({
                        path: `/search/${singer.id}`
                    })
                    this.setSinger(singer)
                } else {
                    this.insertSong(item)
                }
                this.$emit('select', item);
            },
            getIconCls(item) {
                if (item.type === TYPE_SINGER) {
                    return 'icon-mine'
                } else {
                    return 'icon-music'
                }
            },
            getDisplayName(item) {
                if (item.type === TYPE_SINGER) {
                    return item.singername
                } else {
                    return `${item.name}-${item.singer}`
                }
            },
            search() {
                this.page = 1;
                this.hasMore = true;
                this.$refs.suggest.scrollTo(0, 0);
                search(this.query, this.page, this.showSinger, perpage).then((res) => {
                    if (res.code === ERR_OK) {
                        this._genResult(res.data).then((result) => {
                            this.result = result
                        })
                        this._checkMore(res.data);
                    }
                })
            },
            _genResult(data) {
                let ret = [];
                if (data.zhida && data.zhida.singerid && this.page === 1) {
                    ret.push({...data.zhida, ...{type: TYPE_SINGER}})
                }
                return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs)=>{
                    ret = ret.concat(songs);
                    return ret;
                })
            },
            _normalizeSongs(list) {
                let ret = [];
                list.forEach((musicData) => {
                    if (isValidMusic(musicData)) {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            },
            _checkMore(data) {
                const song = data.song;
                if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
                    this.hasMore = false;
                }
            },
            searchMore() {
                if (!this.hasMore) {
                    return;
                }
                this.page++;
                search(this.query, this.page, this.showSinger, perpage).then((res) => {
                    if (res.code === ERR_OK) {
                        this._genResult(res.data).then((result) => {
                            this.result = this.result.concat(result)
                        })
                        this._checkMore(res.data)
                    }
                })
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            }),
            ...mapActions([
                'insertSong'
            ])
        },
        watch: {
            query() {
                this.search()
            }
        },
        components: {
            Scroll,
            Loading,
            NoResult
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";

    .suggest {
        height: 100%;
        overflow: hidden;
        .suggest-list {
            padding: 0 .5rem .3rem .5rem;
            .suggest-item {
                display: flex;
                align-items: center;
                padding-bottom: .4rem;
                .icon {
                    flex: 0 0 .5rem;
                    width: .5rem;
                    [class^="icon-"] {
                        margin-top: .1rem;
                        font-size: .4rem;
                        color: $color-text-d;
                    }
                }
                .name {
                    flex: 1;
                    font-size: .4rem;
                    color: #666;
                    overflow: hidden;
                }
            }
        }
        .no-result-wrapper {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
</style>