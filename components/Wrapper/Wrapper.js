import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {  useDispatch, useSelector } from "react-redux";
import { fetchDataUser } from "~/redux/actions/authActions";
import { fetchPostData } from "~/redux/actions/postActions";
import { fetchQuestionData } from "~/redux/actions/questionAction";
import { startSocket } from "~/redux/actions/socketAction";
import displayToast from "~/utils/displayToast";
function getPath() {
    return window.location.pathname;
}
function Wrapper({children, socket}) {
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [firstTimes , setFirstTimes] = useState(true);
    useEffect(()=> {
        dispatch(fetchDataUser());
        dispatch(fetchPostData());
        dispatch(fetchQuestionData());
    }, [])
    useEffect(()=> {
        if(auth.user) {
            if(Object.keys(auth?.user).length > 0 && firstTimes) {
                dispatch(startSocket(socket))
                socket.emit("user-login", auth.user)
                setFirstTimes(false)
                socket.on("new-message", ({chat, thread}) => {
                    let currentPath = getPath()
                    if(!currentPath.startsWith("/chat")) {
                        let sender = chat.sender.fullname
                        displayToast("info", "Bạn có tin nhắn mới từ " + sender)
                    }
                })
            }
        }
    }, [auth])
    return (
        <>
            {children}
        </>
    )
}

export default Wrapper;