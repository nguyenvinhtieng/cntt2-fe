import { combineReducers } from "redux";
import authReducer from "./authReducer";
import postReducer from "./postReducer";
import questionReducer from "./questionReducer";
import stateReducer from "./stateReducer";
import socketReducer from "./socketReducer";
const rootReducer = combineReducers({
    auth: authReducer,
    posts: postReducer,
    questions: questionReducer,
    appState: stateReducer,
    socket: socketReducer,
});

export default rootReducer;