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
            displayToast("success", "X??a b??o c??o th??nh c??ng")
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
        <title>Qu???n l?? b??o c??o</title>
      </Head>
        <Modal title="X??a b??o c??o ph???n h???i" size="sm" danger={true} handleCloseModal={toggleModalDelete} isShow={isShowModalDelete} handleSubmit={deleteReport}>
            B???n c?? ch???c mu???n x??a b??o c??o n??y kh??ng?
        </Modal>
    <h2 className="managePage__heading" >Qu???n l?? b??o c??o</h2>
    {/* <span className="filter" onClick={toggleFilter}>
        <span className="filter__ttl">L???c d??? li???u</span>
        <span className="filter__ico">
            <VscSettings></VscSettings>
        </span>
    </span> */}
    {/* <div className={`managePage__filter ${isShowFilter ? "is-show" : ""}`}>
        <div className="managePage__filter__search">
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">T??n</label>
                <input type="text" placeholder="T??n ng?????i d??ng" ref={nameRef}/>
            </div>
            <div className="input__wrapper">
                <label htmlFor="" className="input__label">Lo???i b??o c??o</label>
                <Select initialVal="T???t c???" onChangeFunc={handleChangeStatus} options={[{title: "B??? ch???n", value: "block"},{title: "??ang ho???t ?????ng", value: "active"},{title: "T???t c???", value: ""}]}></Select>
            </div>
            <button className="button" onClick={startFilter}>L???c</button>
            <button className="button button--danger" onClick={deleteFilter}>Xo?? b??? l???c</button>
        </div>
    </div> */}
    <div className="managePage__num">Trang {currentPage}/{totalPage}</div>
    <div className="managePage__content">
        <div className="table__wrapper">
            <table className="table">
            <thead>
                <tr>
                <th>STT</th>
                <th>Ng?????i b??o c??o</th>
                <th>Th???i gian</th>
                <th>Lo???i</th>
                <th>L?? do</th>
                <th>Chi ti???t</th>
                <th>Thao t??c</th>
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
                      {report.type == "post" ? "B??i vi???t" : "B??nh lu???n"}
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
                        <div className="table__actionsItem delete" data-tip="X??a" onClick={() => showModalConfirmDelete(report?._id)}>
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
            <span className="prevPage" data-tip="Trang tr?????c" onClick={()=>prevPage()}>
                <AiOutlineLeft></AiOutlineLeft>
            </span>
            }
            {currentPage < totalPage && 
                <span className="nextPage" data-tip="Trang k???" onClick={()=>nextPage()}><AiOutlineRight></AiOutlineRight></span>
            }
        </div> */}
      </div>
    </div>
  );
}
