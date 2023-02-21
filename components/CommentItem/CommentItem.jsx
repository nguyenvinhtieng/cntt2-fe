import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FiTrash } from 'react-icons/fi'
import { SlFlag } from 'react-icons/sl'
import { useDispatch, useSelector } from 'react-redux'
import useOnClickOutside from '~/hooks/useClickOutside'
import { commentPost, deleteComment, updateComment } from '~/redux/actions/postActions'
import displayToast from '~/utils/displayToast'
import { postMethod } from '~/utils/fetchData'
import Modal from '../Modal/Modal'
import TooltipMenu from '../TooltipMenu/TooltipMenu'
import UserItem from '../UserItem/UserItem'
import { useId } from 'react'

function CommentItem({comment, reply_for}) {
  const auth = useSelector((state) => state.auth);
  const [isShowMenu, setIsShowMenu] = React.useState(false);
  const [isShowModalComment, setIsShowModalComment] = React.useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = React.useState(false)
  const [isShowModalEditComment, setIsShowModalEditComment] = React.useState(false)
  const [isShowModalReport, setIsShowModalReport] = React.useState(false)
  const [isReport, setIsReport] = React.useState(false)
  const router = useRouter()
  const menuRef = useRef()
  const inputReply = useRef()
  const inputEditRef = useRef()
  const contentReportRef = useRef()
  const [menu, setMenu] = React.useState([])
  const dispatch = useDispatch()
  const toggleMenu = () => setIsShowMenu(!isShowMenu);
  const toggleModalComment = () => setIsShowModalComment(!isShowModalComment);
  const toggleModalDeleteComment = () => setIsShowModalDelete(!isShowModalDelete)
  const toggleModalReport = () => setIsShowModalReport(!isShowModalReport)
  const [reason, setReason] = React.useState("")

  const replyComment = () => {
    let val = inputReply.current.value;
    if(!val) {
      displayToast("warning", "Vui lòng nhập nội dung bình luận");
      return;
    }
    dispatch(commentPost({post_id: comment.post_id, content: val, reply_id: reply_for}));
    toggleModalComment();
  }
  const toggleModalEditComment = () => setIsShowModalEditComment(!isShowModalEditComment)
  const clickEditCommentBtn = () => {
    toggleModalEditComment();
    inputEditRef.current.value = comment.content;
  }
  const updateCommentHandler = () => {
    const val = inputEditRef.current.value;
    if(!val) {
      displayToast("warning", "Vui lòng nhập nội dung bình luận");
      return;
    }
    dispatch(updateComment({comment_id: comment._id, content: val}));
    toggleModalEditComment();
  }
  const reportBtnClick = () => {
    toggleModalReport()
    setTimeout(()=>{
      setIsShowMenu(false)
    }, 300)
  }
  const onChangeReason = (e) => {
    setReason(e.target.value)
  }
  const report = async () => {
    if(!reason) {
      displayToast("warning", "Vui lòng chọn lý do báo cáo")
      return;
    }
    // type, report_for, link_to, reason, reason_detail
    const res = await postMethod("report", {
      type: "comment",
      report_for: comment._id,
      post_id: `${comment.post_id}`,
      comment_id: `${comment._id}`,
      reason,
      reason_detail: contentReportRef.current.value
    })

    const {data } = res;
    if(data.status) {
      displayToast("success", data.message)
      toggleModalReport()
    }else {
      displayToast("error", data.message)
    }
    contentReportRef.current.value = ""
    setReason("")
  } 
  const showReplyComment = () => {
    toggleModalComment();
    inputReply.current.focus();
  }
  const reasons = [
    {id: useId(),title: "Nội dung không phù hợp"},
    {id: useId(),title: "Nội dung không đúng với chủ đề"},
    {id: useId(),title: "Từ ngữ không phù hợp"},
    {id: useId(),title: "Spam"},
    {id: useId(),title: "Khác"},
  ]
  
  useEffect(()=> {
    let menuNew = [
      {
        Icon: SlFlag,
        title: "Báo cáo bình luận",
        clickAction: () => reportBtnClick(),
      }
    ];
    if(comment.author?._id === auth?.user?._id || auth?.user?.role === "admin"){
      menuNew = [
        {
          Icon: AiOutlineEdit,
          title: "Sửa bình luận",
          clickAction: () => {
            clickEditCommentBtn();
            inputEditRef.current.focus();
          },
        },
        {
          Icon: FiTrash,
          title: "Xóa bình luận",
          clickAction: ()=> toggleModalDeleteComment(),
        },
        ...menuNew
      ];
    }
    setMenu(menuNew);
  }, [auth, comment])
  
  useOnClickOutside(menuRef, () => setIsShowMenu(false))
  const deleteCommentHandler =() => {
    dispatch(deleteComment({comment_id: comment._id}))
  }
  useEffect(()=> {
    const {query} = router;
    const { comment_id } = query;
    if(comment_id === comment._id) {
      setIsReport(true)
    }
  }, [router])
  return (
    <>
      <li className={`comment-item ${isReport ? "report" : ""}`}>
        <div className="comment-item__head">
          <div className="comment-item__user">
            <UserItem user={comment.author} time={comment?.createdAt}></UserItem>
          </div>
        </div>
        <div className="comment-item__content">{comment.content}</div>
        <div className="comment-item__reply">
          <span className="comment-item__reply--btn" onClick={showReplyComment}>Phản hồi</span>
          <div className={`comment-item__actions ${isShowMenu ? 'is-active' : ""}`} ref={menuRef}>
            <span className="comment-item__options" onClick={toggleMenu}>
              <BsThreeDotsVertical></BsThreeDotsVertical>
            </span>
            <TooltipMenu menu={menu} isShow={isShowMenu}></TooltipMenu>
          </div>
        </div>
      </li>
      <Modal isShow={isShowModalReport} handleCloseModal={toggleModalReport} size="sm" title="Báo cáo bình luận" handleSubmit={report}>
        <label htmlFor="" className='input__label'>Lý do</label>
        {reasons.map((reason, _) => {
          return <div className="input__wrapper input__wrapper--radio" onChange={onChangeReason}>
                  <input name="reason" type="radio" id={reason.id} value={reason.title}/>
                  <label htmlFor={reason.id}>{reason.title}</label>
                </div>
        })}
        
        <div className="input__wrapper">
          <label htmlFor="" className='input__label'>Chi tiết lý do</label>
          <textarea ref={contentReportRef} name="" id="" cols="30" rows="10" placeholder='Nhập chi tiết lý do'></textarea>
        </div>
      </Modal>

      <Modal isShow={isShowModalComment} handleCloseModal={toggleModalComment} size="sm" title="Phản hồi bình luận" handleSubmit={replyComment}>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Nhập nội dung bình luận</label>
          <textarea name="" id="" rows="4" placeholder="Nhập nội dung bình luận của bạn tại đây..." ref={inputReply}></textarea>
        </div>
      </Modal>
      <Modal title="Bạn có chắc muốn xóa bình luận này" handleCloseModal={toggleModalDeleteComment} handleSubmit={deleteCommentHandler} isShow={isShowModalDelete} size="sm" danger={true}>
        <span>Bạn có chắc muốn xóa bình luận này</span>
      </Modal>

      <Modal isShow={isShowModalEditComment} handleCloseModal={toggleModalEditComment} size="sm" title="Sửa nội dung bình luận" handleSubmit={updateCommentHandler}>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Nhập nội dung bình luận...</label>
          <textarea name="" id="" rows="4" placeholder="Nhập nội dung bình luận của bạn tại đây..." ref={inputEditRef}></textarea>
        </div>
      </Modal>
    </>
  )
}

export default CommentItem
