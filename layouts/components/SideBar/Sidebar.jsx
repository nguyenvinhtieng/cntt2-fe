import Link from 'next/link'
import React, { useEffect } from 'react'
import { FiHome, FiUsers } from 'react-icons/fi'
import { HiOutlineChatAlt2, HiOutlineNewspaper, HiOutlineUsers } from 'react-icons/hi'
import { MdOutlinePostAdd, MdOutlineArticle, MdOutlineReport } from 'react-icons/md'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { GrArticle } from 'react-icons/gr'
import { TbMessageCircle2 } from 'react-icons/tb'
import { BsBookmark, BsInfoLg, BsQuestionSquare } from 'react-icons/bs'
import { VscQuestion } from 'react-icons/vsc'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
export default function Sidebar({ isOpen , toggle}) {
  const [menu, setMenu] = React.useState([]);
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const handleClickLink = (e, link) => {
    e.preventDefault();
    router.push(link);
    // check window with is mobile
    if (window.innerWidth < 768) {
      toggle();
    }
  }
  useEffect(() => {
    if (!auth?.isAuthenticated) {
      setMenu(menuNotAuth);
    } else if (auth?.isAuthenticated && auth?.user?.role == "admin") {
      setMenu(menuAdmin);
    }else {
      setMenu(menuAuth);
    }
  }, [auth]);

  return (
    <aside className={`sidebar scroll-css ${isOpen ? "is-open" : ""}`}>
      <div className="sidebar__wrapper">
        {menu.length > 0 && menu.map((item, index) => (
          <React.Fragment key={item.title}>
            <p className="sidebar__ttl">{item.title}</p>
            <ul className="sidebar__menu">
              {item.items.map((i, index) => (
                <li className='sidebar__menu--item' key={i.title}>
                  <a href={i.link} onClick={(e)=>handleClickLink(e, i.link)}>
                    <span className="sidebar__menu--icon"><i.icon></i.icon></span>
                    <span className="sidebar__menu--ttl">{i.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    </aside>
  )
}


const menuNotAuth = [
  {
    title: "Khám phá",
    items: [
      {
        title: "Bài viết mới nhất",
        icon: FiHome,
        link: "/",
      },
      {
        title: "Hỏi đáp",
        icon: HiOutlineChatAlt2,
        link: "/questions",
      },
    ],
  },
]
const menuAuth = [
  ...menuNotAuth,
  {
    title: "Chia sẻ",
    items: [
      {
        title: "Tạo bài viết",
        icon: MdOutlinePostAdd,
        link: "/post/create",
      },
      {
        title: "Tạo câu hỏi thảo luận",
        icon: AiOutlineQuestionCircle,
        link: "/question/create",
      },
    ],
  },
  {
    title: "Trò chuyện",
    items: [
      {
        title: "Nhắn tin",
        icon: TbMessageCircle2,
        link: "/chat",
      },
    ],
  },
  {
    title: "Quản lý",
    items: [
      {
        title: "Bài viết của tôi",
        icon: MdOutlineArticle,
        link: "/my-post",
      },
      {
        title: "Câu hỏi của tôi",
        icon: VscQuestion,
        link: "/my-question",
      },
      {
        title: "Bài viết đã lưu",
        icon: BsBookmark,
        link: "/saved",
      },
    ],
  },
]

const menuAdmin = [
  ...menuNotAuth,
  {
    title: "Trò chuyện",
    items: [
      {
        title: "Nhắn tin",
        icon: TbMessageCircle2,
        link: "/chat",
      },
    ],
  },
  {
    title: "Quản trị",
    items: [
      {
        title: "Quản lý người dùng",
        icon: FiUsers,
        link: "/manage/users",
      },
      {
        title: "Quản lý bài viết",
        icon: HiOutlineNewspaper,
        link: "/manage/posts",
      },
      {
        title: "Quản lý câu hỏi",
        icon: BsQuestionSquare,
        link: "/manage/questions",
      },
      {
        title: "Báo cáo người dùng",
        icon: MdOutlineReport,
        link: "/manage/reports",
      },
    ],
  },
]