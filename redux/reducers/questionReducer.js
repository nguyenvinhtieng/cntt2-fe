import { GLOBAL_TYPES } from '../constants'
const initialState = {
    data: [],
    dataTemp: [],
    page: -1,
    pageTemp: 0,
    loading: false,
    isEnd: false,
    total: 0
}
function questionReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBAL_TYPES.QUESTION:
            return action.payload
        default:
            return state
    }
}
export default questionReducer;