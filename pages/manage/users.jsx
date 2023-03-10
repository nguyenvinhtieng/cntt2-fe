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
            <title>Qu???n l?? ng?????i d??ng</title>
        </Head>
        <Modal title="Kh??a t??i kho???n ng???i d??ng" size="sm" danger={true} handleCloseModal={toggleModalConfirmBlock} isShow={isShowModalConfirmBlock} handleSubmit={blockUserHandler}>
            B???n c?? ch???c ch???n mu???n kh??a t??i kho???n ng?????i d??ng n??y kh??ng?
        </Modal>
        <Modal title="M??? kh??a t??i kho???n ng???i d??ng" size="sm" danger={true} handleCloseModal={toggleModalConfirmUnBlock} isShow={isShowModalConfirmUnBlock} handleSubmit={unBlockUserHandler}>
            B???n c?? ch???c ch???n mu???n m??? kh??a t??i kho???n ng?????i d??ng n??y kh??ng?
        </Modal>
    <h2 className="managePage__heading" >Danh s??ch ng?????i d??ng</h2>
    <span className="filter" onClick={toggleFilter}>
        <span className="filter__ttl">L???c d??? li???u</span>
        <span className="filter__ico">
            <VscSettings></VscSettings>
        </span>
    </span>
    <div className={`managePage__filter ${isShowFilter ? "is-show" : ""}`}>
        <div className="managePage__filter__search">
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">T??n</label>
                <input type="text" placeholder="T??n ng?????i d??ng" ref={nameRef}/>
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Email</label>
                <input type="text" placeholder="Email ng?????i d??ng" ref={emailRef}/>
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Tr???ng th??i t??i kho???n</label>
                <Select initialVal="T???t c???" onChangeFunc={handleChangeStatus} options={[{title: "B??? ch???n", value: "block"},{title: "??ang ho???t ?????ng", value: "active"},{title: "T???t c???", value: ""}]}></Select>
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
                <th>T??n ng?????i d??ng</th>
                <th>???nh ?????i di???n</th>
                <th>Email</th>
                <th>Ng??y t???o</th>
                <th>Tr???ng th??i</th>
                <th>Thao t??c</th>
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
                                {user?.status === "active" ? "??ang ho???t ?????ng" : "B??? ch???n"}
                            </span>
                        </td>
                        <td>
                            <div className="table__actions">
                                <Link href={`/@${user?.profileSlug}`}>
                                    <div className="table__actionsItem view" data-tip="Xem th??ng tin ng?????i d??ng">
                                        <span className="table__action--ico"><AiOutlineEye></AiOutlineEye></span>
                                    </div>
                                </Link>
                                { user?.status === "active" ?
                                    <div className="table__actionsItem delete" data-tip="Kh??a t??i kho???n ng?????i d??ng" onClick={() => showModalConfirmBlock(user?._id)}>
                                        <span className="table__action--ico"><BiBlock></BiBlock></span>
                                    </div> : 
                                    <div className="table__actionsItem edit" data-tip="M??? kh??a t??i kho???n ng?????i d??ng" onClick={() => showModalConfirmUnBlock(user?._id)}>
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
            <span className="prevPage" data-tip="Trang tr?????c" onClick={()=>prevPage()}>
                <AiOutlineLeft></AiOutlineLeft>
            </span>
            }
            {currentPage < totalPage && 
                <span className="nextPage" data-tip="Trang k???" onClick={()=>nextPage()}><AiOutlineRight></AiOutlineRight></span>
            }
            

        </div>
      </div>
    </div>
  );
}
