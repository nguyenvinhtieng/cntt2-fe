import displayToast from "~/utils/displayToast";
import { getMethod, postMethod } from "~/utils/fetchData";
import { GLOBAL_TYPES } from "../constants";

export const fetchQuestionData = () => {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            // let skip = state?.questions?.data?.length || 0;
            const res = await getMethod("question");
            const { data } = res;
            if(data.status) {
                // let questionOld = state.questions?.data || [];
                // let questionNew = data.questions;
                // let questionSet = [...questionOld, ...questionNew];
                // remove the same _id in questionSet
                // questionSet = questionSet.filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i);
                dispatch({
                    type: GLOBAL_TYPES.QUESTION,
                    payload: {
                        ...state.questions,
                        data: data.questions,
                        dataTemp: data.questions
                    }
                })
            }else {
                displayToast("error", data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
}

export const createQuestion = (formData, router) => {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            dispatch({
                type: GLOBAL_TYPES.APP_STATE,
                payload: { ...state.appState, loading: true }
            })
            let res = await postMethod(`question`, formData);
            const { data } = res;
            if(data.status) {
                displayToast("success", data.message);
                dispatch({
                    type: GLOBAL_TYPES.QUESTION,
                    payload: {
                        ...state.questions,
                        data: [data.question, ...state.questions.data]
                    }
                })
                router.push('/my-question')
            }
            dispatch({
                type: GLOBAL_TYPES.APP_STATE,
                payload: { ...state.appState, loading: false }
            })
        } catch (error) {
            console.log(error);
        }
    };
}
export const updateQuestion = (formData, router) => {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            dispatch({
                type: GLOBAL_TYPES.APP_STATE,
                payload: { ...state.appState, loading: true }
            })
            let res = await postMethod(`question/update`, formData);
            const { data } = res;
            if(data.status) {
                displayToast("success", data.message);
                dispatch({
                    type: GLOBAL_TYPES.QUESTION,
                    payload: {
                        ...state.questions,
                        data: state.questions.data.map(question => {
                            if(question._id === data.question._id) {
                                return data.question
                            }
                            return question
                        })
                    }
                })
                router.push('/my-question')
            }
            dispatch({
                type: GLOBAL_TYPES.APP_STATE,
                payload: { ...state.appState, loading: false }
            })
        } catch (error) {
            console.log(error);
        }
    };
}

export const deleteQuestion = ({question_id}) => {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            const res = await postMethod(`question/delete`, {question_id});
            const { data } = res;
            if(data.status) {
                displayToast("success", data.message);
                dispatch({
                    type: GLOBAL_TYPES.QUESTION,
                    payload: {
                        ...state.questions,
                        data: state.questions.data.filter(question => question._id !== question_id)
                    }
                })
            }
        }catch(error) {
            console.log(error);
        }
    }
}

export const addAnswer = ({question_id, content, reply_id}) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            let res = await postMethod(`answer`, {question_id, content, reply_id});
            const { data } = res;
            if(data.status) {
                displayToast("success", data.message);
                let newQuestion = state.questions.data.map(question => {
                    if(question._id === question_id) {
                        question.answers = [data.answer, ...question.answers];
                    }
                    return question;
                });
                dispatch({
                    type: GLOBAL_TYPES.QUESTION,
                    payload: {
                        ...state.questions,
                        data: newQuestion
                    }
                })
            }else {
                displayToast("error", data.message);
            }
            
        } catch (error) {
            console.log(error);
        }
    }
}

export const editAnswer = ({question_id, answer_id, content}) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            const res = await postMethod(`answer/edit`, {answer_id, content});
            const { data } = res;
            if(data.status) {
                displayToast("success", data.message);
                let newQuestion = state.questions.data.map(question => {
                    if(question._id === question_id) {
                        question.answers = question.answers.map(answer => {
                            if(answer._id === answer_id) {
                                answer.content = content;
                            }
                            return answer;
                        })
                    }
                    return question;
                });
                dispatch({
                    type: GLOBAL_TYPES.QUESTION,
                    payload: {
                        ...state.questions,
                        data: newQuestion
                    }
                })
            }
        }catch(error) {
            console.log(error);
        }
    }
}

export const deleteAnswer = ({question_id, answer_id}) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            const res = await postMethod(`answer/delete`, {answer_id});
            const { data } = res;
            if(data.status) {
                displayToast("success", data.message);
                let newQuestion = state.questions.data.map(question => {
                    if(question._id === question_id) {
                        question.answers = question.answers.filter(answer => answer._id !== answer_id);
                        question.answers = question.answers.map(answer => {
                            if(answer.reply_id === answer_id) {
                                answer.reply_id = null;
                            }
                            return answer;
                        })
                    }
                    return question;
                });
                dispatch({
                    type: GLOBAL_TYPES.QUESTION,
                    payload: {
                        ...state.questions,
                        data: newQuestion
                    }
                })
            }
        }catch(error) {
            console.log(error);
        }
    }
}

export const changeStatusAnswer = ({question_id, answer_id, status}) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            const res = await postMethod(`answer/change-status`, {answer_id, status});
            const { data } = res;
            if(data.status) {
                // displayToast("success", data.message);
                let newQuestion = state.questions.data.map(question => {
                    if(question._id === question_id) {
                        question.answers = question.answers.map(answer => {
                            if(answer._id === answer_id) {
                                answer.status = status;
                            }
                            return answer;
                        })
                    }
                    return question;
                });
                dispatch({
                    type: GLOBAL_TYPES.QUESTION,
                    payload: {
                        ...state.questions,
                        data: newQuestion
                    }
                })
            }
        }catch(error) {
            console.log(error);
        }
    }
}

export const voteAnswer = ({answer_id, vote_type}) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            const res = await postMethod(`answer/vote`, {answer_id, vote_type});
            const { data } = res;
            if(data.status) {
                let newQuestion = state.questions.data.map(question => {
                    question.answers = question.answers.map(answer => {
                        if(answer._id === answer_id) {
                            answer = data.answer;
                        }
                        return answer;
                    })
                    return question;
                });
                dispatch({
                    type: GLOBAL_TYPES.QUESTION,
                    payload: {
                        ...state.questions,
                        data: newQuestion
                    }
                })
            }else {
                displayToast("error", data.message);
            }
        }catch(error) {
            console.log(error);
        }
    }
}
