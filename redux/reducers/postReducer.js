import { GLOBAL_TYPES } from '../constants'
const initialState = {
    data: [],
    dataTemp: [],
    page: -1,
    pageTemp: 0,
    loading: false,
    isEnd: false,
    searchContent: '',
    total: 0,
    totalTemp: 0,
}
function postReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBAL_TYPES.POST:
            return action.payload
        default:
            return state
    }
}
export default postReducer;