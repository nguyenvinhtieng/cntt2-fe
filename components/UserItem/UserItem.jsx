import moment from 'moment'
import Link from 'next/link'
import React from 'react'
export default function UserItem({user, time}) {
  const [isShow, setIsShow] = React.useState(false)
  const timerRef = React.useRef(null)
  const onMouseEnterHandler = () => {
    timerRef.current = setTimeout(() => {
      setIsShow(true)
    }, 500)
  }
  const onMouseLeaveHandler = () => {
    clearTimeout(timerRef.current)
    setIsShow(false)
  }
  return (
    <>
      <div className="user-item"  
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
        >
        <Link href={`/@${user?.profileSlug}`}>
        <span className="user-item__wrapper">
          <span className="avatar avatar__sm">
            <img src={user?.avatar || "/default.png"} alt="User avatar" />
          </span>
          <span className="user-item__info">
            <span className="user-item__name">{user?.fullname || "Anonymous"}
              {user?.role == "admin" && <span className="tagvip">Admin</span>}
            </span>
            {time && <time className="user-item__time">{moment(time).startOf("hours").fromNow()}</time>}
          </span>
        </span>
        </Link>
        <div className={`user-item__popup ${isShow ? "is-show" : ""}`}>
          <Link href={`/@${user?.profileSlug}`}>
            <span className="user-item__wrapper">
              <span className="avatar avatar__sm">
                <img src={user?.avatar || "/default.png"} alt="User avatar" />
              </span>
              <span className="user-item__info">
                <span className="user-item__name">{user?.fullname || "Anonymous"}
                {user?.role == "admin" && <span className="tagvip">Admin</span>}</span>
              </span>
            </span>
          
            <time className="time">
              Tham gia vào ngày {moment(user?.createdAt).subtract(10, 'days').calendar()}
            </time>
            <p className='interes'>Hứng thú với</p>
            <ul className="tag-list">
              {user?.interesting?.map((i, index) => 
                <li className='tag-item' key={i}>{i}</li>
              )}
              {user?.interesting?.length == 0 && <li className='tag-item'>Chưa có</li>}
            </ul>
          </Link>
        </div>
      </div>
    </>
  )
}
