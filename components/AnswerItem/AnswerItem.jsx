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
                    title: 'Chỉnh sửa câu trả lời',
                    clickAction: () => toggleModalEdit()
                },
                {
                    Icon: MdDeleteOutline,
                    title: 'Xóa câu trả lời',
                    clickAction: () => toggleModalDelete()
                },
            ]
        }
        if(author_question_id == auth?.user?._id) {
        
            if(answer.status === 'accepted') {
                menuNew = [
                    {
                        Icon: FaTimes,
                        title: 'Bỏ xác nhận câu trả lời',
                        clickAction: () => {
                            answerStatusRef.current = ''
                            toggleModalDeleteAccept();
                        }
                    },{
                        Icon: FaTimes,
                        title: 'Từ chối câu trả lời',
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
                        title: 'Xác nhận câu trả lời',
                        clickAction: () => {
                            answerStatusRef.current = 'accepted'
                            toggleModalAcceptAnswer();
                        }
                    },{
                        Icon: FaTimes,
                        title: 'Bỏ từ chối câu trả lời',
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
                        title: 'Xác nhận câu trả lời',
                        clickAction: () => {
                            answerStatusRef.current = 'accepted'
                            toggleModalAcceptAnswer();
                        }
                    },
                    {
                        Icon: FaTimes,
                        title: 'Từ chối câu trả lời',
                        clickAction: () => {
                            answerStatusRef.current = 'rejected'
                            toggleModalRejectAnswer();
                        }
                    },
                    ...menuNew
                ]
                menuNew = menuNew.filter(item => item.title !== 'Bỏ xác nhận câu trả lời' || item.title !== 'Bỏ từ chối câu trả lời')
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
            <Modal title="Bỏ xác nhận câu trả lời" size="sm" isShow={isShowModalDeleteAccept} handleCloseModal={toggleModalDeleteAccept} handleSubmit={handleChangeStatusAnswer} danger={true}>
                Bạn có chắc muốn bỏ xác nhận câu hỏi này?
            </Modal>
        }
        {/* Delete Reject */}
        {isShowModalDeleteReject &&
            <Modal title="Bỏ từ chối câu trả lời" size="sm" isShow={isShowModalDeleteReject} handleCloseModal={toggleModalDeleteReject} handleSubmit={handleChangeStatusAnswer} danger={true}>
                Bạn có chắc muốn bỏ từ chối câu hỏi này?
            </Modal>
        }
        {/* Accept */}
        {isShowModalAcceptAnswer && 
            <Modal title="Xác nhận câu trả lời" size="sm" isShow={isShowModalAcceptAnswer} handleCloseModal={toggleModalAcceptAnswer} handleSubmit={handleChangeStatusAnswer}>
                Bạn có chắc muốn xác nhận câu trả lời này?
            </Modal>
        }
        {/* Reject */}
        {isShowModalRejectAnswer && 
            <Modal title="Từ chối câu trả lời" size="sm" isShow={isShowModalRejectAnswer} handleCloseModal={toggleModalRejectAnswer} handleSubmit={handleChangeStatusAnswer} danger={true}>
                Bạn có chắc muốn từ chối câu trả lời này?
            </Modal>
        }
        {/* Delete */}
        {isShowModalDelete && 
        <Modal title="Xóa câu trả lời" size="sm" isShow={isShowModalDelete} handleCloseModal={toggleModalDelete} handleSubmit={handleDeleteAnswer} danger={true}>
            Bạn có chắc muốn xóa câu trả lời này?
        </Modal>
        }
        {/* Edit */}
        {isShowModalEdit && <Modal size="md" title="Chỉnh sửa câu trả lời" isShow={isShowModalEdit} handleCloseModal={toggleModalEdit} handleSubmit={handleSubmitEdit}>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Nhập nội dung phản hồi</label>
                <Editer initialVal={answer.content} onChangeFunc={handleChangeEditContent}></Editer>
            </div>
        </Modal>}
        {/* Reply */}
        {isShowModalReply && <Modal size="md" title="Phản hồi câu trả lời" isShow={isShowModalReply} handleCloseModal={toggleModalReply} handleSubmit={handleSubmitReply}>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Nhập nội dung phản hồi</label>
                <Editer onChangeFunc={handleChangeReplyContent}></Editer>
            </div>
        </Modal>}
        <div className="answer__user">
            <UserItem  UserItem user={answer?.author} time={answer?.createdAt}></UserItem>
        </div>
        <div className="answer__content--wrapper">
            {answer?.status == "accepted" && <span className='answer__confirm' data-tip="Câu trả lời được xác minh"><BsFillBookmarkStarFill></BsFillBookmarkStarFill></span>}
            {answer?.status == "rejected" && <span className='answer__reject' data-tip="Câu trả lời bị từ chối"><BsBookmarkXFill></BsBookmarkXFill></span>}
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
                <span className='answer__actionItem--ttl'>Phản hồi</span>
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
