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
    title: "Kh??m ph??",
    items: [
      {
        title: "B??i vi???t m???i nh???t",
        icon: FiHome,
        link: "/",
      },
      {
        title: "H???i ????p",
        icon: HiOutlineChatAlt2,
        link: "/questions",
      },
    ],
  },
]
const menuAuth = [
  ...menuNotAuth,
  {
    title: "Chia s???",
    items: [
      {
        title: "T???o b??i vi???t",
        icon: MdOutlinePostAdd,
        link: "/post/create",
      },
      {
        title: "T???o c??u h???i th???o lu???n",
        icon: AiOutlineQuestionCircle,
        link: "/question/create",
      },
    ],
  },
  {
    title: "Tr?? chuy???n",
    items: [
      {
        title: "Nh???n tin",
        icon: TbMessageCircle2,
        link: "/chat",
      },
    ],
  },
  {
    title: "Qu???n l??",
    items: [
      {
        title: "B??i vi???t c???a t??i",
        icon: MdOutlineArticle,
        link: "/my-post",
      },
      {
        title: "C??u h???i c???a t??i",
        icon: VscQuestion,
        link: "/my-question",
      },
      {
        title: "B??i vi???t ???? l??u",
        icon: BsBookmark,
        link: "/saved",
      },
    ],
  },
]

const menuAdmin = [
  ...menuNotAuth,
  {
    title: "Tr?? chuy???n",
    items: [
      {
        title: "Nh???n tin",
        icon: TbMessageCircle2,
        link: "/chat",
      },
    ],
  },
  {
    title: "Qu???n tr???",
    items: [
      {
        title: "Qu???n l?? ng?????i d??ng",
        icon: FiUsers,
        link: "/manage/users",
      },
      {
        title: "Qu???n l?? b??i vi???t",
        icon: HiOutlineNewspaper,
        link: "/manage/posts",
      },
      {
        title: "Qu???n l?? c??u h???i",
        icon: BsQuestionSquare,
        link: "/manage/questions",
      },
      {
        title: "B??o c??o ng?????i d??ng",
        icon: MdOutlineReport,
        link: "/manage/reports",
      },
    ],
  },
]