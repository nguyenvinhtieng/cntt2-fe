import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import ChatContent from '~/components/ChatContent/ChatContent'
import ChatUsers from '~/components/ChatUsers/ChatUsers'
import displayToast from '~/utils/displayToast'
import { getMethod, postMethod } from '~/utils/fetchData'

export default function chat() {
  const [isShowContent, setIsShowContent] = React.useState(false)
  const [chatThreads, setChatThreads] = React.useState([])
  const [chatThreadNow, setChatThreadNow] = React.useState(null)
  const [chatContent, setChatContent] = React.useState([])
  const [userChatNow, setUserChatNow] = React.useState({})
  const chatThreadNowsRef = useRef(null)
  const chatThreadsRef = useRef([])
  const userChatNowRef = useRef(null)
  const messageEndRef = useRef(null)
  useEffect(() => {
    chatThreadNowsRef.current = chatThreadNow
    chatThreadsRef.current = chatThreads
    userChatNowRef.current = userChatNow
  }, [chatThreadNow, chatThreads, userChatNow])

  const toggleShowContent = () => setIsShowContent(!isShowContent)

  const router = useRouter()
  const socket = useSelector(state => state.socket)
  const auth = useSelector(state => state.auth)
  const getAllChatThreads = async() => {
    const res = await getMethod("chat/get-all-thread")
    const { data } = res
    if(data) {
      const threads = data.data
      threads.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      })
      setChatThreads(threads)
    }else {
      displayToast("error", data.message)
    }
  }
  useEffect(() => {
    getAllChatThreads()
  },[])
  // check is chat with user
  const fetchChatWithUser = async ({user_slug}) => {
    const res = await postMethod("chat/get-chat-with-user", { user_slug })
    const { data } = res
    if(data.status) {
      setUserChatNow(data.user)
      setChatThreadNow(data.chat_thread)
      setChatContent(data.data)
    }else {
      displayToast("error", data.message)
    }
  }

  const handleChangeThreadChat = async (thread, user) => {
    setChatThreadNow(thread)
    setUserChatNow(user)
    toggleShowContent()
    const res = await postMethod("chat/get-chat-of-thread", { chat_thread_id: thread._id })
    const { data } = res
    if(thread?.new && thread?.last_message?.sender != auth?.user?.id) {
      let newChatThreads = chatThreads.map(item => {
        if(item._id == thread._id) {
          item.new = false
        }
        return item
      })
      setChatThreads(newChatThreads)
    }
    if(data.status) {
      setChatContent(data.data)
    }else {
      displayToast("error", data.message)
    }
  }
  // case start chat at user profile
  useEffect(() => {
    const { asPath } = router
    const user = asPath.split("/chat?user=")[1]
    if(user) {
      fetchChatWithUser({user_slug: user})
    }
  },[])

  const scrollToBottom = () => {
    setTimeout(()=>{
      messageEndRef.current?.scrollIntoView({behavior: "smooth"})
    }, 100)
  }


  const handleReceiveNewMessage = ({chat, thread}) => {
    if(chatThreadNowsRef.current?._id == thread._id || userChatNowRef.current._id == chat.sender._id) {
      setChatContent(prevChatConent => [chat, ...prevChatConent])
      scrollToBottom()
    }

    let isExitstThread = false;
    chatThreadsRef.current.forEach(item => {
      if(item._id == thread._id) {
        isExitstThread = true
      }
    })
    console.log("isExitstThread: ", isExitstThread)
    if(isExitstThread) {
      setChatThreads(prevThreads => prevThreads.map(item => item._id == thread._id ? thread : item))
    }else {
      setChatThreads(prevThreads => [thread, ...prevThreads])
    }
  }
  // socket handler
  useEffect(()=> {
    if(Object.keys(socket).length > 0) {
      socket.on("new-message", ({chat, thread}) => {
        console.log("new-message: ", chat)
        handleReceiveNewMessage({chat, thread})
      })
    }
  }, [socket])
  
  return (
    <div className='chat'>
      <Head>
        <title>Trò chuyện</title>
      </Head>
      <div className={`chat__user ${isShowContent ? "is-hide" : ""}`}>
        <ChatUsers threads={chatThreads} onChangeThread={handleChangeThreadChat}></ChatUsers>
      </div>
      <div className={`chat__content ${isShowContent ? "is-show" : ""}`}>
        <ChatContent 
          backToChat={toggleShowContent}
          scrollToBottom={scrollToBottom} 
          messageEndRef={messageEndRef} 
          userChatNow={userChatNow} 
          thread={chatThreadNow} 
          content={chatContent} 
          setContent={setChatContent} 
          setThread={setChatThreads} />
      </div>
    </div>
  )
}
