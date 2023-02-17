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
import { deleteQuestion } from "~/redux/actions/questionAction";
import { getMethod } from "~/utils/fetchData";

export default function MyPost() {
  const [loaded, setLoaded] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [isShowDeleteModal, setIsShowDeleteModal] = React.useState(false);
  const toggleDeleteModal = () => setIsShowDeleteModal(!isShowDeleteModal);
  const dispatch = useDispatch();
  const questionSelectedId = React.useRef(null);
  const handleDelete = () => {
    let question_id = questionSelectedId.current;
    dispatch(deleteQuestion({question_id}))
    toggleDeleteModal();
    fetchMyQuestion();
  }
  const confirmDelete = (post_id) => {
    questionSelectedId.current = post_id;
    toggleDeleteModal();
  }
  const fetchMyQuestion = () => {
    getMethod("question/my-question")
    .then(res => {
      const { data } = res;
      setQuestions(data.questions)
      setLoaded(true)
    })
    .catch(err => {
      console.log(err)
    })
  }
  useEffect(()=> {
    fetchMyQuestion();
  }, [])

return (
    <div className="managePage">
      <Head>
        <title>Câu hỏi của tôi</title>
      </Head>
    <h2 className="managePage__heading" >Câu hỏi của tôi</h2>
    <Modal title="Xóa câu hỏi" isShow={isShowDeleteModal} handleCloseModal={toggleDeleteModal} danger={true} handleSubmit={handleDelete} size="sm">
      <p>Bạn có chắc chắn muốn xóa câu hỏi này?</p>
    </Modal>
    <div className="managePage__content">
        <div className="table__wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tiêu đề</th>
                  <th>Ngày tạo</th>
                  <th>Số câu trả lời</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loaded && questions.length > 0 && questions.map((question, _) => 
                  <tr key={question._id}>
                    <td>{_ + 1}</td>
                    <td>
                      <Link href={`/question/${question.slug}`}>
                        {question.title}
                      </Link>
                    </td>
                    <td>{moment(question.createdAt).format("LLL")}</td>
                    <td>{question.answers.length} câu trả lời</td>
                    <td>
                      <span className={question.answers.filter(item => item.status == "accepted").length > 0 ? "resolve" : "notResolve"}>
                        {question.answers.filter(item => item.status == "accepted").length > 0 ? "Đã được giải đáp" : "Chưa được giải đáp"}
                      </span>
                    </td>
                    <td>
                      <div className="table__actions">
                        <div className="table__actionsItem edit" data-tip="Sửa câu hỏi">
                          <Link href={`/question/edit/${question.slug}`}>
                            <span className="table__action--ico"><FiEdit></FiEdit></span>
                          </Link>
                        </div>
                        <div className="table__actionsItem delete" data-tip="Xoá câu hỏi" onClick={()=>confirmDelete(question._id)}>
                          <span className="table__action--ico"><BiTrashAlt></BiTrashAlt></span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {loaded && questions.length === 0 && <tr><td colSpan={6}>Không có câu hỏi nào</td></tr>}
              </tbody>
            </table>
            {!loaded && new Array(8).fill(null).map((_, index) => {
              return <div key={index}><Skeleton width="100%" height="50px" marginBottom="3px"></Skeleton></div>
            })}
        </div>
      </div>
    </div>
  );
}
