import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { RiAwardFill } from 'react-icons/ri'
import Prism from "prismjs";
import { useDispatch, useSelector } from 'react-redux'
import AnswerBlock from '~/components/AnswerBlock/AnswerBlock'
import Editer from '~/components/Editer/Editer'
import Modal from '~/components/Modal/Modal'
import UserItem from '~/components/UserItem/UserItem'
import ZoomImage from '~/components/ZoomImage/ZoomImage'
import { addAnswer } from '~/redux/actions/questionAction'
import displayToast from '~/utils/displayToast'
import { getMethod } from '~/utils/fetchData'

export default function QuestionDetailPage() {
  const router = useRouter()
  const [question, setQuestion] = React.useState(null)
  const [isShowModalAdd, setIsShowModalAdd] = React.useState(false)
  const [answerContent, setAnswerContent] = React.useState('')
  const [loaded, setLoaded] = React.useState(false)
  const questions = useSelector(state => state.questions)
  const { slug } = router.query
  const dispatch = useDispatch()
  const toggleModalAdd = () => setIsShowModalAdd(!isShowModalAdd)
  const onChangeAnswerContent = (val) => {
    setAnswerContent(val)
  }
  const saveAnswer = () => {
    let content = answerContent
    if(!content) {
      displayToast("warning", "Nội dung câu trả lời không được để trống")
      return;
    }
    dispatch(addAnswer({content, question_id: question._id}))
    toggleModalAdd();
    setAnswerContent('')
  }
  useEffect(() => {
    Prism.highlightAll();
  });
  useEffect(()=> {
    if(loaded && !question) {
      router.push('/')
    }
    let questionDataFind = questions.data.find(q => q.slug === slug)
    if(questionDataFind) {
      setQuestion(questionDataFind)
      setLoaded(true)
    }else {
      if(slug) {
        getMethod(`question/${slug}`)
          .then(res => {
            const { data } = res;
            if(data.status) {
              setQuestion(data.question)
            }
            setLoaded(true)
          })
          .catch(err => console.log(err))
      }
    }

  }, [slug, questions])
  console.log("question; ", question)
  return (
    <div className='questionDetailPage'>
      <Head>
        <title>{question?.title || "Câu hỏi"}</title>
      </Head>
        {isShowModalAdd && <Modal handleCloseModal={toggleModalAdd} size="md" title="Thêm câu trả lời" isShow={isShowModalAdd} handleSubmit={saveAnswer}>
          <div className="input__wrapper">
            <label htmlFor="answerContent">Nội dung câu trả lời</label>
            <Editer initialVal='' onChangeFunc={onChangeAnswerContent}></Editer>
          </div>
        </Modal>}
        {loaded && !question && <div className="questionDetailPage__notFound">Không tìm thấy câu hỏi hoặc câu hỏi đã bị xóa</div>}
        {loaded && question && <>
          {question?.answers?.filter(item => item.status == "accepted")?.length > 0 && 
            <div className="questionDetailPage__resolve">
              <span className="ico"><RiAwardFill></RiAwardFill></span>
              <span className="ttl">Đã được giải đáp</span>
            </div>
          }
          <UserItem user={question?.author} time={question?.createdAt}></UserItem>
          <div className="questionDetailPage__content">
            <h3 className='questionDetailPage__content--ttl'>{question?.title}</h3>
            <ul className="tag-list">
              {question?.tags?.length > 0 && question.tags.map((tag, _) => (<li className="tag-item" key={tag}>{tag}</li>))}
            </ul>
            <ZoomImage>
              <div className="questionDetailPage__content--body mce-content-body" 
                dangerouslySetInnerHTML={{__html: question?.content}}
                ></div>
            </ZoomImage>
            <div className="questionDetailPage__files">
              <h3>Tập tin đính kèm</h3>
              {question?.files?.length > 0 && question.files.map((file, index) => (
                <div className='questionDetailPage__files--item' key={file.url}>
                  <span>{index + 1 } . </span>
                  <a key={file.url} href={file.url} target='_blank'>{file.file_name} ( { Math.floor(file.size / 1024 / 1024) > 0 ? `${Math.floor(file.size / 1024 / 1024)} MB` : `${Math.floor(file.size / 1024 )} KB` }  )</a>
                </div>
              ))}
            </div>
          </div>
          <div className="questionDetailPage__addAnswer" onClick={toggleModalAdd}>
            <span className="questionDetailPage__addAnswer--ico">
              <FaRegEdit></FaRegEdit>
            </span>
            <span className="questionDetailPage__addAnswer--ttl">Thêm câu trả lời</span>
          </div>
          <div className="questionDetailPage__comments">
            <h3>Các câu trả lời</h3>
            <AnswerBlock author_question_id={question?.author?._id} answers={question?.answers}></AnswerBlock>
          </div>
        </>}
    </div>
  )
}
