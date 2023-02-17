import API from "~/api";
import displayToast from "~/utils/displayToast";
import { getMethod, postMethod } from "~/utils/fetchData";
import { CREDENTIALS, GLOBAL_TYPES } from "../constants";

export const userLogout = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const socket = state.socket;
        localStorage.removeItem(CREDENTIALS.TOKEN_NAME);
        dispatch({
            type: GLOBAL_TYPES.AUTH,
            payload: {
                ...getState().auth,
                isAuthenticated: false,
                user: null,
                isAdmin: false,
            }
        });
    };
};
export const fetchDataUser = () => {
    return async (dispatch, getState) => {
        try {
            const token = localStorage.getItem(CREDENTIALS.TOKEN_NAME);
            if(!token) return
            let response = await getMethod(API.FETCHDATAUSER);
            const { data } = response;
            if (data.status && data.user) {
                dispatch({
                    type: GLOBAL_TYPES.AUTH,
                    payload: { isAuthenticated: true, isAdmin: false, user: data.user },
                });
            }else {
                localStorage.removeItem(CREDENTIALS.TOKEN_NAME);
                dispatch({
                    type: GLOBAL_TYPES.AUTH,
                    payload: {
                        ...getState().auth,
                        isAuthenticated: false,
                        user: null,
                        isAdmin: false,
                    }
                });
            }
        } catch (error) {
            console.log(error);
            displayToast("error", error.message);
        }
    };
}
export const userLogin = ({ username, password, router }) => {
    return async (dispatch, getState) => {
        try {
            let response = await postMethod("login", { username, password });
            const { data } = response;
            if (data.status) {
                displayToast("success", "Đăng nhập thành công");
                let token = data.token;
                localStorage.setItem(CREDENTIALS.TOKEN_NAME, token);
                dispatch({
                    type: GLOBAL_TYPES.AUTH,
                    payload: { isAuthenticated: true, isAdmin: false, user: data.user },
                });
                router.push('/');
            } else {
                displayToast("error", data.message);
            }
        } catch (err) {
            console.log(err);
            displayToast("error", "Server Internal Error");
        }
    };
};


export const userChangePassword = ({password}) => {
    return async (dispatch, getState) => {
        try {
            let response = await postMethod("change-pass", { password });
            const { data } = response;
            if (data.status) {
                displayToast("success", "Đổi mật khẩu thành công");
            } else {
                displayToast("error", data.message);
            }
        } catch (err) {
            console.log(err);
            displayToast("error", "Server Internal Error");
        }
    };
}
