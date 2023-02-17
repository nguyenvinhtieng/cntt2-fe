import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { AiFillGithub, AiOutlineGlobal, AiOutlineInstagram, AiOutlineLinkedin } from 'react-icons/ai'
import { BsFacebook } from 'react-icons/bs'
import { CiTwitter } from 'react-icons/ci'
import { FaTimes } from 'react-icons/fa'
import { FiEdit2 } from 'react-icons/fi'
import { IoAddSharp } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import InputImage from '~/components/InputImage/InputImage'
import Modal from '~/components/Modal/Modal'
import PostItemShort from '~/components/PostItemShort/PostItemShort'
import TooltipMenu from '~/components/TooltipMenu/TooltipMenu'
import useOnClickOutside from '~/hooks/useClickOutside'
import { changeAvatar, userUpdate } from '~/redux/actions/userAction'
import displayToast from '~/utils/displayToast'
import { postMethod } from '~/utils/fetchData'
import fetchUser from '~/utils/fetchUser'

export default function ProfilePage() {
    const router = useRouter()
    const dispatch = useDispatch();
    const [user, setUser ] = React.useState(null)
    const [isMe, setIsMe] = React.useState(false)
    const [editingMode, setEditingMode] = React.useState(false)
    const [isShowModalChangeAvatar, setIsShowModalChangeAvatar] = React.useState(false)
    const auth = useSelector(state => state.auth)
    const { profileSlug } = router.query
    const [avatar, setAvatar] = React.useState(null)
    const nameRef = React.useRef(null)
    const profileSlugRef = React.useRef(null)
    const [userOld, setUserOld] = React.useState(null)
    const [menuSocial, setMenuSocial] = React.useState([])
    const [typeSocialAdd, setTypeSocialAdd] = React.useState(null)
    const [showModalAddSocial, setShowModalAddSocial] = React.useState(false)
    const [showMenuSocial, setShowMenuSocial] = React.useState(false)
    const [showModalAddTag, setShowModalAddTag] = React.useState(false)
    const [posts, setPosts] = React.useState([])
    const menuSocialRef = React.useRef(null)
    const inputLinkSocialRef = React.useRef(null)
    const inputTagRef = React.useRef(null)
    React.useEffect(() => {
        if(profileSlug && !profileSlug.startsWith("@")) {
            router.push("/")
        }
        if(auth.isAuthenticated && auth.user.profileSlug === profileSlug) {
            setIsMe(true)
            setUser(auth.user)
        }else {
            if(profileSlug) {
                fetchUser(profileSlug.slice(1)).then(res => {
                    setUser(res)
                    if(res.profileSlug === auth.user.profileSlug) {
                        setIsMe(true)
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }, [auth, profileSlug])

    // fetch post user
    React.useEffect(() => {
        if(user) {
            postMethod("post/get-post-user", {user_id: user._id})
                .then(res => {
                    const {data} = res
                    if(data.status) {
                        setPosts(data.posts)
                    }
                })
                .catch(err => console.log(err))
        }
    }, [user])

    const toggleModalChangeAvatar = () => setIsShowModalChangeAvatar(!isShowModalChangeAvatar)
    const onChangeImage = (imageList, _) =>  setAvatar(imageList);
    const handleChangeAvatar = () => {
        if(!avatar || avatar.length <= 0) {
            displayToast("warning", "Vui lòng chọn ảnh");
            return
        }
        const formData = new FormData();
        let avatarBlob = new Blob([avatar[0].file], { type: avatar[0].file.type });
        formData.append("avatar", avatarBlob, avatar[0].file.name);
        dispatch(changeAvatar(formData))
        setAvatar(null)
        toggleModalChangeAvatar()
    }

    const toggleEditingMode = () => setEditingMode(!editingMode)
    const startEditing = () => {
        setUserOld({...user})
        toggleEditingMode()
    }
    const updateInfo = () => {
        let name = nameRef.current.textContent.trim()
        if(name === "") {
            displayToast("warning", "Vui lòng nhập tên")
            return
        }
        if(profileSlugRef.current.textContent.trim() === "") {
            displayToast("warning", "Vui lòng nhập profile slug")
            return
        }
        const userUpdateInfo = {
            ...user,
            fullname: name,
            profileSlug: profileSlugRef.current.textContent.trim(),
        }
        dispatch(userUpdate(userUpdateInfo))
        toggleEditingMode()
    }
    const toggleModalAddSocial = () => {
        setShowModalAddSocial(!showModalAddSocial)
    }
    const toggleShowMenuSocial = () => setShowMenuSocial(!showMenuSocial)
    const addSocial = (type) => {
        setTypeSocialAdd(type)
        toggleModalAddSocial()
        toggleShowMenuSocial()
    }
    const saveSocial = () => {
        let link = inputLinkSocialRef.current.value
        if(!link) {
            displayToast("warning", "Vui lòng nhập link")
            return
        }
        if(!link.startsWith("http")) {
            displayToast("warning", "Link không hợp lệ");
            return;
        }
        setUser({...user, [typeSocialAdd]: link})
        toggleModalAddSocial()
        inputLinkSocialRef.current.value = ""
    }

    const deleteSocial = (type) => {
        setUser({...user, [type]: null})
    }
    const saveTag = () => {
        let tag = inputTagRef.current.value
        if(!tag) {
            displayToast("warning", "Vui lòng nhập tag")
            return
        }
        if(user.interesting.includes(tag)) {
            displayToast("warning", "Bạn đã nhập tag này rồi")
            return
        }
        if(tag.length > 10) {
            displayToast("warning", "Tag không được quá 10 ký tự")
            return
        }
        setUser({...user, interesting: [...user.interesting, tag]})
        toggleModalAddTag()
        inputTagRef.current.value = ""
    }
    const cancelUpdate = () => {
        setUser({...userOld})
        toggleEditingMode()
    }

    const toggleModalAddTag = () => setShowModalAddTag(!showModalAddTag)
    const deleteTag = (index) => {
        let interesting = [...user.interesting]
        interesting.splice(index, 1)
        setUser({...user, interesting})
    }
    useEffect(()=> {
        let menuSocialTemp = []
        if(user && !user.github) {
            menuSocialTemp.push({
                title: "Github",
                Icon: AiFillGithub,
                clickAction: () => addSocial("github")
            })
        }
        if(user && !user.facebook) {
            menuSocialTemp.push({
                title: "Facebook",
                Icon: BsFacebook,
                clickAction: () => addSocial("facebook")
            })
        }
        if(user && !user.twitter) {
            menuSocialTemp.push({
                title: "Twitter",
                Icon: CiTwitter,
                clickAction: () => addSocial("twitter")
            })
        }
        if(user && !user.linkedin) {
            menuSocialTemp.push({
                title: "Linkedin",
                Icon: AiOutlineLinkedin,
                clickAction: () => addSocial("linkedin")
            })
        }
        if(user && !user.instagram) {
            menuSocialTemp.push({
                title: "Instagram",
                Icon: AiOutlineInstagram,
                clickAction: () => addSocial("instagram")
            })
        }
        if(user && !user.website) {
            menuSocialTemp.push({
                title: "Website",
                Icon: AiOutlineGlobal,
                clickAction: () => addSocial("website")
            })
        }
        setMenuSocial(menuSocialTemp)
    }, [user])

    useOnClickOutside(menuSocialRef , ()=> setShowMenuSocial(false))
    
    return (
    <div className='profilePage'>
        <Head>
            <title>{"Trang cá nhân của " + user?.fullname ||"Trang cá nhân"}</title>
        </Head>
        {/* Modal change avatar */}
        <Modal title="Đổi ảnh đại diện" isShow={isShowModalChangeAvatar} handleCloseModal={toggleModalChangeAvatar} size="sm" handleSubmit={handleChangeAvatar}>
            <InputImage images={avatar} onChangeImage={onChangeImage}></InputImage>
        </Modal>
        {/* Modal add social */}
        <Modal title="Thêm mạng xã hội" isShow={showModalAddSocial} handleCloseModal={toggleModalAddSocial} size="sm" handleSubmit={saveSocial}>
            <div className="input__wrapper">
            <label htmlFor="" className="input__label">Nhập đường liên kết</label>
            <input type="text" placeholder={`Nhập đường liên kết đến trang ${typeSocialAdd} của bạn`} ref={inputLinkSocialRef}/>
            </div>
        </Modal>

        {/* Modal Add tag */}
        <Modal title="Thêm thẻ" isShow={showModalAddTag} handleCloseModal={toggleModalAddTag} size="sm" handleSubmit={saveTag}>
            <div className="input__wrapper">
            <label htmlFor="" className="input__label">Nhập thẻ</label>
            <input type="text" placeholder="Nhập thẻ" ref={inputTagRef}/>
            </div>
        </Modal>
        {user && 
        <>
            <div className="profilePage__head">
                <div className="profilePage__head--avatar">
                    <div className="avatar avatar__md">
                        <img src={user.avatar || "/default.png"} alt="User avatar" />
                    </div>
                    {isMe && 
                        <div className="profilePage__head--changeAvatar" onClick={toggleModalChangeAvatar}>
                            <span className="ico"><FiEdit2></FiEdit2></span>
                            <span>Đổi ảnh đại diện</span>
                        </div>
                    }
                </div>
                <div className="profilePage__head--info">
                    <div className="name" contentEditable={editingMode} suppressContentEditableWarning={true}ref={nameRef}>{user.fullname}</div>
                    <div className="sub">@ <span ref={profileSlugRef}>{user.profileSlug}</span></div>
                    <div className="join">Tham gia vào ngày {moment(user.createdAt).format("LLL")}</div>
                    <ul className="social">
                        {user.github && <li className='social__item'>
                            {editingMode && <span className="social__item--del" onClick={() => deleteSocial("github")}><FaTimes></FaTimes></span>}
                            <a href={user.github} target="_blank"><AiFillGithub></AiFillGithub></a></li>}
                        {user.facebook && <li className='social__item'>
                            {editingMode && <span className="social__item--del" onClick={() => deleteSocial("facebook")}><FaTimes></FaTimes></span>}
                            <a href={user.facebook} target="_blank"><BsFacebook></BsFacebook></a></li>}
                        {user.twitter && <li className='social__item'>
                            {editingMode && <span className="social__item--del" onClick={() => deleteSocial("twitter")}><FaTimes></FaTimes></span>}
                            <a href={user.twitter} target="_blank"><CiTwitter></CiTwitter></a></li>}
                        {user.linkedin && <li className='social__item'>
                            {editingMode && <span className="social__item--del" onClick={() => deleteSocial("linkedin")}><FaTimes></FaTimes></span>}
                            <a href={user.linkedin} target="_blank"><AiOutlineLinkedin></AiOutlineLinkedin></a></li>}
                        {user.instagram && <li className='social__item'>
                            {editingMode && <span className="social__item--del" onClick={() => deleteSocial("instagram")}><FaTimes></FaTimes></span>}
                            <a href={user.instagram} target="_blank"><AiOutlineInstagram></AiOutlineInstagram></a></li>}
                        {user.website && <li className='social__item'>
                            {editingMode && <span className="social__item--del" onClick={() => deleteSocial("website")}><FaTimes></FaTimes></span>}
                            <a href={user.website} target="_blank"><AiOutlineGlobal></AiOutlineGlobal></a></li>}
                        {editingMode && menuSocial.length > 0 && 
                        <li className='social__add' data-tip="Thêm liên kết xã hội" ref={menuSocialRef}>
                            <span className="social__add--btn" onClick={toggleShowMenuSocial}>
                                <IoAddSharp></IoAddSharp>
                            </span>
                            {menuSocial.length > 0 && <TooltipMenu isShow={showMenuSocial} menu={menuSocial}></TooltipMenu>}
                        </li>
                        }
                    </ul>
                </div>
                {auth.user && user.profileSlug != auth?.user?.profileSlug && <Link href={`/chat?user=${user.profileSlug}`}>
                    <div className="profilePage__head--chat">
                        Nhắn tin
                    </div>
                </Link>
                }
                {isMe && <>
                    {editingMode && <div className="profilePage__head--save" data-tip="Lưu thông tin" onClick={updateInfo}>
                        Lưu thông tin
                    </div>}
                    {editingMode && <div className="profilePage__head--cancel" data-tip="Hủy bỏ" onClick={cancelUpdate}>
                        Hủy bỏ
                    </div>}
                    {!editingMode && <div className="profilePage__head--update" data-tip="Cập nhật thông tin cá nhân" onClick={startEditing}>
                        <FiEdit2></FiEdit2>
                    </div>}
                </>}
            </div>
            <div className="profilePage__content">
                <div className="profilePage__content--interesting">
                    <h2>Hứng thú với</h2>
                    <ul className="tag-list">
                        {user.interesting.map((tag, index) => (
                            <li key={index} className="tag-item">
                                {tag}
                                {editingMode && <span className="tag-item__delete" onClick={()=>deleteTag(index)}>
                                    <FaTimes></FaTimes>
                                </span>}
                            </li>
                        ))}
                        {user.interesting.length === 0 && !editingMode && <li className="tag-item">Chưa có</li>}
                        {editingMode && user.interesting.length < 5 && <li className='tag-item__add' onClick={toggleModalAddTag}>
                            <IoAddSharp></IoAddSharp>
                        </li>}
                    </ul>
                </div>
                <div className="profilePage__content--post">
                    <h2>Bài viết</h2>
                    {posts.length === 0 && <p>Không có bài viết nào</p>}
                    {posts.length > 0 && posts.map((post, index) => {
                        return <PostItemShort key={index} post={post} />
                    })}
                </div>
            </div>
        </>
        }
    </div>
  )
}
