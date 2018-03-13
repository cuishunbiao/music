<template>
    <div class="player" v-show="playlist.length > 0">
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterEnter"
        >
            <div class="normal-player" v-show="fullScreen">
                <div ref="background" class="background">
                    <img width="100%" height="100%" :src="currentSong.image" alt="">
                </div>
                <div class="top">
                    <div class="back" @click="back"><i class="icon-back"></i></div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle">
                    <div class="middle-l">
                        <div class="cd-wrapper">
                            <div class="cd" :class="cdCls"><img :src="currentSong.image" alt="" class="image"></div>
                        </div>
                    </div>
                    <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine"
                                   class="text"
                                   :class="{'current': currentLineNum ===index}"
                                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
                            </div>
                            <!--<div class="pure-music" v-show="isPureMusic">
                                <p>{{pureMusicLyric}}</p>
                            </div>-->
                        </div>
                    </Scroll>
                </div>

                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                        </div>
                        <span class="time time-r">{{format(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode"><i :class="iconMode"></i></div>
                        <div class="icon i-left" :class="disableCls"><i @click="prev" class="icon icon-prev"></i></div>
                        <div class="icon i-center"><i @click="togglePlaying" :class="playIcon"></i></div>
                        <div class="icon i-right" :class="disableCls"><i @click="next" class="icon icon-next"></i></div>
                        <div class="icon i-right"><i class="icon icon-not-favorite"></i></div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <div class="imgWrapper"><img :class="cdCls" :src="currentSong.image" alt=""></div>
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <progress-circle :radius="radius" :percent="percent">
                        <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
                    </progress-circle>
                </div>
                <div class="control"><i class="icon-playlist"></i></div>
            </div>
        </transition>
        <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updataTime"
               @ended="end"></audio>
    </div>
</template>
<script type="text/ecmascript-6">
    import {mapGetters, mapMutations} from 'vuex'
    import animations from 'create-keyframe-animation'
    import ProgressBar from 'base/progress-bar/progress-bar'
    import ProgressCircle from 'base/progress-circle/progress-circle'
    import {playMode} from 'common/js/config'
    import {shuffle} from 'common/js/util'
    import Lyric from 'lyric-parser'
    import Scroll from 'base/scroll/scroll'

    export default {
        data() {
            return {
                songReady: false,
                currentTime: 0,
                radius: 32,
                currentLyric: null,
                currentLineNum: 0,
                playingLyric:''
            }
        },
        computed: {
            cdCls() {
                return this.playing ? 'play' : 'play pause'
            },
            playIcon() {
                return this.playing ? 'icon-pause' : 'icon-play'
            },
            iconMode() {
                return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
            },
            miniIcon() {
                return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
            },
            disableCls() {
                return this.songReady ? '' : 'disable'
            },
            percent() {
                return this.currentTime / this.currentSong.duration
            },
            ...mapGetters([
                'fullScreen',
                'playlist',
                'currentSong',
                'playing',
                'currentIndex',//映射 取索引
                'mode',//播放模式
                'sequenceList'
            ])
        },
        created: function () {

        },
        methods: {
            end() {
                if (this.mode === playMode.loop) {
                    this.loop()
                } else {
                    this.next();
                }
            },
            loop() {
                this.$refs.audio.currentTime = 0
                this.$refs.audio.play();
            },
            changeMode() {
                const mode = (this.mode + 1) % 3
                this.setPlayMode(mode)
                let list = null
                if (mode === playMode.random) {
                    list = shuffle(this.sequenceList)
                } else {
                    list = this.sequenceList
                }
                console.log(list);
                this.resetCurrentIndex(list)
                this.setPlayList(list)
            },
            resetCurrentIndex(list) {
                let index = list.findIndex((item) => {
                    return item.id === this.currentSong.id
                })
                this.setCurrentIndex(index)
            },
            back() {
                this.setFullScreen(false);
            },
            open() {
                this.setFullScreen(true);
            },
            enter(el, done) {

            },
            afterEnter() {

            },
            leave() {

            },
            afterLeave() {

            },
            _getPosAndScale() {
                //动画未写
            },
            togglePlaying() {
                this.setPlayIngState(!this.playing);
            },
            next() {
                if (!this.songReady) {
                    return
                }
                let index = this.currentIndex + 1
                if (index === this.playlist.length) {
                    index = 0
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying();
                }
                this.songReady = false;
            },
            prev() {
                if (!this.songReady) {
                    return
                }
                let index = this.currentIndex - 1
                if (index === -1) {
                    index = this.playlist.length - 1
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying();
                }
                this.songReady = false;
            },
            ready() {
                this.songReady = true;
            },
            error() {
                this.songReady = true;
            },
            updataTime(e) {
                this.currentTime = e.target.currentTime;//获取时间

            },
            format(interval) {
                interval = interval | 0
                const minute = interval / 60 | 0
                const second = this._pad(interval % 60)
                return `${minute}:${second}`
            },
            onProgressBarChange(percent) {
                this.$refs.audio.currentTime = this.currentSong.duration * percent
                if (!this.playing) {
                    this.togglePlaying();
                }
            },
            _pad(num, n = 2) {
                let len = num.toString().length
                while (len < n) {
                    num = '0' + num
                    len++
                }
                return num
            },
            getLyric() {
                this.currentSong.getLyric().then((lyric) => {
                    if (this.currentSong.lyric !== lyric) {
                        return
                    }
                    this.currentLyric = new Lyric(lyric, this.handleLyric)
                    this.isPureMusic = !this.currentLyric.lines.length
                    if (this.isPureMusic) {
                        this.pureMusicLyric = this.currentLyric.lrc.replace(timeExp, '').trim()
                        this.playingLyric = this.pureMusicLyric
                    }
                })
            },
            handleLyric({lineNum, text}) {
                this.currentLineNum = lineNum
                if (lineNum > 5) {
                    let lineEl = this.$refs.lyricLine[lineNum - 5]
                    this.$refs.lyricList.scrollToElement(lineEl,1000)
                }else{
                    this.$refs.lyricList.scrollTo(0,0,1000)
                }
                this.playingLyric = text
            },
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN',
                setPlayIngState: 'SET_PLAYING_STATE',
                setCurrentIndex: 'SET_CURRENT_INDEX',
                setPlayMode: 'SET_PLAY_MODE',
                setPlayList: 'SET_PLAYLIST'
            })
        },
        mounted: function () {
            //动画未写
        },
        watch: {
            currentSong(newSong, oldSong) {
                if (newSong.id === oldSong.id) {
                    return
                }
                setTimeout(() => {
                    this.$refs.audio.play()
                    this.getLyric()
                }, 1000)
            },
            playing(newPlaying) {
                const audio = this.$refs.audio
                this.$nextTick(() => {
                    newPlaying ? audio.play() : audio.pause()
                })
            }
        },
        components: {
            ProgressBar,
            ProgressCircle,
            Scroll
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";

    .player {
        .normal-player {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 150;
            @include backcolor($color-background);

            .background {
                @extend .abs;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                opacity: .6;
                filter: blur(20px);
            }

            .top {
                @extend .rel;
                margin-bottom: 25px;
                .back {
                    @extend .abs;
                    top: .1rem;
                    left: .15rem;
                    z-index: 50;
                    .icon-back {
                        @extend .block;
                        padding: $px8;
                        font-size: .6rem;
                        color: $color-theme;
                        transform: rotate(-90deg);
                    }
                }
                .title {
                    width: 70%;
                    margin: 0 auto;
                    line-height: $px60;
                    text-align: center;
                    font-size: $px30;
                    color: $color-text;
                }
                .subtitle {
                    line-height: $px26;
                    text-align: center;
                    font-size: $px20;
                    color: $color-text;
                }
            }
            .middle {
                position: fixed;
                width: 100%;
                top: 1.7rem;
                bottom: 3rem;
                white-space: nowrap;
                font-size: 0;
                .middle-l {
                    @extend .block-in;
                    vertical-align: top;
                    @extend .rel;
                    width: 100%;
                    height: 0;
                    padding-top: 80%;
                    .cd-wrapper {
                        @extend .abs;
                        left: 10%;
                        top: 0;
                        width: 80%;
                        box-sizing: border-box;
                        height: 100%;
                        .cd {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                            .image {
                                @extend .abs;
                                left: 0;
                                top: 0;
                                width: 100%;
                                height: 100%;
                                box-sizing: border-box;
                                border-radius: 50%;
                                border: 10px solid rgba(255, 255, 255, .1);
                            }
                            &.play {
                                animation: rotate 20s linear infinite;
                            }
                            &.pause {
                                animation-play-state: paused;
                            }
                        }
                    }
                    .playing-lyric-wrapper {
                        width: 80%;
                        margin: 30px auto 0 auto;
                        overflow: hidden;
                        text-align: center;
                        .playing-lyric {
                            height: .65rem;
                            line-height: .65rem;
                            font-size: .35rem;
                            color: $color-text-l;
                        }
                    }
                }
                .middle-r {
                    @extend .block-in;
                    vertical-align: top;
                    width: 100%;
                    height: 100%;
                    @extend .over;
                    .lyric-wrapper {
                        width: 80%;
                        margin: 0 auto;
                        @extend .over;
                        text-align: center;
                        .text {
                            line-height: .65rem;
                            color: $color-text-l;
                            font-size: .35rem;
                            &.current {
                                color: #ffffff;
                            }
                        }
                        .pure-music {
                            padding-top: 50%;
                            line-height: .65rem;
                            color: $color-text-l;
                            font-size: .35rem;
                        }
                    }
                }
            }
            .bottom {
                @extend .abs;
                bottom: $px56;
                width: 100%;
                .dot-wrapper {
                    text-align: center;
                    font-size: 0;
                    .dot {
                        @extend .block-in;
                        vertical-align: middle;
                        margin: 0 4px;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        @include backcolor($color-text-l);
                        &.active {
                            width: 20px;
                            @include border-radius(5px);
                            @include backcolor($color-text-ll);
                        }
                    }
                }
                .progress-wrapper {
                    display: flex;
                    align-items: center;
                    width: 80%;
                    margin: 0 auto;
                    padding: $px40 0;
                    .time {
                        color: $color-text;
                        font-size: $px24;
                        flex: 0 0 $px66;
                        line-height: $px40;
                        width: $px40;
                        &.time-l {
                            text-align: left;
                        }
                        &.time-r {
                            text-align: right;
                        }
                    }
                    .progress-bar-wrapper {
                        flex: 1;
                    }
                }
                .operators {
                    display: flex;
                    align-items: center;
                    .icon {
                        flex: 1;
                        color: $color-theme;
                        &.disable {
                            color: $color-theme-d;
                        }
                        i {
                            font-size: .7rem;
                        }
                    }
                    .i-left {
                        text-align: right;
                    }
                    .i-center {
                        padding: 0 20px;
                        text-align: center;
                        i {
                            font-size: .7rem;
                        }
                    }
                    .i-right {
                        @extend .text-left;
                    }
                    .icon-favorite {
                        color: $color-sub-theme;
                    }
                }

            }
            &.normal-enter-active, &.normal-leave-active {
                transition: all .4s;
                .top, .bottom {
                    transition: all .4s cubic-bezier(.86, .18, .82, 1.32);
                }
            }
            &.normal-enter, &.normal-leave-to {
                opacity: 0;
                .top {
                    transform: translate3d(0, -100px, 0);
                }
                .bottom {
                    transform: translate3d(0, 100px, 0);
                }
            }
        }
        .mini-player {
            display: flex;
            align-items: center;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 200;
            width: 100%;
            height: 1.2rem;
            @include backcolor($color-highlight-background);
            &.mini-enter-active, &.mini-leave-active {
                transition: all .4s;
            }
            &.mini-enter, &.mini-leave-to {
                opacity: 0;
            }
            .icon {
                flex: 0 0 1.2rem;
                width: $px56;
                height: $px56;
                padding: 0 $px16 0 $px20;
                .imgWrapper {
                    height: 100%;
                    width: 100%;
                    img {
                        width: 100%;
                        @include border-radius(50%);
                        &.play {
                            animation: rotate 10s linear infinite;
                        }
                        &.pause {
                            animation-play-state: paused;
                        }
                    }
                }
            }
            .text {
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;
                line-height: $px30;
                @extend .over;
                .name {
                    margin-bottom: 2px;
                    font-size: $px26;
                    color: $color-text;
                }
                .desc {
                    font-size: $px20;
                    color: $color-text-d;
                }
            }
            .control {
                flex: 0 0 1rem;
                width: $px40;
                padding: 0 10px;
                .icon-play-mini, .icon-pause-mini, .icon-playlist {
                    font-size: $px40;
                    color: $color-theme;
                }
                .icon-mini {
                    font-size: 80px;
                    @extend .abs;
                    left: 0;
                    top: 0;
                    color: $color-theme-d;
                }
                i {
                    font-size: $px40;
                    color: $color-theme;
                }
            }
        }
    }

    @keyframes rotate {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
