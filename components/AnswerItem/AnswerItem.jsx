import React, { useEffect } from 'react'
import { BiDotsVerticalRounded, BiDownvote, BiUpvote } from 'react-icons/bi'
import Prism from "prismjs";
import { BsBookmarkXFill, BsFillBookmarkStarFill, BsReplyAll } from 'react-icons/bs'
import { FaTimes } from 'react-icons/fa'
import { FiEdit2 } from 'react-icons/fi'
import { MdDeleteOutline } from 'react-icons/md'
import { TiTick } from 'react-icons/ti'
import { useDispatch, useSelector } from 'react-redux'
import useOnClickOutside from '~/hooks/useClickOutside'
import { addAnswer, changeStatusAnswer, deleteAnswer, editAnswer, voteAnswer } from '~/redux/actions/questionAction'
import Editer from '../Editer/Editer'
import Modal from '../Modal/Modal'
import TooltipMenu from '../TooltipMenu/TooltipMenu'
import UserItem from '../UserItem/UserItem'
import ZoomImage from '../ZoomImage/ZoomImage'

export default function AnswerItem({answer, reply_id, author_question_id}) {
    const [isShowMenu, setIsShowMenu] = React.useState(false)
    const [menu, setMenu] = React.useState([])
    const [isShowModalReply, setIsShowModalReply] = React.useState(false)
    const [isShowModalEdit, setIsShowModalEdit] = React.useState(false)
    const [isShowModalDelete, setIsShowModalDelete] = React.useState(false)
    const [isShowModalAcceptAnswer, setIsShowModalAcceptAnswer] = React.useState(false)
    const [isShowModalRejectAnswer, setIsShowModalRejectAnswer] = React.useState(false)
    const [isShowModalDeleteAccept, setIsShowModalDeleteAccept] = React.useState(false)
    const [isShowModalDeleteReject, setIsShowModalDeleteReject] = React.useState(false)

    const answerStatusRef = React.useRef(null)
    const [replyContent, setReplyContent] = React.useState('')
    const [editContent, setEditContent] = React.useState(answer.content)
    const toggleModalReply = () => setIsShowModalReply(!isShowModalReply) 
    const toggleModalEdit = () => setIsShowModalEdit(!isShowModalEdit)
    const toggleModalDelete = () => setIsShowModalDelete(!isShowModalDelete)
    const toggleModalAcceptAnswer = () => setIsShowModalAcceptAnswer(!isShowModalAcceptAnswer)
    const toggleModalRejectAnswer = () => setIsShowModalRejectAnswer(!isShowModalRejectAnswer)
    const toggleModalDeleteAccept = () => setIsShowModalDeleteAccept(!isShowModalDeleteAccept)
    const toggleModalDeleteReject = () => setIsShowModalDeleteReject(!isShowModalDeleteReject)

    const menuRef = React.useRef(null)
    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const toggleShowMenu = () => {
        setIsShowMenu(!isShowMenu)
    }
    const handleChangeReplyContent = (val) => {
        setReplyContent(val)
    }
    const handleSubmitReply = () => {
        dispatch(addAnswer({question_id: answer.question_id, content: replyContent, reply_id}))
        toggleModalReply()
        setReplyContent('')
    }
    useOnClickOutside(menuRef, ()=> setIsShowMenu(false))
    useEffect(() => {
        Prism.highlightAll();
      });
    useEffect(()=> {
        let menuNew = []
        if(auth?.user?._id == answer.author._id || auth?.user?.role == "admin") {
            menuNew = [
                {
                    Icon: FiEdit2,
                    title: 'Ch???nh s???a c??u tr??? l???i',
                    clickAction: () => toggleModalEdit()
                },
                {
                    Icon: MdDeleteOutline,
                    title: 'X??a c??u tr??? l???i',
                    clickAction: () => toggleModalDelete()
                },
            ]
        }
        if(author_question_id == auth?.user?._id) {
        
            if(answer.status === 'accepted') {
                menuNew = [
                    {
                        Icon: FaTimes,
                        title: 'B??? x??c nh???n c??u tr??? l???i',
                        clickAction: () => {
                            answerStatusRef.current = ''
                            toggleModalDeleteAccept();
                        }
                    },{
                        Icon: FaTimes,
                        title: 'T??? ch???i c??u tr??? l???i',
                        clickAction: () => {
                            answerStatusRef.current = 'rejected'
                            toggleModalRejectAnswer();
                        }
                    },
                    ...menuNew]
            }
            if(answer.status === 'rejected') {
                menuNew = [
                    {
                        Icon: TiTick,
                        title: 'X??c nh???n c??u tr??? l???i',
                        clickAction: () => {
                            answerStatusRef.current = 'accepted'
                            toggleModalAcceptAnswer();
                        }
                    },{
                        Icon: FaTimes,
                        title: 'B??? t??? ch???i c??u tr??? l???i',
                        clickAction: () => {
                            answerStatusRef.current = ''
                            toggleModalDeleteReject();
                        }
                    },
                    ...menuNew
                ]
            }
            if(answer.status === "") {
                menuNew = [
                    {
                        Icon: TiTick,
                        title: 'X??c nh???n c??u tr??? l???i',
                        clickAction: () => {
                            answerStatusRef.current = 'accepted'
                            toggleModalAcceptAnswer();
                        }
                    },
                    {
                        Icon: FaTimes,
                        title: 'T??? ch???i c??u tr??? l???i',
                        clickAction: () => {
                            answerStatusRef.current = 'rejected'
                            toggleModalRejectAnswer();
                        }
                    },
                    ...menuNew
                ]
                menuNew = menuNew.filter(item => item.title !== 'B??? x??c nh???n c??u tr??? l???i' || item.title !== 'B??? t??? ch???i c??u tr??? l???i')
            }
        }
        setMenu(menuNew)
    }, [answer, auth])

    const handleSubmitEdit = () => {
        dispatch(editAnswer({question_id: answer.question_id, content: editContent, answer_id: answer._id}))
        toggleModalEdit()
    }
    const handleChangeEditContent = (val) => {
        setEditContent(val);
    }
    const handleDeleteAnswer = () => {
        dispatch(deleteAnswer({question_id: answer.question_id, answer_id: answer._id}))
        toggleModalDelete()
    }
    const handleChangeStatusAnswer = () => {
        dispatch(changeStatusAnswer({question_id: answer.question_id, answer_id: answer._id, status: answerStatusRef.current}))
        setIsShowModalAcceptAnswer(false)
        setIsShowModalRejectAnswer(false)
        setIsShowModalDeleteAccept(false)
        setIsShowModalDeleteReject(false)
    }
    const voteAnswerHandler = (type) => {
        dispatch(voteAnswer({answer_id: answer._id, vote_type: type}))
    }
    
    return (
    <div className="answer__item">
        {/* Delete Accept */}
        {isShowModalDeleteAccept && 
            <Modal title="B??? x??c nh???n c??u tr??? l???i" size="sm" isShow={isShowModalDeleteAccept} handleCloseModal={toggleModalDeleteAccept} handleSubmit={handleChangeStatusAnswer} danger={true}>
                B???n c?? ch???c mu???n b??? x??c nh???n c??u h???i n??y?
            </Modal>
        }
        {/* Delete Reject */}
        {isShowModalDeleteReject &&
            <Modal title="B??? t??? ch???i c??u tr??? l???i" size="sm" isShow={isShowModalDeleteReject} handleCloseModal={toggleModalDeleteReject} handleSubmit={handleChangeStatusAnswer} danger={true}>
                B???n c?? ch???c mu???n b??? t??? ch???i c??u h???i n??y?
            </Modal>
        }
        {/* Accept */}
        {isShowModalAcceptAnswer && 
            <Modal title="X??c nh???n c??u tr??? l???i" size="sm" isShow={isShowModalAcceptAnswer} handleCloseModal={toggleModalAcceptAnswer} handleSubmit={handleChangeStatusAnswer}>
                B???n c?? ch???c mu???n x??c nh???n c??u tr??? l???i n??y?
            </Modal>
        }
        {/* Reject */}
        {isShowModalRejectAnswer && 
            <Modal title="T??? ch???i c??u tr??? l???i" size="sm" isShow={isShowModalRejectAnswer} handleCloseModal={toggleModalRejectAnswer} handleSubmit={handleChangeStatusAnswer} danger={true}>
                B???n c?? ch???c mu???n t??? ch???i c??u tr??? l???i n??y?
            </Modal>
        }
        {/* Delete */}
        {isShowModalDelete && 
        <Modal title="X??a c??u tr??? l???i" size="sm" isShow={isShowModalDelete} handleCloseModal={toggleModalDelete} handleSubmit={handleDeleteAnswer} danger={true}>
            B???n c?? ch???c mu???n x??a c??u tr??? l???i n??y?
        </Modal>
        }
        {/* Edit */}
        {isShowModalEdit && <Modal size="md" title="Ch???nh s???a c??u tr??? l???i" isShow={isShowModalEdit} handleCloseModal={toggleModalEdit} handleSubmit={handleSubmitEdit}>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Nh???p n???i dung ph???n h???i</label>
                <Editer initialVal={answer.content} onChangeFunc={handleChangeEditContent}></Editer>
            </div>
        </Modal>}
        {/* Reply */}
        {isShowModalReply && <Modal size="md" title="Ph???n h???i c??u tr??? l???i" isShow={isShowModalReply} handleCloseModal={toggleModalReply} handleSubmit={handleSubmitReply}>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Nh???p n???i dung ph???n h???i</label>
                <Editer onChangeFunc={handleChangeReplyContent}></Editer>
            </div>
        </Modal>}
        <div className="answer__user">
            <UserItem  UserItem user={answer?.author} time={answer?.createdAt}></UserItem>
        </div>
        <div className="answer__content--wrapper">
            {answer?.status == "accepted" && <span className='answer__confirm' data-tip="C??u tr??? l???i ???????c x??c minh"><BsFillBookmarkStarFill></BsFillBookmarkStarFill></span>}
            {answer?.status == "rejected" && <span className='answer__reject' data-tip="C??u tr??? l???i b??? t??? ch???i"><BsBookmarkXFill></BsBookmarkXFill></span>}
            {/* Insert danger HTML */}
            <ZoomImage>
                <div className="answer__content mce-content-body" dangerouslySetInnerHTML={{__html: answer?.content}}></div>
            </ZoomImage>
        </div>
        <div className="answer__actions">
            <div className={`answer__actionItem ${answer?.votes?.filter(item => item.vote == "upvote" && item.author?._id === auth?.user?._id).length > 0 ? "is-active" : ""} `} onClick={()=>voteAnswerHandler("upvote")}>
                <div className="answer__actionItem--ico" ><BiUpvote></BiUpvote></div>
                <span className='answer__actionItem--ttl'>{
                    answer?.votes?.reduce((total, vote) => {
                        if(vote.vote == "upvote") total += 1
                        return total
                    }, 0)
                } Upvote</span>
            </div>
            <div className={`answer__actionItem ${answer?.votes?.filter(item => item.vote == "downvote" && item.author?._id === auth?.user?._id).length > 0 ? "is-active" : ""} `} onClick={()=>voteAnswerHandler("downvote")}>
                <div className="answer__actionItem--ico"><BiDownvote></BiDownvote></div>
                <span className='answer__actionItem--ttl'>{
                    answer?.votes?.reduce((total, vote) => {
                        if(vote.vote == "downvote") total += 1
                        return total
                    }, 0)
                } Downvote</span>
            </div>
            <div className="answer__actionItem" onClick={toggleModalReply}>
                <div className="answer__actionItem--ico"><BsReplyAll></BsReplyAll></div>
                <span className='answer__actionItem--ttl'>Ph???n h???i</span>
            </div>
            {menu.length > 0 && 
                <div className={`answer__actionItemMenu ${isShowMenu ? "is-active" : ""}`} onClick={toggleShowMenu} ref={menuRef}>
                    <div className="answer__actionItem--ico"><BiDotsVerticalRounded></BiDotsVerticalRounded></div>
                    <TooltipMenu isShow={isShowMenu} menu={menu}></TooltipMenu>
                </div>
            }
        </div>
    </div>
  )
}
