import displayToast from "~/utils/displayToast";
import { postMethod } from "~/utils/fetchData";
import { GLOBAL_TYPES } from "../constants";

export const startSocket = (socket) => {
    return async ( dispatch ) => {
        dispatch({ type: GLOBAL_TYPES.SOCKET, payload: socket });
    }
}