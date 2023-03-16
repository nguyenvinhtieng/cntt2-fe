import React, { useEffect } from "react";
import moment from "moment";
import { AiOutlineDoubleRight, AiOutlineEye, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { BiBlock, BiTrashAlt } from "react-icons/bi";
import { VscSettings } from "react-icons/vsc";
import ZoomImage from "~/components/ZoomImage/ZoomImage";
import { getMethod, postMethod } from "~/utils/fetchData";
import Link from "next/link";
import Modal from "~/components/Modal/Modal";
import displayToast from "~/utils/displayToast";
import { BsFillUnlockFill } from "react-icons/bs";
import Select from "~/components/Select/Select";
import UserItem from "~/components/UserItem/UserItem";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function ManageReport() {
    const [ isShowFilter, setIsShowFilter ] = React.useState(false);
    const toggleFilter = () => setIsShowFilter(!isShowFilter);
    const [reportsFetch, setReportsFetch] = React.useState([]);
    const [reportsFilter, setReportsFilter] = React.useState([]);
    const [reportsShow, setReportsShow] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPage, setTotalPage] = React.useState(1);
    const reportIdSelectedRed = React.useRef();
    const [isShowModalDelete, setIsShowModalDelete] = React.useState(false);
    const router = useRouter();
    const auth = useSelector(state => state.auth);
    const toggleModalDelete = () => setIsShowModalDelete(!isShowModalDelete);

    const fetchReports = () => {
        getMethod("manage/reports")
            .then(res => {
                const {data} = res;
                if(data.status) {
                  setReportsFetch(data.reports)
                  setReportsFilter(data.reports)
                  setReportsShow(data.reports.slice(0, 10))
                  setCurrentPage(1)
                  setTotalPage(Math.ceil(data.reports.length / 10))
                }
            })
            .catch(err => console.log(err))
    }
    
    const deleteReport = async () => {
      postMethod("report/delete", {report_id: reportIdSelectedRed.current})
        .then(res => {
          const {data} = res;
          if(data.status) {
            displayToast("success", "Xóa báo cáo thành công")
            fetchReports();
          }
          toggleModalDelete();
        }
        )
        .catch(err => console.log(err))
    }
    const showModalConfirmDelete =(report_id) => {
      reportIdSelectedRed.current = report_id;
      toggleModalDelete();
    }
    useEffect(()=> {
      fetchReports()
    }, [])
    useEffect(()=> {
      if(auth?.user?.role !== "admin") {
          router.push("/")
      }
  }, [auth.user])

return (
    <div className="managePage">
      <Head>
        <title>Quản lý báo cáo</title>
      </Head>
        <Modal title="Xóa báo cáo phản hồi" size="sm" danger={true} handleCloseModal={toggleModalDelete} isShow={isShowModalDelete} handleSubmit={deleteReport}>
            Bạn có chắc muốn xóa báo cáo này không?
        </Modal>
    <h2 className="managePage__heading" >Quản lý báo cáo</h2>
    {/* <span className="filter" onClick={toggleFilter}>
        <span className="filter__ttl">Lọc dữ liệu</span>
        <span className="filter__ico">
            <VscSettings></VscSettings>
        </span>
    </span> */}
    {/* <div className={`managePage__filter ${isShowFilter ? "is-show" : ""}`}>
        <div className="managePage__filter__search">
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Tên</label>
                <input type="text" placeholder="Tên người dùng" ref={nameRef}/>
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Loại báo cáo</label>
                <Select initialVal="Tất cả" onChangeFunc={handleChangeStatus} options={[{title: "Bị chặn", value: "block"},{title: "Đang hoạt động", value: "active"},{title: "Tất cả", value: ""}]}></Select>
            </div>
            <button className="button" onClick={startFilter}>Lọc</button>
            <button className="button button--danger" onClick={deleteFilter}>Xoá bộ lọc</button>
        </div>
    </div> */}
    <div className="managePage__num">Trang {currentPage}/{totalPage}</div>
    <div className="managePage__content">
        <div className="table__wrapper">
            <table className="table">
            <thead>
                <tr>
                <th>STT</th>
                <th>Người báo cáo</th>
                <th>Thời gian</th>
                <th>Loại</th>
                <th>Lý do</th>
                <th>Chi tiết</th>
                <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {reportsShow?.length > 0 && reportsShow.map((report, index) => 
                  <tr key={report._id}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>
                      <UserItem user={report.reporter}></UserItem>
                    </td>
                    <td>
                      {moment(report.createdAt).format("DD/MM/YYYY")}
                    </td>
                    <td>
                      {report.type == "post" ? "Bài viết" : "Bình luận"}
                    </td>
                    <td>
                      {report.reason}
                    </td>
                    <td>
                      {report.reason_detail}
                    </td>
                    <td>
                      <div className="table__actions">
                        <Link href={report.link_to}>
                            <div className="table__actionsItem view" data-tip="Xem">
                                <span className="table__action--ico"><AiOutlineEye></AiOutlineEye></span>
                            </div>
                        </Link>
                        <div className="table__actionsItem delete" data-tip="Xóa" onClick={() => showModalConfirmDelete(report?._id)}>
                            <span className="table__action--ico"><BiTrashAlt></BiTrashAlt></span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
            </tbody>
            </table>
        </div>
        {/* <div className="managePage__pagination">
            {currentPage > 1 && totalPage > 1 && 
            <span className="prevPage" data-tip="Trang trước" onClick={()=>prevPage()}>
                <AiOutlineLeft></AiOutlineLeft>
            </span>
            }
            {currentPage < totalPage && 
                <span className="nextPage" data-tip="Trang kế" onClick={()=>nextPage()}><AiOutlineRight></AiOutlineRight></span>
            }
        </div> */}
      </div>
    </div>
  );
}
