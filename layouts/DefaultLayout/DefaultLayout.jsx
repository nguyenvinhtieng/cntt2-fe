import React from "react";
import Overlay from "~/components/Overlay/Overlay";
import Header from "~/layouts/components/Header/Header";
import Sidebar from "~/layouts/components/SideBar/Sidebar";
import { Montserrat } from '@next/font/google'
const montserrat = Montserrat({subsets: ['vietnamese']})

export default function DefaultLayout({ children }) {
  const [isShowSidebar, setIsShowSidebar] = React.useState(false);
  const toggleSidebar = () => setIsShowSidebar(!isShowSidebar);

  return (
    <div style={{fontFamily: montserrat.style.fontFamily}}>
      <Header toggleSidebar={toggleSidebar} />
      <main className="defaultLayout">
        <Sidebar isOpen={isShowSidebar} toggle={toggleSidebar}></Sidebar>
        <Overlay isShow={isShowSidebar} handleClick={toggleSidebar}></Overlay>
        <div className="defaultLayout__wrapper">
          <div className="container large">{children}</div>
        </div>
      </main>
    </div>
  );
}
