<template>
    <div class="player" v-show="playlist.length > 0">
        <div class="normal-player" v-show="fullScreen">
            <div class="background">
                <img width="100%" height="100%" :src="currentSong.image" alt="">
            </div>
            <div class="top">
                <div class="back"><i class="icon-back"></i></div>
                <h1 class="title" v-html="currentSong.name"></h1>
                <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <div class="middle">
                <div class="middle-l">
                    <div class="cd-wrapper">
                        <div class="cd"><img :src="currentSong.image" alt="" class="image"></div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="operators">
                    <div class="icon i-left"><i class="icon-sequence"></i></div>
                    <div class="icon i-left"><i class="icon-prev"></i></div>
                    <div class="icon i-center"><i class="icon-play"></i></div>
                    <div class="icon i-right"><i class="icon-next"></i></div>
                    <div class="icon i-right"><i class="icon icon-not-favorite"></i></div>
                </div>
            </div>
        </div>
        <div class="mini-player" v-show="!fullScreen">
            <div class="icon"><img width="40" height="40" :src="currentSong.image" alt=""></div>
            <div class="text">
                <h2 class="name" v-html="currentSong.name"></h2>
                <p class="desc" v-html="currentSong.singer"></p>
            </div>
            <div class="control"></div>
            <div class="control"><i class="icon-playlist"></i></div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import {mapGetters} from 'vuex'

    export default {
        computed: {
            ...mapGetters([
                'fullScreen',
                'playlist',
                'currentSong'
            ])
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
                    top: 0;
                    left: 6px;
                    z-index: 50;
                    .icon-back {
                        @extend .block;
                        padding: 9px;
                        font-size: .6rem;
                        color: $color-theme;
                        transform: rotate(-90deg);
                    }
                }
                .title {
                    width: 70%;
                    margin: 0 auto;
                    line-height: 40px;
                    text-align: center;
                    font-size: 16px;
                    color: $color-text;
                }
                .subtitle {
                    line-height: 20px;
                    text-align: center;
                    font-size: 14px;
                    color: $color-text;
                }
            }
            .middle {
                position: fixed;
                width: 100%;
                top: 80px;
                bottom: 170px;
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
                            .play {
                                animation: rotate 20s linear infinite;
                            }
                        }
                    }
                    .playing-lyric-wrapper {
                        width: 80%;
                        margin: 30px auto 0 auto;
                        overflow: hidden;
                        text-align: center;
                        .playing-lyric {
                            height: 20px;
                            line-height: 20px;
                            font-size: 14px;
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
                            line-height: 32px;
                            color: $color-text-l;
                            font-size: 14px;
                            &.current {
                                color: $color-text;
                            }
                        }
                        .pure-music {
                            padding-top: 50%;
                            line-height: 32px;
                            color: $color-text-l;
                            font-size: 14px;
                        }
                    }
                }
            }
            .bottom {
                @extend .abs;
                bottom: 50px;
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
                    padding: 10px 0;
                    .time {
                        color: $color-text;
                        font-size: 14px;
                        flex: 0 0 30px;
                        line-height: 30px;
                        width: 30px;
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
            z-index: 100;
            width: 100%;
            height: 60px;
            @include backcolor($color-highlight-background);
            &.mini-enter-active, &.mini-leave-active {
                transition: all .4s;
            }
            &.mini-enter, &.mini-leave-to {
                opacity: 0;
            }
            .icon {
                flex: 0 0 40px;
                width: 40px;
                height: 40px;
                padding: 0 10px 0 20px;
                .imgWrapper {
                    height: 100%;
                    width: 100%;
                    img {
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
                line-height: 20px;
                @extend .over;
                .name {
                    margin-bottom: 2px;
                    font-size: 14px;
                    color: $color-text;
                }
                .desc {
                    font-size: 12px;
                    color: $color-text-d;
                }
            }
            .control {
                flex: 0 0 30px;
                width: 30px;
                padding: 0 10px;
                .icon-play-mini, .icon-pause-mini, .icon-playlist {
                    font-size: 30px;
                    color: $color-theme-d;
                }
                .icon-mini {
                    font-size: 32px;
                    @extend .abs;
                    left: 0;
                    top: 0;
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
