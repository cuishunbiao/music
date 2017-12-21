/*
*
* 取数据到组件中
* 简单包装
* 函数 => 计算值
* */

export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

//计算 Song
export const currentSong = (state) => {
    return state.playlist[state.currentIndex] || {}
}

