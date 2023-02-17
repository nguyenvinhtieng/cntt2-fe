import displayToast from "~/utils/displayToast";
import { postMethod } from "~/utils/fetchData";
import { GLOBAL_TYPES } from "../constants";

export const changeAvatar = (formData) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: GLOBAL_TYPES.APP_STATE,
                payload: { ...state.appState, loading: true }
            });
            const res = await postMethod("change-avatar", formData);
            console.log(res)
            const { data } = res;
            if (data.status) {
                dispatch({
                    type: GLOBAL_TYPES.AUTH,
                    payload: { ...state.auth, user: {...state.auth.user, avatar: data.avatar_link} }
                });
                displayToast("success", data.message);
            } else {
                displayToast("error", data.message);
            }
            dispatch({
                type: GLOBAL_TYPES.APP_STATE,
                payload: { ...state.appState, loading: false }
            });
        }catch(err) {
            console.log(err)
        }
    };
}
export const userUpdate = (user) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: GLOBAL_TYPES.APP_STATE,
                payload: { ...state.appState, loading: true }
            });
            let interestingUser = user.interesting.join("~~");
            user.interesting = interestingUser;
            const res = await postMethod("user-update", user);
            console.log(res)
            const { data } = res;
            if (data.status) {
                dispatch({
                    type: GLOBAL_TYPES.AUTH,
                    payload: { ...state.auth, user: {...state.auth.user, ...user} }
                });
                displayToast("success", data.message);
            } else {
                displayToast("error", data.message);
            }
            dispatch({
                type: GLOBAL_TYPES.APP_STATE,
                payload: { ...state.appState, loading: false }
            });

        }catch(err) {
            console.log(err)
        }
    };
}
