<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input ref="query" v-model="query" class="box" type="text" :placeholder="placeholder">
        <i @click="clearFn" v-show="query" class="icon-dismiss"></i>
    </div>
</template>
<script type="text/ecmascript-6">
    import {debounce} from 'common/js/util'

    export default {
        props: {
            placeholder: {
                type: String,
                default: '搜索歌曲、歌手'
            }
        },
        data() {
            return {
                query: ''
            }
        },
        created() {
            this.$watch('query', debounce((newQuery) => {
                this.$emit('query', newQuery)
            },200))
        },
        methods: {
            clearFn: function () {
                this.query = '';
            },
            setQuery(query) {
                this.query = query;
            },
            blur(){
                this.$refs.query.blur
            }
        }
    }

</script>
<style lang="scss" type="text/scss" scoped>
    @import "~common/sass/common";

    .search-box {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        padding: 0 .2rem;
        height: 1rem;
        background: $color-highlight-background;
        border-radius: 6px;

        .icon-search {
            font-size: .6rem;
            color: $color-text-d
        }

        .box {
            flex: 1;
            margin: 0 .2rem;
            line-height: .9rem;
            background: $color-highlight-background;
            color: #ddd;
            font-size: .4rem;
            outline: 0;
            &::placeholder {
                color: $color-text-d;
            }
        }

        .icon-dismiss {
            font-size: .5rem;
            color: $color-text-d
        }
    }


</style>