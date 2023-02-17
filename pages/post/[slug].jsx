
import moment from 'moment';
import { FacebookShareButton } from 'next-share';
import Head from 'next/head';
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import HTMLtoReact  from 'html-to-react';
import { BiDownvote, BiShareAlt, BiUpvote } from "react-icons/bi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { RiMessage3Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import Modal from "~/components/Modal/Modal";
import PostCommentBlock from "~/components/PostCommentBlock/PostCommentBlock";
import RelatedPost from "~/components/RelatedPost/RelatedPost";
import UserItem from "~/components/UserItem/UserItem";
import ZoomImage from "~/components/ZoomImage/ZoomImage";
import Header from '~/layouts/components/Header/Header';
import { addPostToStore, bookmarkPost, commentPost, votePost } from "~/redux/actions/postActions";
import displayToast from "~/utils/displayToast";
import { getMethod } from "~/utils/fetchData";
import Prism from "prismjs";
export default function PostDetail() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [post, setPost] = React.useState(null);
  const [isShowModalAddComment, setIsShowModalAddComment] = React.useState(false);
  const inputAddCommentRef = React.useRef(null);
  const posts = useSelector((state) => state.posts);
  const auth = useSelector((state) => state.auth);
  const [isBookmark, setIsBookmark] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { slug } = router.query;
  const replyidRef = React.useRef(null); 
  const vote = (type) => {
    dispatch(votePost({ type, post_id: post._id }));
  }
  useEffect(() => {
    Prism.highlightAll();
  });
  useEffect(()=>{
    let postState = posts.data.find((p) => p.slug == slug);
    if(!postState) {
      postState = posts.dataTemp.find((p) => p.slug == slug);
    }
    console.log("postState", postState)
    if(postState){
      console.log("update post")
      setPost(postState);
      setIsLoaded(true);
    }else {
      console.log("update 2")
      if(slug && !post){
        getMethod("post/" + slug).then((res) => {
          const { data } = res;
          if(data.status){
            setPost(data.post);
            console.log("data.post", data.post)
            // dispatch(addPostToStore(data.post))
            setIsLoaded(true);
          }else {
            router.push("/");
          }
        });
      }
    }
  },[posts, slug])
  
  useEffect(()=>{
    let isBookmarkPost = false;
    if(auth.user && auth.isAuthenticated && post && auth.user.bookmarks){
      isBookmarkPost = auth.user.bookmarks.find((b) => b.post?._id === post?._id);
    }
    setIsBookmark(isBookmarkPost);
  }, [post, auth])

  const toggleModalAddComment = () => setIsShowModalAddComment(!isShowModalAddComment);
  const showModalAddComment = () => {
    toggleModalAddComment()
    inputAddCommentRef.current.focus();
  }
  const addComment = () => {
    let val = inputAddCommentRef.current.value.trim();
    if(!val){
      displayToast("warning", "Vui lòng nhập nội dung bình luận");
      return;
    }
    dispatch(commentPost({ content: val, post_id: post._id , reply_id: replyidRef.current}));
    toggleModalAddComment();
    inputAddCommentRef.current.value = "";
  }
  
  const handleSavePost = () => {
    if(!auth.user || !auth.isAuthenticated){
      displayToast("warning", "Vui lòng đăng nhập để lưu bài viết");
      return;
    }
    dispatch(bookmarkPost({ post_id: post._id }));
    // setIsBookmark(!isBookmark);
  }
  
  return (
    <div className="container">
      <Head>
        <title>{post?.title || "Bài viết"}</title>
      </Head>
      <Modal isShow={isShowModalAddComment} size="sm" title="Bình luận bài viết" handleCloseModal={toggleModalAddComment} handleSubmit={addComment}>
        <div className="input__wrapper">
          <label htmlFor="" className="input__label">Nhập nội dung bình luận</label>
          <textarea name="" id="" rows="5" placeholder="Nội dung bình luận...." ref={inputAddCommentRef}></textarea>
        </div>
      </Modal>

      {!isLoaded && <div className="loading">Đang tải nội dung bài viết . . .</div>}
      {isLoaded && 
        <div className="post-detail">
          {/* <div className="post-detail__thumbail">
            <ZoomImage>
              <img src={post.thumbnail || "/default.png"} alt="Post thumbnail" />
            </ZoomImage>
          </div> */}
          {/* <div className="post-detail__dot">
            <span><BiDotsVerticalRounded></BiDotsVerticalRounded></span>
          </div> */}
          <h1 className="post-detail__title">{post.title}</h1>
          <div className="post-detail__info">
            <span className="post-detail__info--author">
              <UserItem user={post.author}></UserItem>
            </span>
            <time className="post-detail__info--date">{moment(post?.createdAt).startOf("hour").fromNow()}</time>
          </div>
          <div className="post-detail__info--tags">
            <ul className="tag-list">
              {post?.tags.length > 0 && post?.tags?.map((tag) => (
                <li className="tag-item" key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
          <p className="post-detail__tldr">
            <span>Tóm tắt: </span>{post?.tldr || "Bài viết không có tóm tắt"}
          </p>
          <ZoomImage>
            <div className="post-detail__content mce-content-body">
              {new HTMLtoReact.Parser().parse(post?.content)}
            </div>
          </ZoomImage>
          <div className="post-detail__reactInfo">
            <span>{post.votes.reduce((total, item)=>{
                  if(item.type == "upvote") return total + 1
                  return total
                }, 0)} UpVote </span>
            <span>{post.votes.reduce((total, item)=>{
                  if(item.type == "downvote") return total + 1
                  return total
                }, 0)} Downvote</span>
            <span>{post.comments.length} Bình luận</span>
          </div>
          <ul className="post-detail__actions">
            <li className={`post-detail__action ${post.votes.filter(i => i.user == auth?.user?._id && i.type=="upvote").length > 0 ? "is-active" : ""}`}>
              <div className="post-detail__action--wrapper" data-tip="Upvote" onClick={()=>vote("upvote")}>
                <span className="post-detail__action--ico">
                  <BiUpvote></BiUpvote>
                </span>
                <span className="post-detail__action--text">Upvote</span>
              </div>
            </li>
            <li className={`post-detail__action ${post.votes.filter(i => i.user == auth?.user?._id && i.type=="downvote").length > 0 ? "is-active" : ""}`}>
              <div className="post-detail__action--wrapper" data-tip="Downvote"  onClick={()=>vote("downvote")}>
                <span className="post-detail__action--ico">
                  <BiDownvote></BiDownvote>
                </span>
                <span className="post-detail__action--text">Downvote</span>
              </div>
            </li>
            <li className="post-detail__action" onClick={showModalAddComment}>
              <div
                className="post-detail__action--wrapper"
                data-tip="Bình luận bài viết"
              >
                <span className="post-detail__action--ico">
                  <RiMessage3Line></RiMessage3Line>
                </span>
                <span className="post-detail__action--text">Bình luận</span>
              </div>
            </li>
            <li className="post-detail__action flex-2">
              <FacebookShareButton 
                // url={"http://localhost:3000/post" + post.slug}
                hashtag="#tdtu"
                url={`${window.location.origin}/post/${post.slug}`}
                >
                <div className="post-detail__action--wrapper" data-tip="Chia sẻ lên facebook" >
                  <span className="post-detail__action--ico">
                    <BiShareAlt></BiShareAlt>
                  </span>
                  <span className="post-detail__action--text">Chia sẻ lên facebook</span>
                </div>
              </FacebookShareButton>
            </li>
            <li className={`post-detail__action ${isBookmark ? "is-save" : ""}`}>
              <div className="post-detail__action--wrapper" data-tip="Lưu bài viết" onClick={handleSavePost}>
                <span className="post-detail__action--ico">
                  {isBookmark ? <BsBookmarkFill></BsBookmarkFill> : <BsBookmark></BsBookmark>}
                  
                </span>
                <span className="post-detail__action--text">{isBookmark ? "Đã lưu" : "Lưu bài viết"}</span>
              </div>
            </li>
          </ul>

          <PostCommentBlock post={post}></PostCommentBlock>

          <div className="post-detail__related">
            <h3>Bài viết liên quan</h3>
            <RelatedPost post={post}></RelatedPost>
          </div>
        </div>
      }
    </div>
  );
}
