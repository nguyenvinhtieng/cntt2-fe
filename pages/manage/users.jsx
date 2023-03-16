import React, { useEffect } from "react";
import moment from "moment";
import { AiOutlineDoubleRight, AiOutlineEye, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { BiBlock } from "react-icons/bi";
import { VscSettings } from "react-icons/vsc";
import ZoomImage from "~/components/ZoomImage/ZoomImage";
import { getMethod, postMethod } from "~/utils/fetchData";
import Link from "next/link";
import Modal from "~/components/Modal/Modal";
import displayToast from "~/utils/displayToast";
import { BsFillUnlockFill } from "react-icons/bs";
import Select from "~/components/Select/Select";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function ManageUserPage() {
    const [ isShowFilter, setIsShowFilter ] = React.useState(false);
    const toggleFilter = () => setIsShowFilter(!isShowFilter);
    const [usersFetch, setUsersFetch] = React.useState([]);
    const [usersFilter, setUsersFilter] = React.useState([]);
    const [usersShow, setUsersShow] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPage, setTotalPage] = React.useState(1);

    const [isShowModalConfirmBlock, setIsShowModalConfirmBlock] = React.useState(false);
    const [isShowModalConfirmUnBlock, setIsShowModalConfirmUnBlock] = React.useState(false);
    const toggleModalConfirmBlock = () => setIsShowModalConfirmBlock(!isShowModalConfirmBlock);
    const toggleModalConfirmUnBlock = () => setIsShowModalConfirmUnBlock(!isShowModalConfirmUnBlock);
    const userSelectedId = React.useRef(null);
    const nameRef = React.useRef(null);
    const emailRef = React.useRef(null);
    const statusRef = React.useRef(null);
    const router = useRouter();
    const auth = useSelector(state => state.auth);
    const fetchUsers = () => {
        getMethod("manage/users")
            .then(res => {
                const {data} = res;
                // console.log("res: ", res)
                if(data.status) {
                    console.log("data: ", data)
                    let userList = data.users.filter(u => u.role != "admin");
                    setUsersFetch(userList)
                    setUsersFilter(userList)
                    setUsersShow(userList.slice(0, 10))
                    setTotalPage(Math.ceil(userList.length / 10))
                    setCurrentPage(1)
                }
            })
            .catch(err => console.log(err))
    }
    
    const showModalConfirmBlock = (user_id) => {
        userSelectedId.current = user_id;
        toggleModalConfirmBlock();
    }
    const blockUserHandler = async () => {
        let userId = userSelectedId.current;
        if(!userId) return;
        let res = await postMethod("manage/change-status-user", {user_id: userId, status: "block"})
        const {data} = res;
        if(data.status) {
            let newUsers = usersFilter.map(user => {
                if(user._id === userId) {
                    user.status = "block"
                }
                return user;
            })
            setUsersFetch(newUsers)

            let newUsersShow = usersShow.map(user => {
                if(user._id === userId) {
                    user.status = "block"
                }
                return user;
            })
            setUsersShow(newUsersShow)

            let newUserFilter = usersFilter.map(user => {
                if(user._id === userId) {
                    user.status = "block"
                }
                return user;
            })
            setUsersFilter(newUserFilter)
        }else {
            displayToast("error", data.message)
        }
        toggleModalConfirmBlock();
    }
    const showModalConfirmUnBlock = (user_id) => {
        userSelectedId.current = user_id;
        toggleModalConfirmUnBlock();
    }
    const unBlockUserHandler = async () => {
        let userId = userSelectedId.current;
        if(!userId) return;
        let res = await postMethod("manage/change-status-user", {user_id: userId, status: "active"})
        const {data} = res;
        if(data.status) {
            let newUsers = usersFilter.map(user => {
                if(user._id === userId) {
                    user.status = "active"
                }
                return user;
            })
            setUsersFetch(newUsers)

            let newUserShow = usersShow.map(user => {
                if(user._id === userId) {
                    user.status = "active"
                }
                return user;
            })
            setUsersShow(newUserShow)

            let newUserFilter = usersFilter.map(user => {
                if(user._id === userId) {
                    user.status = "active"
                }

                return user;
            })
            setUsersFilter(newUserFilter)
        }else {
            displayToast("error", data.message)
        }
        toggleModalConfirmUnBlock();
    }

    const nextPage = () => {
        let page = currentPage + 1;
        if(page > totalPage) return;
        let start = (page - 1) * 10;
        let end = start + 10;
        setUsersShow(usersFilter.slice(start, end))
        setCurrentPage(page)
    }
    const prevPage = () => {
        let page = currentPage - 1;
        if(page < 1) return;
        let start = (page - 1) * 10;
        let end = start + 10;
        setUsersShow(usersFilter.slice(start, end))
        setCurrentPage(page)
    }
    const handleChangeStatus = (val) => {
        statusRef.current = val;
    }
    
    const startFilter = () => {
        let name = nameRef.current.value;
        let email = emailRef.current.value;
        let status = statusRef.current;
        let newUser = [...usersFetch]
        if(name) {
            newUser = newUser.filter(user => user.fullname.toLowerCase().includes(name.toLowerCase()))
        }
        if(email) {
            newUser = newUser.filter(user => user.email.toLowerCase().includes(email.toLowerCase()))
        }
        if(status) {
            newUser = newUser.filter(user => user.status === status)
        }
        setUsersFilter(newUser)
        setUsersShow(newUser.slice(0, 10))
        setTotalPage(Math.ceil(newUser.length / 10))
        setCurrentPage(1)
    }
    const deleteFilter = () => {
        nameRef.current.value = "";
        emailRef.current.value = "";
        statusRef.current = "";
        setUsersFilter(usersFetch)
        setUsersShow(usersFetch.slice(0, 10))
        setTotalPage(Math.ceil(usersFetch.length / 10))
        setCurrentPage(1)
    }
    useEffect(()=> {
        fetchUsers()
    }, [])
    useEffect(()=> {
        if(auth?.user?.role !== "admin") {
            router.push("/")
        }
    }, [auth.user])

return (
    <div className="managePage">
        <Head>
            <title>Quản lý người dùng</title>
        </Head>
        <Modal title="Khóa tài khoản ngời dùng" size="sm" danger={true} handleCloseModal={toggleModalConfirmBlock} isShow={isShowModalConfirmBlock} handleSubmit={blockUserHandler}>
            Bạn có chắc chắn muốn khóa tài khoản người dùng này không?
        </Modal>
        <Modal title="Mở khóa tài khoản ngời dùng" size="sm" danger={true} handleCloseModal={toggleModalConfirmUnBlock} isShow={isShowModalConfirmUnBlock} handleSubmit={unBlockUserHandler}>
            Bạn có chắc chắn muốn mở khóa tài khoản người dùng này không?
        </Modal>
    <h2 className="managePage__heading" >Danh sách người dùng</h2>
    <span className="filter" onClick={toggleFilter}>
        <span className="filter__ttl">Lọc dữ liệu</span>
        <span className="filter__ico">
            <VscSettings></VscSettings>
        </span>
    </span>
    <div className={`managePage__filter ${isShowFilter ? "is-show" : ""}`}>
        <div className="managePage__filter__search">
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Tên</label>
                <input type="text" placeholder="Tên người dùng" ref={nameRef}/>
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Email</label>
                <input type="text" placeholder="Email người dùng" ref={emailRef}/>
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Trạng thái tài khoản</label>
                <Select initialVal="Tất cả" onChangeFunc={handleChangeStatus} options={[{title: "Bị chặn", value: "block"},{title: "Đang hoạt động", value: "active"},{title: "Tất cả", value: ""}]}></Select>
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
                <th>Tên người dùng</th>
                <th>Ảnh đại diện</th>
                <th>Email</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {usersShow.length > 0 && usersShow.map((user, index) => (
                    <tr key={user._id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td>{user.fullname}</td>
                        <td>
                            <ZoomImage>
                                <div className="avatar avatar__sm">
                                    <img src={user?.avatar || "/default.png"} alt="" />
                                </div>
                            </ZoomImage>
                        </td>
                        <td>
                            <a href={`mailto:${user?.email}`}>{user?.email}</a>
                        </td>
                        <td>{moment(user?.createdAt).subtract(10, 'days').calendar()}</td>
                        <td>
                            <span className={user?.status}>
                                {user?.status === "active" ? "Đang hoạt động" : "Bị chặn"}
                            </span>
                        </td>
                        <td>
                            <div className="table__actions">
                                <Link href={`/@${user?.profileSlug}`}>
                                    <div className="table__actionsItem view" data-tip="Xem thông tin người dùng">
                                        <span className="table__action--ico"><AiOutlineEye></AiOutlineEye></span>
                                    </div>
                                </Link>
                                { user?.status === "active" ?
                                    <div className="table__actionsItem delete" data-tip="Khóa tài khoản người dùng" onClick={() => showModalConfirmBlock(user?._id)}>
                                        <span className="table__action--ico"><BiBlock></BiBlock></span>
                                    </div> : 
                                    <div className="table__actionsItem edit" data-tip="Mở khóa tài khoản người dùng" onClick={() => showModalConfirmUnBlock(user?._id)}>
                                        <span className="table__action--ico"><BsFillUnlockFill></BsFillUnlockFill></span>
                                    </div>
                                }
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className="managePage__pagination">
            {currentPage > 1 && totalPage > 1 && 
            <span className="prevPage" data-tip="Trang trước" onClick={()=>prevPage()}>
                <AiOutlineLeft></AiOutlineLeft>
            </span>
            }
            {currentPage < totalPage && 
                <span className="nextPage" data-tip="Trang kế" onClick={()=>nextPage()}><AiOutlineRight></AiOutlineRight></span>
            }
            

        </div>
      </div>
    </div>
  );
}
