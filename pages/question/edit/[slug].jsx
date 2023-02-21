import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '~/components/Editer/Editer';
import InputMultiFile from '~/components/InputMultiFile/InputMultiFile';
import { updateQuestion } from '~/redux/actions/questionAction';
import displayToast from '~/utils/displayToast';
import { getMethod } from '~/utils/fetchData';
function EditQuestionPage() {
  const tagRef = useRef();
  const router = useRouter();
  const { slug } = router.query;
  const auth = useSelector((state) => state.auth);
  const [questionData, setQuestionData] = useState({
    title: "",
    content: "",
    tags: [],
    files: []
  });
  const dispatch = useDispatch();
  
  const handlePressTag = (e) => {
    if (e.key === "Enter") {
      let value = e.target.value;
      if(!value) return
      if(questionData.tags.includes(value)) {
        displayToast("warning", "Bạn đã sử dụng thẻ này rồi");
        return;
      }
      if(value.length > 20) {
        displayToast("warning", "Thẻ không được quá 20 ký tự");
        return;
      }
      if(questionData.tags.length >= 5) {
        displayToast("warning", "Bạn chỉ được sử dụng tối đa 5 thẻ");
        return;
      }
      setQuestionData({ ...questionData, tags: [...questionData.tags, value] })
      tagRef.current.value = "";
    }
  }
  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setQuestionData({ ...questionData, [name]: value });
  }
  const handleDeleteTag = (index) => {
    let tags = questionData.tags;
    tags.splice(index, 1);
    setQuestionData({ ...questionData, tags: tags })
  }
  const handleChangeContent = (content) => {
    setQuestionData({ ...questionData, content: content })
  }
  const handleChangeFile = (fileList) => {
    setQuestionData({ ...questionData, files: fileList })
  }
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if(!questionData.title) {
        displayToast("warning", "Bạn chưa nhập tiêu đề");
        return;
    }
    if(!questionData.content) {
        displayToast("warning", "Bạn chưa nhập nội dung");
        return;
    }
    if(questionData.tags.length === 0) {
        displayToast("warning", "Bạn chưa nhập thẻ");
        return;
    }

    const formData = new FormData();
    formData.append("question_id", questionData._id);
    formData.append("title", questionData.title);
    formData.append("content", questionData.content);
    questionData.files.forEach(item => {
      if(item.url) {
        formData.append("files_old", item.url);
        return;
      }
      let bloobFile = item;
      formData.append("files", bloobFile, item.name);
    });
    questionData.tags.forEach(item => formData.append("tags", item));
    dispatch(updateQuestion(formData, router));
  }
  const fetchQuestion = () => {
    if(slug) {
      getMethod(`question/${slug}`)
        .then(res => {
          const { data } = res;
          if(data.status) {
            setQuestionData(data.question)
          }
        })
        .catch(err => console.log(err))
    }
  }
  useEffect(()=> {
    fetchQuestion()
  }, [slug])
  useEffect(() => {
    if(!auth.user) {
      router.push("/")
    }
  }, [auth])
  return (
    <div className="createPage">
      {/* <Head>
        <title>Chỉnh sửa câu hỏi</title>
      </Head> */}
      <h1 className='createPage__heading'>Chỉnh sửa nội dung câu hỏi</h1>
      <form action="" onSubmit={(e) => e.preventDefault()}>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Tiêu đề</label>
          <input type="text" name="title" placeholder='Nhập tiêu đề của câu hỏi...' value={questionData.title}  onChange={handleChangeForm} />
        </div>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Nội dung Câu hỏi</label>
          <Editor initialVal={questionData.content} onChangeFunc={handleChangeContent}/>
        </div>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="" >File đính kèm (tối đa 5 file)</label>
          <InputMultiFile initialFiles={questionData.files} handleChange={handleChangeFile}></InputMultiFile>
        </div>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="" >Thẻ (Tối đa 4 thẻ)</label>
          <input type="text" placeholder='Chọn thẻ cho câu hỏi...' onKeyPress={handlePressTag} ref={tagRef}/>
        </div>
        <div className="createPage__tagWrapper">
          <ul className="tag-list">
            {questionData.tags.length > 0 && questionData.tags.map((tag, index) => (
              <li key={tag} className="tag-item">{tag} <span className="tag-item__delete" onClick={()=>handleDeleteTag(index)}><FaTimes></FaTimes></span></li>
            ))}
          </ul>
        </div>
        <div className="createPage__btn">
          <button className='button button__lg' type='button' onClick={handleSubmitForm}>Lưu câu hỏi</button>
        </div>
      </form>
    </div>
  )
}

export default EditQuestionPage