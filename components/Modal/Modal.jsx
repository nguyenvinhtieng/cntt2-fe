import { MdClose } from 'react-icons/md'
import Overlay from '../Overlay/Overlay.jsx'

export default function Modal({ isShow = false, handleCloseModal, size, title, handleSubmit, danger, children}) {
  return (
    <>
      <Overlay handleClick={handleCloseModal} isShow={isShow}></Overlay>
      <div className={`modal ${size} ${isShow ? "is-show" : ""}`}>
        <div className="modal__head">
          <h3 className="modal__title">{title}</h3>
          <span className="modal__close" onClick={handleCloseModal}><MdClose></MdClose></span>
        </div>
        <div className="modal__body scroll-css">
          {/* Modal content */}
          { children }
        </div>
        <div className="modal__footer">
          {/* Modal footer */}
          <button className="modal__btn" onClick={handleCloseModal}>Hủy bỏ</button>
          <button className={`modal__btn modal__btn--${danger ? "secondary" : "primary"}`} onClick={handleSubmit}>{danger ? "Xác nhận" : "Lưu" }</button>
        </div>
      </div>
    </>
  )
}
