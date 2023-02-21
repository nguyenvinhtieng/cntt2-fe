import moment from "moment";
import React, { useEffect } from "react";
// import DatePicker from 'react-date-picker';
import Link from "next/link";
import { AiOutlineEye, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { BiTrashAlt } from "react-icons/bi";
import { VscSettings } from "react-icons/vsc";
import Modal from "~/components/Modal/Modal";
import Select from "~/components/Select/Select";
import Skeleton from "~/components/Skeleton/Skeleton";
import UserItem from "~/components/UserItem/UserItem";
import { postMethod } from "~/utils/fetchData";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function ManagePost() {
    const [ postsFetch, setPostsFetch ] = React.useState([]);
    const [posts, setPosts] = React.useState([]);
    const [isShowModalConfirmDelete, setIsShowModalConfirmDelete] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPage, setTotalPage] = React.useState(1);
    const [startDate, setStartDate] = React.useState(new Date());
    const [ isLoading, setIsLoading ] = React.useState(false);
    const postIdSelectedRef = React.useRef(null);
    const authorNameRef = React.useRef(null);
    const titleRef = React.useRef(null);
    const fromDateRef = React.useRef(null);
    const toDateRef = React.useRef(null);
    const tagRef = React.useRef(null);
    const statusRef = React.useRef(null);
    const [ isShowFilter, setIsShowFilter ] = React.useState(false);
    const router = useRouter();
    const auth = useSelector(state => state.auth);
    const toggleFilter = () => setIsShowFilter(!isShowFilter);
    const toggleModalConfirmDelete = () => setIsShowModalConfirmDelete(!isShowModalConfirmDelete);

    const handleChangeStatus = (val) => {
        statusRef.current = val;
    }
    const startFilter = () => {
        toggleFilter();
        fetchDataPost({page: 1});
    }
    const deleteFilter = () => {
        authorNameRef.current.value = "";
        titleRef.current.value = "";
        fromDateRef.current.value = "";
        toDateRef.current.value = "";
        tagRef.current.value = "";
        statusRef.current = null;
        toggleFilter();
        fetchDataPost({page: 1});
    }
    const nextPage = () => {
        if(currentPage < totalPage) {
            setCurrentPage(currentPage + 1);
        }
        fetchDataPost({page: currentPage + 1});
    }
    const prevPage = () => {
        if(currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        fetchDataPost({page: currentPage - 1});
    }
    const fetchDataPost = async ({page}) => {
        let conditionFilter = {
            page: page || currentPage,
            author_name: authorNameRef.current.value || null,
            title: titleRef.current.value || null,
            from_date: fromDateRef.current.value || null,
            to_date: toDateRef.current.value || null,
            tag: tagRef.current.value || null,
            status: statusRef.current || null
        }
        setIsLoading(true);
        const res = await postMethod("manage/posts", conditionFilter);
        console.log("res: ", res)
        const { data } = res;
        if(data.status) {
            setPosts(data.posts);
            setTotalPage(Math.ceil(data.total / 10));
            setCurrentPage(page ? page : currentPage);
        }
        setIsLoading(false);
    }
    const handleShowConfirmDelete = (post_id) => {
        toggleModalConfirmDelete();
        postIdSelectedRef.current = post_id;
    }
    const deletePostHandler = async () => {
        if(!postIdSelectedRef.current) return;
        const res = await postMethod("post/delete", {post_id: postIdSelectedRef.current});
        const { data } = res;
        console.log(res)
        if(data.status) {
            if(posts.length === 1 && currentPage == totalPage) {
                fetchDataPost({page: currentPage - 1});
                setCurrentPage(currentPage - 1);
            }else {
                fetchDataPost({page: currentPage});
            }
        }
        toggleModalConfirmDelete();
    }
    useEffect(()=>{
        fetchDataPost({});
    }, [])
    useEffect(()=> {
        if(auth?.user?.role !== "admin") {
            router.push("/")
        }
    }, [auth.user])
return (
    <div className="managePage">
        <Head>
            <title>Quản lý bài viết</title>
        </Head>
    <Modal title="Xoá bài viết" size="sm" danger={true} handleCloseModal={toggleModalConfirmDelete} isShow={isShowModalConfirmDelete} handleSubmit={deletePostHandler}>
        <p>Bạn có chắc chắn muốn xoá bài viết này?</p>
    </Modal>
    <h2 className="managePage__heading" >Quản lý bài viết</h2>
    <span className="filter" onClick={toggleFilter}>
        <span className="filter__ttl">Lọc dữ liệu</span>
        <span className="filter__ico">
            <VscSettings></VscSettings>
        </span>
    </span>
    <div className={`managePage__filter ${isShowFilter ? "is-show" : ""}`}>
        <div className="managePage__filter__search">
            <div className="col">

            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Tên tác giả</label>
                <input type="text" placeHolder="Tên tác giả" ref={authorNameRef} />
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Tiêu đề</label>
                <input type="text" placeHolder="Tiêu đề bài viết" ref={titleRef}/>
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Thẻ</label>
                <input type="text" placeHolder="Nhập thẻ bài viết" ref={tagRef}/>
            </div>
            </div>
            <div className="col">
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Từ ngày</label>
                <input type="date" ref={fromDateRef}/>
                
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Đên ngày</label>
                <input type="date" ref={toDateRef}/>
            </div>
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Trạng thái</label>
                <Select onChangeFunc={handleChangeStatus} initialVal={"Choose"} options={[{title: "Công khai", value: "publish"}, {title: "Bản nháp", value: "unpublish"}, {title: "Tất cả", value: ""}]}></Select>
            </div>
            <button className="button" onClick={startFilter}>Lọc</button>
            <button className="button button--danger" onClick={deleteFilter}>Xoá bộ lọc</button>
        </div>
    </div>
    <div className="managePage__num">Trang {currentPage}/{totalPage}</div>
    <div className="managePage__content">
        <div className="table__wrapper">
            <table className="table">
                <thead>
                    <tr>
                    <th>STT</th>
                    <th>Tác giả</th>
                    <th>Tiêu đề</th>
                    <th>Thẻ</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th>Số bình luận</th>
                    <th>Số lượt vote</th>
                    <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && posts.length > 0 && posts.map((post, index) => 
                    <tr key={post._id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td>
                            <UserItem user={post.author}></UserItem>
                        </td>
                        <td>
                            <Link href={`/post/${post.slug}`}>
                                {post.title}
                            </Link>
                        </td>
                        <td>
                            {post.tags.map((tag, index) =>
                                <span key={index} className="tag">{tag}</span>
                            )}
                        </td>
                        <td>{moment(post.createdAt).subtract(10, 'days').calendar()}</td>
                        <td>
                        {post.status == "publish" ? <span className="status status--public">Công khai</span> :
                        <span className="status status--draf">Bản nháp</span>}
                        </td>
                        <td className="center">{post.commentTotal} bình luận</td>
                        <td className="center">{post.voteTotal} lượt vote</td>
                        <td>
                            <div className="table__actions">
                                <div className="table__actionsItem delete" data-tip="Xóa bài viết" onClick={()=>handleShowConfirmDelete(post._id)}>
                                    <span className="table__action--ico"><BiTrashAlt></BiTrashAlt></span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    )}
                    
                </tbody>
            </table>
            {isLoading && new Array(10).fill(1).map((_, index) => 
                <Skeleton width="100%" height="50px" marginBottom="6px"></Skeleton>
            )}
            {!isLoading && posts.length == 0 && <div className="noData">Không có bài viết nào</div>}

        </div>
        <div className="managePage__pagination">
            {!isLoading && posts.length > 0 && currentPage > 1 && totalPage > 1 && 
            <span className="prevPage" data-tip="Trang trước" onClick={prevPage}>
                <AiOutlineLeft></AiOutlineLeft>
            </span>}
            {!isLoading && posts.length > 0 && totalPage > 1 && currentPage < totalPage && 
            <span className="nextPage" data-tip="Trang kế" onClick={nextPage}>
                <AiOutlineRight></AiOutlineRight>
                {/* Trang kế */}
            </span>}
            

        </div>
      </div>
    </div>
  );
}
