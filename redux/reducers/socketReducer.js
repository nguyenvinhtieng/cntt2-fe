import { GLOBAL_TYPES } from '../constants'

const initialState = {}
function socketReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBAL_TYPES.SOCKET:
            return action.payload
        default:
            return state
    }
}
export default socketReducer;