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

export default function ManagePost() {
    const [questions, setQuestions] = React.useState([]);
    const [isShowModalConfirmDelete, setIsShowModalConfirmDelete] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPage, setTotalPage] = React.useState(1);
    const [ isLoading, setIsLoading ] = React.useState(false);
    const questionIdSelected = React.useRef(null);
    const authorNameRef = React.useRef(null);
    const titleRef = React.useRef(null);
    const fromDateRef = React.useRef(null);
    const toDateRef = React.useRef(null);
    const tagRef = React.useRef(null);

    const statusRef = React.useRef(null);
    const [ isShowFilter, setIsShowFilter ] = React.useState(false);
    const toggleFilter = () => setIsShowFilter(!isShowFilter);
    const toggleModalConfirmDelete = () => setIsShowModalConfirmDelete(!isShowModalConfirmDelete);

    const handleChangeStatus = (val) => {
        statusRef.current = val;
    }
    const startFilter = () => {
        toggleFilter();
        fetchDataQuestion({page: 1});
    }
    const deleteFilter = () => {
        authorNameRef.current.value = "";
        titleRef.current.value = "";
        fromDateRef.current.value = "";
        toDateRef.current.value = "";
        tagRef.current.value = "";
        statusRef.current = null;
        toggleFilter();
        fetchDataQuestion({page: 1});
    }
    const nextPage = () => {
        if(currentPage < totalPage) {
            setCurrentPage(currentPage + 1);
        }
        fetchDataQuestion({page: currentPage + 1});
    }
    const prevPage = () => {
        if(currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        fetchDataQuestion({page: currentPage - 1});
    }
    const fetchDataQuestion = async ({page}) => {
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
        const res = await postMethod("manage/questions", conditionFilter);
        const { data } = res;
        if(data.status) {
            setQuestions(data.questions);
            setTotalPage(Math.ceil(data.total / 10));
            setCurrentPage(page ? page : currentPage);
        }
        setIsLoading(false);
    }
    const handleShowConfirmDelete = (question_id) => {
        toggleModalConfirmDelete();
        questionIdSelected.current = question_id;
    }
    const deleteQuestionHandler = async () => {
        if(!questionIdSelected.current) return;
        const res = await postMethod("question/delete", {question_id: questionIdSelected.current});
        const { data } = res;
        if(data.status) {
            if(questions.length === 1 && currentPage == totalPage) {
                fetchDataQuestion({page: currentPage - 1});
                setCurrentPage(currentPage - 1);
            }else {
                fetchDataQuestion({page: currentPage});
            }
        }
        toggleModalConfirmDelete();
    }
    useEffect(()=>{
        fetchDataQuestion({});
    }, [])
    console.log("questions: ", questions)
return (
    <div className="managePage">
        <Head>
            <title>Quản lý câu hỏi</title>
        </Head>
    <Modal title="Xoá câu hỏi" size="sm" danger={true} handleCloseModal={toggleModalConfirmDelete} isShow={isShowModalConfirmDelete} handleSubmit={deleteQuestionHandler}>
        <p>Bạn có chắc chắn muốn xoá câu hỏi này?</p>
    </Modal>
    <h2 className="managePage__heading" >Quản lý câu hỏi</h2>
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
                    <label htmlFor="" className="input__label">Thẻ</label>
                    <input type="text" placeHolder="Nhập thẻ bài viết" ref={tagRef}/>
                </div>
                <div className="input__wrapper">
                    <label htmlFor="" className="input__label">Tiêu đề</label>
                    <input type="text" placeHolder="Tiêu đề bài viết" ref={titleRef}/>
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
                <Select onChangeFunc={handleChangeStatus} initialVal={"Choose"} options={[{title: "Đã được giải đáp", value: "resolve"}, {title: "Chưa được giải đáp", value: "unresolve"}, {title: "Tất cả", value: ""}]}></Select>
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
                    <th>Số câu trả lời</th>
                    <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && questions.length > 0 && questions.map((question, index) => 
                    <tr key={question._id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td>
                            <UserItem user={question.author}></UserItem>
                        </td>
                        <td>
                            <Link href={`/question/${question.slug}`}>
                                {question.title}
                            </Link>
                        </td>
                        <td>
                            {question.tags.map((tag, index) =>
                                <span key={index} className="tag">{tag}</span>
                            )}
                        </td>
                        <td>{moment(question.createdAt).subtract(10, 'days').calendar()}</td>
                        <td>
                        {question.answers.filter(a => a.status == "accepted").length > 0 ? 
                        <span className="status status--public">Đã được giải đáp</span> :
                        <span className="status status--draf">Chưa được giải đáp</span>}
                        </td>
                        <td className="center">{question.answers.length} bình luận</td>
                        <td>
                            <div className="table__actions">
                                <div className="table__actionsItem delete" data-tip="Xóa câu hỏi" onClick={()=>handleShowConfirmDelete(question._id)}>
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
            {!isLoading && questions.length == 0 && <div className="noData">Không có bài viết nào</div>}

        </div>
        <div className="managePage__pagination">
            {!isLoading && questions.length > 0 && currentPage > 1 && totalPage > 1 && 
            <span className="prevPage" data-tip="Trang trước" onClick={prevPage}>
                <AiOutlineLeft></AiOutlineLeft>
            </span>}
            {!isLoading && questions.length > 0 && totalPage > 1 && currentPage < totalPage && 
            <span className="nextPage" data-tip="Trang kế" onClick={nextPage}>
                <AiOutlineRight></AiOutlineRight>
                {/* Trang kế */}
            </span>}
            

        </div>
      </div>
    </div>
  );
}
