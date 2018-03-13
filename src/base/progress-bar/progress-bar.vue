<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper">
                <div class="progress-btn" ref="progressBtn"
                     @touchstart.prevent="progressTouchStart"
                     @touchmove.prevent="progressTouchMove"
                     @touchend="progressTouchEnd"
                ></div>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">

    import {prefixStyle} from 'common/js/dom'

    const transform = prefixStyle('transform')
    const progressBtnWidth = 16;
    export default {
        props: {
            percent: {
                type: Number,
                default: 0
            }
        },
        created() {
            this.touch = {}
        },
        methods: {
            progressTouchStart(e) {
                this.touch.initiated = true;//初始位置
                this.touch.startX = e.touches[0].pageX
                this.touch.left = this.$refs.progress.clientWidth;
            },
            progressTouchMove(e) {
                if (!this.touch.initiated) {
                    return
                }
                const deltaX = e.touches[0].pageX - this.touch.startX
                const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
                this._offset(offsetWidth);
            },
            progressTouchEnd() {
                this.touch.initiated = false;
                this._triggerPercent();
            },
            progressClick(e){
                const rect = this.$refs.progressBar.getBoundingClientRect();
                const offsetWidth = e.pageX - rect.left
                this._offset(offsetWidth);
                //当点击 progressBtn 的时候，获取 e.offsetX 不对
                //this._offset(e.offsetX)
                this._triggerPercent()
            },
            _offset(offsetWidth) {
                this.$refs.progress.style.width = `${offsetWidth}px`;
                this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            },
            _triggerPercent() {
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
                const percent = this.$refs.progress.clientWidth / barWidth;
                this.$emit('percentChange', percent);
            },
        },
        watch: {
            percent(newPercent) {
                if (newPercent >= 0 && !this.touch.initiated) {
                    const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
                    const offsetWidth = newPercent * barWidth;
                    this._offset(offsetWidth);
                }
            }
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";

    .progress-bar {
        height: $px40;
        .bar-inner {
            position: relative;
            top: .21rem;
            height: $px8;
            background: rgba(0, 0, 0, 0.3);
        }
        .progress {
            position: absolute;
            height: 100%;
            background: $color-theme
        }
        .progress-btn-wrapper {
            @extend .abs;
            left: -$px10;
            top: -$px15;
            width: $px40;
            height: $px40;
            .progress-btn {
                @extend .rel;
                top: 50%;
                left: .05rem;
                box-sizing: border-box;
                width: $px26;
                height: $px26;
                border: 3px solid $color-text;
                border-radius: 50%;
                background: $color-theme;
                margin-top: -$px15;
            }
        }
    }
</style>

