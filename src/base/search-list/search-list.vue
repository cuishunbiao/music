<template>
    <div class="search-list" v-show="searches.length">
        <ul>
            <li class="search-item" v-for="item in searches" @click="selectItem(item)">
                <span class="text">{{item}}</span>
                <span class="icon" @click.stop="deleteOne(item)">
                    <i class="icon-delete"></i>
                </span>
            </li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        props: {
            searches: {
                type: Array,
                default: []
            }
        },
        methods: {
            selectItem(item) {
                this.$emit('select', item);
            },
            deleteOne(item) {
                console.log(1);
                this.$emit('delete', item)
            }
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";

    .search-list {
        margin-top: $px15;
        .search-item {
            display: flex;
            align-items: center;
            height: $px56;
            overflow: hidden;
            &.list-enter-active, &.list-leave-active {
                transition: all 0.1s
            }
            &.list-enter, &.list-leave-to {
                height: 0;
            }
            .text {
                flex: 1;
                color: $color-text-l
            }
            .icon { width: $px45; @include h($px34);
                padding-right: $px8;
                .icon-delete {
                    font-size: $px15;
                    color: $color-text-d
                }
            }
        }
    }

</style>