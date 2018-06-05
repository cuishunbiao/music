<template>
    <div class="rank" ref="rank">
        <Scroll :data="lists" class="toplist" ref="toplist">
            <ul>
                <li class="item" v-for="item in lists" @click="selectItem(item)">
                    <div class="icon"><img width="350" height="350" v-lazy="item.picUrl"></div>
                    <ul class="songlist">
                        <li class="song" v-for="(song,index) in item.songList">
                            <span>{{index + 1}}</span>
                            <span>{{song.songname}}--{{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-container" v-show="!lists.length">
                <Loading></Loading>
            </div>
        </Scroll>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import {getTopList} from 'api/rank'
    import {ERR_OK} from "api/config";
    import Scroll from 'base/scroll/scroll'
    import Loading from 'base/loading/loading'
    import {playlistMixin} from 'common/js/mixin'
    import {mapMutations} from 'vuex'

    export default {
        mixins:[playlistMixin],
        data(){
            return{
                lists:[]
            }
        },
        created() {
            this._getTopList();
        },
        methods: {
            _getTopList() {
                getTopList().then((res) => {
                    if (res.code === ERR_OK) {
                        this.lists = res.data.topList;
                    }
                })
            },
            selectItem (item) {
                this.$router.push({
                    path: `/rank/${item.id}`
                })
                this.setTopList(item)
            },
            handlePlaylist(playlist){
                const bottom = playlist.length ? '1.2rem' : ''
                this.$refs.rank.style.bottom = bottom
                this.$refs.toplist.refresh()
            },
            ...mapMutations({
                setTopList:'SET_TOP_LIST'
            })
        },
        components:{
            Scroll,
            Loading
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";

    .rank{  position: fixed;  width: 100%; top:2.2rem;  bottom: 0;
        .toplist{ height:100%; overflow: hidden;padding-left: .4rem; padding-right: .4rem;
            .item{display: flex; width: 100%; height: 350px; margin-bottom: .4rem;
                .icon{flex: 0 0 350px; width: 350px;  height: 350px}
                .songlist{flex: 1;display: flex; flex-direction: column; justify-content: center; padding-left: .5rem;
                        height: 350px; width: 100%; overflow: hidden; background: $color-highlight-background;
                        color: $color-text-d;  font-size: .35rem;
                    .song{line-height: .65rem;text-overflow: ellipsis;  overflow: hidden;  white-space: nowrap }
                }
            }
        }
        .loading-container{  position: absolute;  width: 100%;  top: 50%;  transform: translateY(-50%)}
    }

</style>