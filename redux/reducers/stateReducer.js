import { GLOBAL_TYPES } from '../constants'
const initialState = {
   loading: false,
}
function stateReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBAL_TYPES.APP_STATE:
            return action.payload
        default:
            return state
    }
}
export default stateReducer;