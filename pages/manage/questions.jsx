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
    const router = useRouter();
    const auth = useSelector(state => state.auth);

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
    useEffect(()=> {
        if(auth?.user?.role !== "admin") {
            router.push("/")
        }
    }, [auth.user])
return (
    <div className="managePage">
        <Head>
            <title>Qu???n l?? c??u h???i</title>
        </Head>
    <Modal title="Xo?? c??u h???i" size="sm" danger={true} handleCloseModal={toggleModalConfirmDelete} isShow={isShowModalConfirmDelete} handleSubmit={deleteQuestionHandler}>
        <p>B???n c?? ch???c ch???n mu???n xo?? c??u h???i n??y?</p>
    </Modal>
    <h2 className="managePage__heading" >Qu???n l?? c??u h???i</h2>
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
                    <label htmlFor="" className="input__label">Th???</label>
                    <input type="text" placeHolder="Nh???p th??? b??i vi???t" ref={tagRef}/>
                </div>
                <div className="input__wrapper">
                    <label htmlFor="" className="input__label">Ti??u ?????</label>
                    <input type="text" placeHolder="Ti??u ????? b??i vi???t" ref={titleRef}/>
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
                <Select onChangeFunc={handleChangeStatus} initialVal={"Choose"} options={[{title: "???? ???????c gi???i ????p", value: "resolve"}, {title: "Ch??a ???????c gi???i ????p", value: "unresolve"}, {title: "T???t c???", value: ""}]}></Select>
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
                    <th>S??? c??u tr??? l???i</th>
                    <th>Thao t??c</th>
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
                        <span className="status status--public">???? ???????c gi???i ????p</span> :
                        <span className="status status--draf">Ch??a ???????c gi???i ????p</span>}
                        </td>
                        <td className="center">{question.answers.length} b??nh lu???n</td>
                        <td>
                            <div className="table__actions">
                                <div className="table__actionsItem delete" data-tip="X??a c??u h???i" onClick={()=>handleShowConfirmDelete(question._id)}>
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
            {!isLoading && questions.length == 0 && <div className="noData">Kh??ng c?? b??i vi???t n??o</div>}

        </div>
        <div className="managePage__pagination">
            {!isLoading && questions.length > 0 && currentPage > 1 && totalPage > 1 && 
            <span className="prevPage" data-tip="Trang tr?????c" onClick={prevPage}>
                <AiOutlineLeft></AiOutlineLeft>
            </span>}
            {!isLoading && questions.length > 0 && totalPage > 1 && currentPage < totalPage && 
            <span className="nextPage" data-tip="Trang k???" onClick={nextPage}>
                <AiOutlineRight></AiOutlineRight>
                {/* Trang k??? */}
            </span>}
            

        </div>
      </div>
    </div>
  );
}
