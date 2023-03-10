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
            <title>Qu???n l?? b??i vi???t</title>
        </Head>
    <Modal title="Xo?? b??i vi???t" size="sm" danger={true} handleCloseModal={toggleModalConfirmDelete} isShow={isShowModalConfirmDelete} handleSubmit={deletePostHandler}>
        <p>B???n c?? ch???c ch???n mu???n xo?? b??i vi???t n??y?</p>
    </Modal>
    <h2 className="managePage__heading" >Qu???n l?? b??i vi???t</h2>
    <span className="filter" onClick={toggleFilter}>
        <span className="filter__ttl">L???c d??? li???u</span>
        <span className="filter__ico">
            <VscSettings></VscSettings>
        </span>
    </span>
    <div className={`managePage__filter ${isShowFilter ? "is-show" : ""}`}>
        <div className="managePage__filter__search">
            <div className="col">

            <div className="input__wrapper">
                <label htmlFor="" className="input__label">T??n t??c gi???</label>
                <input type="text" placeHolder="T??n t??c gi???" ref={authorNameRef} />
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Ti??u ?????</label>
                <input type="text" placeHolder="Ti??u ????? b??i vi???t" ref={titleRef}/>
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Th???</label>
                <input type="text" placeHolder="Nh???p th??? b??i vi???t" ref={tagRef}/>
            </div>
            </div>
            <div className="col">
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">T??? ng??y</label>
                <input type="date" ref={fromDateRef}/>
                
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">????n ng??y</label>
                <input type="date" ref={toDateRef}/>
            </div>
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Tr???ng th??i</label>
                <Select onChangeFunc={handleChangeStatus} initialVal={"Choose"} options={[{title: "C??ng khai", value: "publish"}, {title: "B???n nh??p", value: "unpublish"}, {title: "T???t c???", value: ""}]}></Select>
            </div>
            <button className="button" onClick={startFilter}>L???c</button>
            <button className="button button--danger" onClick={deleteFilter}>Xo?? b??? l???c</button>
        </div>
    </div>
    <div className="managePage__num">Trang {currentPage}/{totalPage}</div>
    <div className="managePage__content">
        <div className="table__wrapper">
            <table className="table">
                <thead>
                    <tr>
                    <th>STT</th>
                    <th>T??c gi???</th>
                    <th>Ti??u ?????</th>
                    <th>Th???</th>
                    <th>Ng??y t???o</th>
                    <th>Tr???ng th??i</th>
                    <th>S??? b??nh lu???n</th>
                    <th>S??? l?????t vote</th>
                    <th>Thao t??c</th>
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
                        {post.status == "publish" ? <span className="status status--public">C??ng khai</span> :
                        <span className="status status--draf">B???n nh??p</span>}
                        </td>
                        <td className="center">{post.commentTotal} b??nh lu???n</td>
                        <td className="center">{post.voteTotal} l?????t vote</td>
                        <td>
                            <div className="table__actions">
                                <div className="table__actionsItem delete" data-tip="X??a b??i vi???t" onClick={()=>handleShowConfirmDelete(post._id)}>
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
            {!isLoading && posts.length == 0 && <div className="noData">Kh??ng c?? b??i vi???t n??o</div>}

        </div>
        <div className="managePage__pagination">
            {!isLoading && posts.length > 0 && currentPage > 1 && totalPage > 1 && 
            <span className="prevPage" data-tip="Trang tr?????c" onClick={prevPage}>
                <AiOutlineLeft></AiOutlineLeft>
            </span>}
            {!isLoading && posts.length > 0 && totalPage > 1 && currentPage < totalPage && 
            <span className="nextPage" data-tip="Trang k???" onClick={nextPage}>
                <AiOutlineRight></AiOutlineRight>
                {/* Trang k??? */}
            </span>}
            

        </div>
      </div>
    </div>
  );
}
