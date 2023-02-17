import { useRouter } from 'next/router';
import { useEffect, useId, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Editor from '~/components/Editer/Editer';
import InputImage from '~/components/InputImage/InputImage';
import { updatePost } from '~/redux/actions/postActions';
import displayToast from '~/utils/displayToast';
import { getMethod } from '~/utils/fetchData';
const optionsSavePost = [
  {value: "unpublish", label: "Lưu nháp"},
  {value: "publish", label: "Công khai"}
]
function UpdatePost() {
  const tagRef = useRef();
  const auth = useSelector(state => state.auth);
  const router = useRouter();
  const { slug } = router.query;
  const [postData, setPostData] = useState({
    title: "",
    tldr: "",
    content: "",
    saveOption: "unpublish",
    thumbnail: [],
    tags: []
  });
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if(!slug) {
      return;
    }
    getMethod("post/"+ slug)
      .then(res => {
        const { data } = res;
        if(data.status) {
          let post = data.post
          setPostData({...post, saveOption: post.status, thumbnail: [{url: post.thumbnail}]})
          document.title = post.title;
          if(!post && post?.author?._id != auth.user._id && !auth.isAdmin) {
            router.push("/");
            return;
          }
          setLoaded(true);
        }
      })
      .catch(err => {
        console.log(err)
      })

  }, [slug, auth]);


  const handleChangeForm = (e) => {
    if(!loaded) return;
    const {name, value} = e.target;
    setPostData({ ...postData, [name]: value })
  }

  const handleChangeSaveOption = (selectedOption) => {
    setPostData({ ...postData, saveOption: selectedOption })
  }
  
  const handleChangeTitle = (e) => {
    const {value} = e.target;
    setPostData({ ...postData, title: value })
    document.title = value;
  }

  const handlePressTag = (e) => {
    
    if (e.key === "Enter") {
      e.preventDefault();
      let value = e.target.value;
      if(!value) return
      if(postData.tags.includes(value)) {
        displayToast("warning", "Bạn đã sử dụng thẻ này rồi");
        return;
      }
      if(value.length > 20) {
        displayToast("warning", "Thẻ không được quá 20 ký tự");
        return;
      }
      if(postData.tags.length >= 5) {
        displayToast("warning", "Bạn chỉ được sử dụng tối đa 5 thẻ");
        return;
      }
      setPostData({ ...postData, tags: [...postData.tags, value] })
      tagRef.current.value = "";
    }else {
      return;
    }
  }

  const handleDeleteTag = (index) => {
    let tags = postData.tags;
    tags.splice(index, 1);
    setPostData({ ...postData, tags: tags })
  }

  const onChangeImage = (imageList, addUpdateIndex) => {
    setPostData({ ...postData, thumbnail: imageList })
  };
  const handleChangeContent = (content) => {
    setPostData({ ...postData, content: content })
  }
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const {title, tldr, content, saveOption, thumbnail, tags} = postData;
    if(!title) {
      displayToast("warning", "Bạn chưa nhập tiêu đề");
      return;
    }
    // if(content.length < 100) {
    //   displayToast("warning", "Nội dung bài viết quá ngắn");
    //   return;
    // }
    if(!saveOption) {
      displayToast("warning", "Bạn chưa chọn chế độ lưu bài viết");
      return;
    }
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("tldr", postData.tldr);
    formData.append("content", postData.content);
    formData.append("saveOption", postData?.saveOption?.value);
    formData.append("post_id", postData._id);
    let blodImage = postData.thumbnail[0]?.file;
    if(blodImage) {
      formData.append("thumbnail", blodImage, postData.thumbnail[0]);
    }
    postData.tags.forEach(item => {
      formData.append("tags", item);
    });
    dispatch(updatePost(formData));
    router.push("/posts")
  }

  return (
    <div className="createPage">
      <h1 className='createPage__heading'>Sửa bài viết</h1>
      <form action="" onSubmit={(e) => e.preventDefault()}>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Tiêu đề</label>
          <input type="text" placeholder='Nhập tiêu đề của bài viết...' value={postData.title} onChange={(e) => handleChangeTitle(e)} />
        </div>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Tóm tắt bài viết</label>
          <textarea type="text" placeholder='Tóm tắt ngắn gọn bài viết...' rows={5} name="tldr" value={postData.tldr} onChange={handleChangeForm}></textarea>
        </div>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Nội dung bài viết</label>
          <Editor initialVal={postData.content} onChangeFunc={handleChangeContent} />
        </div>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="" >Thẻ (Tối đa 4 thẻ)</label>
          <input type="text" placeholder='Chọn thẻ cho bài viết...' onKeyPress={handlePressTag} ref={tagRef}/>
        </div>
        <div className="createPage__tagWrapper">
          <ul className="tag-list">
            {postData.tags.length > 0 && postData.tags.map((tag, index) => (
              <li key={tag} className="tag-item">{tag} <span className="tag-item__delete" onClick={()=>handleDeleteTag(index)}><FaTimes></FaTimes></span></li>
            ))}
          </ul>
        </div>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Ảnh bìa cho bài viết (Nếu k chọn ảnh bìa thì sẽ lấy ảnh mặc định cho bài viết)</label>
          <InputImage onChangeImage={onChangeImage} images={postData.thumbnail} name="image"></InputImage>
        </div>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Chế độ lưu</label>
          <Select
            value={postData.saveOption}
            onChange={handleChangeSaveOption}
            options={optionsSavePost}
            className="reactSelect"
            isSearchable={false}
            autoFocus={true}
            instanceId={useId()}
          />
        </div>
        <div className="createPage__btn">
          <button className='button button__lg' type='button' onClick={handleSubmitForm}>Cập nhật bài viết</button>
        </div>
      </form>
    </div>
  )
}

export default UpdatePost