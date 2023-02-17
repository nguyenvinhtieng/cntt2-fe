import displayToast from "~/utils/displayToast";
import { getMethod, postMethod } from "~/utils/fetchData";
import { GLOBAL_TYPES } from "../constants";
export const startFilterPost = ({content}) => {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            if(content) {
                let dataPostsTemp = state?.posts?.data || [];
                let dataPostsTempFilter = dataPostsTemp.filter((item) => 
                    item.content.includes(content) || item.title.includes(content) || item.tags.includes(content) || item.author.fullname.includes(content)
                );
                dispatch({
                    type: GLOBAL_TYPES.POST,
                    payload: {
                        ...state.posts,
                        dataTemp: dataPostsTempFilter,
                    }});
            }else {
                dispatch({
                    type: GLOBAL_TYPES.POST,
                    payload: {
                        ...state.posts,
                        data: state.posts.dataTemp,
                        total: state.posts.totalTemp,
                    }});
            }
        } catch (error) {
            console.log(error);
            displayToast("error", "Lỗi", "Có lỗi xảy ra");
        }
    }
}

export const fetchPostData = () => {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            // let skip = state?.posts?.data?.length || 0;
            const res = await getMethod(`post/get-posts`);
            const { data } = res;
            if(data.status) {
                // let dataPostsOld = state?.posts?.data || [];
                // let dataPostsTempOld = state?.posts?.dataTemp || [];
                // let dataPostsNews = [...dataPostsOld];
                // let dataPostsTempNews = [...dataPostsTempOld];
                // data.posts.forEach((item) => {
                //     // check duplicate post
                //     let isDuplicate = dataPostsNews.find((post) => post._id === item._id);
                //     if(!isDuplicate) {
                //         dataPostsNews.push(item);
                //     }
                //     // checck uplicate temp
                //     let isDuplicateTemp = dataPostsTempNews.find((post) => post._id === item._id);
                //     if(!isDuplicateTemp) {
                //         dataPostsTempNews.push(item);
                //     }

                // });
                dispatch({
                    type: GLOBAL_TYPES.POST,
                    payload: {
                        ...state.posts,
                        data: data.posts,
                        dataTemp: data.posts,
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    };
}

export const createPost = (formData) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({ 
                type: GLOBAL_TYPES.APP_STATE,
                payload: { ...state.appState, loading: true }
            });
            let res = await postMethod("post", formData);
            const { data } = res;
            if (data.status) {
                displayToast("success", data.message);
                dispatch({
                    type: GLOBAL_TYPES.POST,
                    payload: {
                        ...state.posts,
                        data: [data.post, ...state.posts.data]
                    }
                })

            }else {
                displayToast("error", data.message);
            }
            dispatch({ 
                type: GLOBAL_TYPES.APP_STATE,
                payload: { ...state.appState, loading: false }
            });
        } catch (error) {
            console.log(error);
            displayToast("error", error.message);
        }
    };
}
export const updatePost = (formData) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({ 
                type: GLOBAL_TYPES.APP_STATE,
                payload: { ...state.appState, loading: true }
            });
            let res = await postMethod("post/update", formData);
            const { data } = res;
            if (data.status) {
                console.log(data)
                let postNew = state.posts.data.map(item => {
                    if(item._id === data.post._id) {
                        return data.post;
                    }
                    return item;
                })

                dispatch({
                    type: GLOBAL_TYPES.POST,
                    payload: {
                        ...state.posts,
                        data: postNew
                    }
                })
                
                displayToast("success", data.message);
            }else {
                displayToast("error", data.message);
            }
            dispatch({ 
                type: GLOBAL_TYPES.APP_STATE,
                payload: { ...state.appState, loading: false }
            });
        } catch (error) {
            console.log(error);
            displayToast("error", error.message);
        }
    };
}
export const votePost = ({post_id, type}) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            if(type !== "upvote" && type !== "downvote") return;
            const res = await postMethod("post/vote", {post_id, type});
            const { data } = res;
            if(data.status) {
                let newData = state.posts.data.map(item => {
                    if(item._id === post_id) {
                        return {...item, ...data.post}
                    }
                    return item;
                })
                let newDataTemp = state.posts.dataTemp.map(item => {
                    if(item._id === post_id) {
                        return {...item, ...data.post}
                    }
                    return item;
                })

                dispatch({
                    type: GLOBAL_TYPES.POST,
                    payload: {
                        ...state.posts,
                        data: newData,
                        dataTemp: newDataTemp
                    }
                })
            }else {
                displayToast("error", data.message);
            }

        } catch (error) {
            console.log(error);
            displayToast("error", error.message);
        }
    };
}

export const commentPost = ({post_id, content, reply_id}) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            const res = await postMethod("comment", {post_id, content, reply_id});
            const { data } = res;
            if(data.status) {
                let newData = state.posts.data.map(item => {
                    if(item._id === post_id) {
                        return {...item, comments: [...item.comments, data.comment]}
                    }
                    return item;
                })
                let newDataTemp = state.posts.dataTemp.map(item => {
                    if(item._id === post_id) {
                        return {...item, comments: [...item.comments, data.comment]}
                    }
                    return item;
                })
                dispatch({
                    type: GLOBAL_TYPES.POST,
                    payload: {
                        ...state.posts,
                        data: newData,
                        dataTemp: newDataTemp
                    }
                })
                displayToast("success", data.message);
            }else {
                displayToast("error", data.message);
            }

        } catch (error) {
            console.log(error);
            displayToast("error", error.message);
        }
    };
}

export const deleteComment = ({comment_id}) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            // console.log("deleteComment", comment_id);
            const res = await postMethod("comment/delete", {comment_id});
            const { data } = res;
            if(data.status) {
                let newData = []
                state.posts.data.forEach(item => {
                    let newComments = item.comments.filter(i => i._id !== comment_id);
                    let newComments2 = newComments.map(i => {
                        if(i.reply_id === comment_id) {
                            return {...i, reply_id: null}
                        }
                        return i;
                    })
                    newData.push({...item, comments: newComments2})
                })
                let newTempData = []
                state.posts.dataTemp.forEach(item => {
                    let newComments = item.comments.filter(i => i._id !== comment_id);
                    let newComments2 = newComments.map(i => {
                        if(i.reply_id === comment_id) {
                            return {...i, reply_id: null}
                        }
                        return i;
                    })
                    newTempData.push({...item, comments: newComments2})
                })
                dispatch({
                    type: GLOBAL_TYPES.POST,
                    payload: {
                        ...state.posts,
                        data: newData,
                        dataTemp: newTempData
                    }
                })

                displayToast("success", data.message);
            }else {
                displayToast("error", data.message);
            }

        } catch (error) {
            console.log(error);
            displayToast("error", error.message);
        }
    }
}

export const updateComment = ({comment_id, content}) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            const res = await postMethod("comment/update", {comment_id, content});
            const { data } = res;
            if(data.status) {
                let newData = state.posts.data.map(item => {
                    let newComments = item.comments.map(i => {
                        if(i._id === comment_id) {
                            return {...i, content}
                        }
                        return i;
                    })
                    return {...item, comments: newComments}
                })
                let newTempData = state.posts.dataTemp.map(item => {
                    let newComments = item.comments.map(i => {
                        if(i._id === comment_id) {
                            return {...i, content}
                        }
                        return i;
                    })
                    return {...item, comments: newComments}
                })

                dispatch({
                    type: GLOBAL_TYPES.POST,
                    payload: {
                        ...state.posts,
                        data: newData,
                        dataTemp: newTempData
                    }
                })
                displayToast("success", data.message);
            }else {
                displayToast("error", data.message);
            }

        } catch (error) {
            console.log(error);
            displayToast("error", error.message);
        }
    }
}


export const deletePost = ({post_id}) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            const res = await postMethod("post/delete", {post_id});
            const { data } = res;
            if(data.status) {
                let newData = state.posts.data.filter(item => item._id !== post_id);
                dispatch({
                    type: GLOBAL_TYPES.POST,
                    payload: {
                        ...state.posts,
                        data: newData
                    }
                })
                displayToast("success", data.message);
            }else {
                displayToast("error", data.message);
            }

        } catch (error) {
            console.log(error);
            displayToast("error", error.message);
        }
    }
}

export const bookmarkPost = ({post_id}) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            const res = await postMethod("bookmark", {post_id});
            const { data } = res;
            if(data.status) {
                if(data.bookmark) {
                    dispatch({
                        type: GLOBAL_TYPES.AUTH,
                        payload: {
                            ...state.auth,
                            user: {
                                ...state.auth.user,
                                bookmarks: [...state.auth?.user?.bookmarks, data.bookmark]
                            }
                        }
                    })
                }else {
                    let newBookmarkUser = state.auth?.user?.bookmarks.filter(item => item.post._id !== post_id);
                    dispatch({
                        type: GLOBAL_TYPES.AUTH,
                        payload: {
                            ...state.auth,
                            user: {
                                ...state.auth.user,
                                bookmarks: newBookmarkUser
                            }
                        }
                    })
                }
            }else {
                displayToast("error", data.message);
            }

        } catch (error) {
            console.log(error);
            displayToast("error", error.message);
        }
    }
}

export const addPostToStore = (post) => {
    return async (dispatch, getState) => {
        const state = getState();
        // check post have in store
        let check = state.posts.data.find(item => item._id === post._id);
        if(check) return;
        dispatch({
            type: GLOBAL_TYPES.POST,
            payload: {
                ...state.posts,
                data: [...state.posts.data, post]
            }
        })
    }
}