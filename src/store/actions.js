import * as types from './mutation-types'

//定义动作

export const selectPlay = function ({commit, state}, {list, index}) {
    /* 提交 */
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAYLIST, list)
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PlAYING_STATE, true)
}

