import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { ImAttachment } from 'react-icons/im'
import { RiChatHeartLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import displayToast from '~/utils/displayToast'
import { postMethod } from '~/utils/fetchData'
import getIconFileType from '~/utils/getIconFileType'
import UserItem from '../UserItem/UserItem'
import ZoomImage from '../ZoomImage/ZoomImage'

export default function ChatContent({userChatNow,scrollToBottom, messageEndRef, thread, content, setContent, setThread, backToChat}) {
  const chatContentRef = useRef(null)
  // const messageEndRef = useRef(null)
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatContent, setChatContent] = useState("")
  const socket = useSelector(state => state.socket)
  const handleChangeContent = (e) => {
    setChatContent(e.target.value)
  }
  // const [isFirstTimes, setIsFirstTimes] = useState(true)
  // console.log("userChatNow: ", userChatNow)
  let maxFiles = 3
  let revertArr = [...content].reverse()
  content = [...revertArr]
  // delete duplicate message by content._id
  const deleteDuplicateMessage = (arr) => {
    let newArr = []
    let arrId = []
    arr.forEach(item => {
      if(!arrId.includes(item._id)) {
        newArr.push(item)
        arrId.push(item._id)
      }
    })
    return newArr
  }
  content = deleteDuplicateMessage(content)

  const handleSendMessage = async () => {
    // console.log("Chatttt: ", chatContent)
    // const aaaaaa = await fetch(`/api/openai`, {
    //   body: JSON.stringify({
    //     name: chatContent
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   method: 'POST'
    // })
    // const dddddd = await aaaaaa.json();
    // console.log(dddddd)
    // return;
    if(!chatContent && files.length === 0) {
      displayToast("warning", "Bạn chưa nhập nội dung tin nhắn")
      return;
    }
    const formData = new FormData()
    formData.append("content", chatContent)
    formData.append("user_chat_id", userChatNow._id)
    formData.append("chat_thread_id", thread?._id)
    files.forEach(item => {
      let bloobFile = item;
      formData.append("files", bloobFile, item.name);
    });
    setIsLoading(true)
    const res = await postMethod("chat", formData)
    const { data } = res
    if(data.status) {
      let chat = data.chat
      let thread = data.thread
      setThread(prevThread => {
        let isExists = false;
        prevThread.forEach(item => {
          if(item._id == thread._id) {
            isExists = true;
          }
        })
        if(isExists) {
          return prevThread.map(item => item._id == thread._id ? thread : item)
        }
        return [thread, ...prevThread]
      })
      setContent(prevContent => [chat, ...prevContent])
      scrollToBottom()
      socket.emit("send-message", {receiver: userChatNow, chat, thread})
    }else {
      displayToast("error", data.message)
    }
    setIsLoading(false)
    setFiles([])
    // chatContentRef.current.value = ""
    setChatContent("")
    // chatContentRef.current.focus()
  }

  const handleDeleteFile = (index) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleAddFile = (e) => {
    const fileList = e.target.files
    if(fileList.length === 0) return
    let fileNew = [...files]
    for(let i = 0; i < fileList.length; i++) {
      if(fileNew.length < maxFiles) {
        let isExist = false
        for(let j = 0; j < fileNew.length; j++) {
          if(fileNew[j].name === fileList[i].name && fileNew[j].size === fileList[i].size && fileNew[j].type === fileList[i].type) {
            isExist = true
            displayToast("warning", "Bạn đã chọn file này rồi")
            break;
          }
        }
        if(isExist) continue
        fileNew.push(fileList[i])
      }else {
        displayToast("warning", "Bạn chỉ được chọn tối đa 5 file")
        break;
      }
    }
    setFiles(fileNew)
  }
  useEffect(() => {
    setTimeout(()=>{
      scrollToBottom()
    },1500)
  }, [])

  return (
    <>

      {!thread && Object.keys(userChatNow).length === 0 && <div className="chat__contentEmpty">
        <div className="chat__contentEmpty--wrapper">
          <div className="ico"><RiChatHeartLine></RiChatHeartLine></div>
          <p className='txt'>
            Chọn một cuộc trò chuyện để bắt đầu trò chuyện
          </p>
        </div>
      </div>}
      {isLoading && <span className='sending'> <div className="dashed-loading"></div> </span>}
      {Object.keys(userChatNow).length > 0 && <>
      <div className="chat__contentHead">
        <div className="chat__contentHead--back" onClick={backToChat}>{`< Back`}</div>
        <UserItem user={userChatNow}></UserItem>
      </div>
      <div className="chat__contentMess">
        <div className="chat__contentMessWrapper">
          <div className="chat__contentMessList">
            {content.length > 0 && content.map((chat, index) => 
              <div className={`chat__contentMessItem ${chat?.sender?._id != userChatNow?._id ? "is-me" : ""}`} key={chat._id}>
                <div className="chat__contentMessItem--avatar">
                  <span className="avatar avatar__sm">
                    <img src={chat?.sender?.avatar || "/default.png"} alt="User avatar" />
                  </span>
                </div>
                <div className="chat__contentMessItem--content">
                  <div className="chat__contentMessItem--contentWrapper">
                    <p>{chat?.content}</p>
                    {chat?.files.length > 0 && (
                      <div className="chat__contentMessItem--contentFile">
                        {chat?.files.map((file, index) => {
                          if(file.type == "image") {
                            return <a href={file.url} key={file.url} target="_blank">
                              <img src={file.url} alt="" />
                            </a>
                          }else {
                            return <a key={file.url} href={file.url} target="_blank" rel="noreferrer">{ file.file_name }</a>
                          }
                        })}
                      </div>
                    )}
                  </div>
                  <time className="time">{moment(chat?.createdAt).format("LLL")}</time>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='messageEnd' ref={messageEndRef}></div>
      </div>
      <div className="chat__contentInput">
        <div className="chat__contentInput--file">
        <div className="inputFile__previewChat">
          {files.length > 0 && files.map((file, index) => {
            let fileSize = Math.floor(file.size / 1024)
            let fileName = ""
            if(file.name) {
              fileName = file.name.length > 30 ? file.name.slice(0, 30) + '...' : file.name
            }else {
              fileName = file.file_name
            }
            let fileType = file.type.split('/')[1]
            let FileIcon = getIconFileType(fileType)
            return (
              <div key={index} className="inputFile__previewChat-item">
                <div className="inputFile__previewChat-item--delete" onClick={()=>handleDeleteFile(index)}>
                  <FaTimes></FaTimes>
                </div>
                <div className="inputFile__previewChat-item--ico">
                  <FileIcon />
                </div>
                <div className="inputFile__previewChat-item--name">
                  {fileName}
                </div>
                <div className="inputFile__previewChat-item--size">
                  {fileSize > 1024 ? `${Math.floor(fileSize / 1024)} MB` : `${fileSize} KB`}
                </div>
              </div>
            )
          })}
        </div>
      </div>
        <div className="chat__contentInput--content">
          <div className="chat__contentInput--file">
            <label htmlFor="fileAttach" className='chat__contentInput--attach'>
              <ImAttachment></ImAttachment>
            </label>
            <input type="file" id="fileAttach" hidden onChange={handleAddFile}/>
          </div>
          <div className="chat__contentInput--input">
            <div className="input__wrapper">
              <textarea rows="2"  placeholder='Nhập nội dung chat' value={chatContent} onChange={handleChangeContent}></textarea>
            </div>
          </div>
          <div className="chat__contentInput--btn">
            <button className="btn-send" onClick={handleSendMessage}>
             Gửi
            </button>
          </div>
        </div>
      </div>
      </>}
    </>
  )
}
