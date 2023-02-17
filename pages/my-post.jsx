import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BiTrashAlt } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { useDispatch } from "react-redux";
import Modal from "~/components/Modal/Modal";
import Skeleton from "~/components/Skeleton/Skeleton";
import { deletePost } from "~/redux/actions/postActions";
import { getMethod } from "~/utils/fetchData";

export default function MyPost() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [posts, setPosts] = React.useState([]);
  const postSelectedId = React.useRef(null);
  const [isShowDeleteModal, setIsShowDeleteModal] = React.useState(false);
  const toggleDeleteModal = () => setIsShowDeleteModal(!isShowDeleteModal);
  const dispatch = useDispatch();
  const handleDeletePost = () => {
    let post_id = postSelectedId.current;
    if(!post_id) return;
    dispatch(deletePost({post_id}))
    toggleDeleteModal();
    fetchDataPost();
  }
  const confirmDelete = (post_id) => {
    postSelectedId.current = post_id;
    toggleDeleteModal();
  }
  const fetchDataPost = () => {
    getMethod("post/my-post")
    .then(res => {
      const { data } = res;
      if(data.status) {
        setPosts(data.posts)
        console.log(data.posts)
      }
      setIsLoading(false)
    })
    .catch(err => {
      console.log(err)
    })
  }
  useEffect(()=> {
    fetchDataPost();
  }, [])
return (
    <div className="managePage">
      <Head>
        <title>Bài viết của tôi</title>
      </Head>
    <h2 className="managePage__heading" >Bài viết của tôi</h2>
    <Modal title="Xóa bài viết" isShow={isShowDeleteModal} handleCloseModal={toggleDeleteModal} danger={true} handleSubmit={handleDeletePost} size="sm">
      <p>Bạn có chắc chắn muốn xóa bài viết này?</p>
    </Modal>
    <div className="managePage__content">
        <div className="table__wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tiêu đề</th>
                  <th>Ảnh bìa</th>
                  <th>Ngày viết</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && posts.length > 0 && posts.map((post, _) => 
                  <tr key={post._id}>
                    <td>{_ + 1}</td>
                    <td>
                      <Link href={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </td>
                    <td>
                      <div className="thumbnail thumbnail__sm">
                        <img src={post?.thumbnail || "/default.png"} alt="" />
                      </div>
                    </td>
                    <td>{moment(post.createdAt).format("LLL")}</td>
                    <td>
                      {post.status == "publish" ? <span className="status status--public">Công khai</span> :
                        <span className="status status--draf">Bản nháp</span>}
                    </td>
                    <td>
                      <div className="table__actions">
                        <div className="table__actionsItem edit" data-tip="Sửa bài viết">
                          <Link href={`/post/edit/${post.slug}`}>
                            <span className="table__action--ico"><FiEdit></FiEdit></span>
                          </Link>
                        </div>
                        <div className="table__actionsItem delete" data-tip="Xoá bài viết" onClick={()=>confirmDelete(post._id)}>
                          <span className="table__action--ico"><BiTrashAlt></BiTrashAlt></span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading && posts.length === 0 && <tr><td colSpan={6}>Không có bài viết nào</td></tr>}
                {isLoading && new Array(8).fill(null).map((_, index) => {
                  return <tr key={index}><td colSpan={6}><Skeleton width="100%" height="50px" marginBottom="3px"></Skeleton></td></tr>
                })}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
