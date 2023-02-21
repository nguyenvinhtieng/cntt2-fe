import moment from 'moment';
import { FacebookShareButton } from 'next-share';
import Link from "next/link";
import React, { useRef } from "react";
import { useId } from 'react';
import { BiDotsVerticalRounded, BiDownvote, BiUpvote } from "react-icons/bi";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiFacebook, FiShare2 } from "react-icons/fi";
import { RiMessage3Line } from "react-icons/ri";
import { RxCopy } from "react-icons/rx";
import { SlFlag } from "react-icons/sl";
import useOnClickOutside from "~/hooks/useClickOutside";
import displayToast from "~/utils/displayToast";
import { postMethod } from "~/utils/fetchData";
import Modal from "../Modal/Modal";
import TooltipMenu from "../TooltipMenu/TooltipMenu";
import UserItem from "../UserItem/UserItem";

export default function PostItem({post}) {
  const [isShowMenu, setIsShowMenu] = React.useState(false);
  const [isShowModalReport, setIsShowModalReport] = React.useState(false)
  const menuRef = React.useRef(null);
  useOnClickOutside(menuRef, () => setIsShowMenu(false));
  const toggleMenu = () => setIsShowMenu(!isShowMenu);
  const toggleModalReport = () => setIsShowModalReport(!isShowModalReport)
  const contentReportRef = useRef()
  const [reason, setReason] = React.useState("")

  const report = async () => {
    if(!reason) {
      displayToast("warning", "Vui lòng chọn lý do báo cáo")
      return;
    }
    const res = await postMethod("report", {
      type: "post",
      report_for: post._id,
      post_id: `${post._id}`,
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
  const onChangeReason = (e) => {
    setReason(e.target.value)
  }
  const menu = [
    {
      Icon: FiFacebook,
      title: "Chia sẻ bài viết lên facebook",
      clickAction: () => {},
      Wrapper: FacebookShareButton,
      wrapperProps: {url: `${window.location.origin}/post/${post?.slug}`},
    },
    {
      Icon: RxCopy,
      title: "Copy liên kết chia sẻ",
      clickAction: () => copyLink(),
    },
    {
      Icon: SlFlag,
      title: "Baó cáo bài viết",
      clickAction: () => toggleModalReport(),
    },
  ];
  const reasons = [
    {id: useId(), title: "Nội dung không phù hợp"},
    {id: useId(), title: "Nội dung không đúng với chủ đề"},
    {id: useId(), title: "Từ ngữ không phù hợp"},
    {id: useId(), title: "Spam"},
    {id: useId(), title: "Khác"},
  ]
  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post?.slug}`);
    setIsShowMenu(false);
    displayToast("success", "Đã sao chép liên kết");
  }
  return (
    <div className="post-item">
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
      <div className="post-item__wrapper">
        <div className="post-item__head">
          <div className="post-item__user">
            <UserItem user={post.author} time={post.createdAt}></UserItem>
          </div>
          {/* <div className="post-item__link">
            <Link href={`/post/${post.slug || ""}`}>
              <span className="post-item__link--ttl">Đọc bài viết</span>
              <span className="post-item__link--ico">
                <FaExternalLinkAlt></FaExternalLinkAlt>
              </span>
            </Link>
          </div> */}
          <div
            className={`post-item__menu ${isShowMenu ? "is-active" : ""}`}
            ref={menuRef}
          >
            <span className="post-item__menu--ico" onClick={toggleMenu}>
              <BiDotsVerticalRounded></BiDotsVerticalRounded>
            </span>
            <TooltipMenu isShow={isShowMenu} menu={menu}></TooltipMenu>
          </div>
        </div>
        <Link href={`/post/${post?.slug || ""}`}>
          <span>
          <div className="post-item__content">
            <p className="post-item__ttl">{post?.title}</p>
            <div className="post-item__info">
              <time>{moment(post?.createdAt).locale("vi").startOf('hour').fromNow()}</time> <span> • </span>
              <span>{Math.floor(post?.content.length / 500) + 1} phút đọc</span>
            </div>
            <div className="post-item__img">
              <img src={post?.thumbnail || "/default.png"} alt="" />
            </div>
          </div>
          <div className="post-item__actions">
            <div className="post-item__actions--item" data-tip="Upvote">
              <span className="ico">
                <BiUpvote></BiUpvote>
              </span>
              <span className="num">
                {post.votes.reduce((total, item)=>{
                  if(item.type == "upvote") return total + 1
                  return total
                }, 0)}
              </span>
            </div>
            <div className="post-item__actions--item" data-tip="Downvote">
              <span className="ico">
                <BiDownvote></BiDownvote>
              </span>
              <span className="num">
                {post.votes.reduce((total, item)=>{
                  if(item.type == "downvote") return total + 1
                  return total
                }, 0)}
              </span>
            </div>
            <div className="post-item__actions--item" data-tip="Bình luận">
              <span className="ico">
                <RiMessage3Line></RiMessage3Line>
              </span>
              <span className="num">{post.comments.length}</span>
            </div>
            <div className="post-item__actions--item" data-tip="Chia sẻ bài viết lên facebook">
              <span className="ico">
                <FiShare2></FiShare2>
              </span>
            </div>
          </div>
          </span>
        </Link>
      </div>
    </div>
  );
}
