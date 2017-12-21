import {playMode} from 'common/js/config'
//定义全局数据
const state = {
    singer: {},
    playing: false,//播放状态
    fullScreen: false,//展开收起
    playlist: [],//列表
    sequenceList:[],//顺序列表
    mode:playMode.sequence,//语义话 mode
    currentIndex: -1,//当前播放的索引


    //不需要 currentSong ，可以用 singer 和 currentIndex 计算而来
}
export default state