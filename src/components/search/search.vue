<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query">
            <div class="shortcut">
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
                            <span>{{item.k}}</span>
                        </li>
                    </ul>
                </div>
                <div class="search-history" v-show="searchHistory.length">
                    <h1 class="title">
                        <span class="text">搜索历史</span>
                        <span  class="clear" @click="clearSearchHistory"><i class="icon-clear"></i></span>
                    </h1>
                    <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
                </div>
            </div>
        </div>
        <div class="search-result" v-show="query">
            <suggest @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
        </div>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">

    import SearchBox from 'base/search-box/search-box'
    import {getHotKey} from 'api/search'
    import {ERR_OK} from 'api/config'
    import Suggest from 'components/suggest/suggest'
    import SearchList from 'base/search-list/search-list'
    import {mapActions, mapGetters} from 'vuex'

    export default {
        data() {
            return {
                hotKey: [],
                query:''
            }
        },
        created() {
            this._getHotKey();
        },
        computed:{
            ...mapGetters([
                'searchHistory'
            ])
        },
        methods: {
            blurInput(){
                this.$refs.searchBox.blur();
            },
            _getHotKey() {
                getHotKey().then((res) => {
                    if (res.code === ERR_OK) {
                        this.hotKey = res.data.hotkey.slice(0, 10);//截取前10个数据
                    }
                })
            },
            saveSearch(){
                //保存搜索结果
                this.saveSearchHistory(this.query);
            },
            addQuery(query){
                this.$refs.searchBox.setQuery(query);
            },
            onQueryChange(query){
                this.query = query
            },
            ...mapActions([
                'saveSearchHistory',
                'deleteSearchHistory',
                'clearSearchHistory'
            ])
        },
        components: {
            SearchBox,
            Suggest,
            SearchList
        },
        watch: {
/*            query(newQuery) {
                if (!newQuery) {
                    setTimeout(() => {
                        this.$refs.shortcut.refresh()
                    }, 20)
                }
            }*/
        },
    }

</script>
<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";

    .search {
        .search-box-wrapper {
            margin: .4rem
        }
        .shortcut-wrapper {
            padding: 0 .4rem;
            position: fixed;
            top: 3.8rem;
            bottom: 0;
            width: 100%;
            color: #999;
            font-size: .36rem;
            .shortcut {
                height: 100%;
                overflow: hidden;
                .hot-key {
                    .title {
                        margin-bottom: 20px;
                        font-size: .4rem;
                        color: $color-text-l
                    }
                    .item {
                        display: inline-block;
                        padding: .1rem .2rem;
                        margin: 0 .4rem .3rem 0;
                        border-radius: 6px;
                        background: $color-highlight-background;
                        font-size: .33rem;
                        color: $color-text-d
                    }
                }
                .search-history {
                    @extend .rel;
                    .title {
                        display: flex;
                        align-items: center;
                        height: 40px;
                        font-size: .4rem;
                        color: $color-text-l;
                        margin-top: $px22;
                        .text {
                            flex: 1;
                            .clear {
                                .icon-clear {
                                    font-size: .4rem;
                                    color: $color-text-d
                                }
                            }
                        }

                    }
                }

            }
        }
        .search-result {
            position: fixed;
            width: 100%;
            top: 3.8rem;
            bottom: 0
        }
    }
</style>