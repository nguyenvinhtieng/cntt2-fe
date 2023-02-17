export default function Overlay({ isShow, handleClick }) {
  return (
    <span onClick={handleClick} className={`overlay ${isShow ? "is-show" : ""}`}></span>
  )
}
