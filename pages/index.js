import { VscSettings } from "react-icons/vsc";
import { connect } from "react-redux";
import PostItem from "~/components/PostItem/PostItem";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import PostItemSkeleton from "~/components/PostItemSkeleton/PostItemSkeleton";
import {  startFilterPost } from "~/redux/actions/postActions";
import { useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import { FaListUl } from "react-icons/fa";
import { BsGrid } from "react-icons/bs";
import { CiBoxList } from "react-icons/ci";
import Head from "next/head";

function Home() {
  const dispatch = useDispatch();
  const [isGrid, setIsGrid] = useState(true);
  const [itemOffset, setItemOffset] = useState(0);
  const [ tags, setTags] = useState([]);
  const searchContentRef = useRef(null);
  const posts = useSelector((state) => state.posts);
  
  useEffect(() => {
    let isDisplayGridLocalstorage = localStorage.getItem("displayType");
    if (isDisplayGridLocalstorage && isDisplayGridLocalstorage === "false") {
      setIsGrid(false);
    }else {
      setIsGrid(true);
    }
  }, []);
  const switchDisplayType = () => {
    let newStatus = !isGrid;
    setIsGrid(newStatus);
    localStorage.setItem("displayType", newStatus);
  };
  let itemsPerPage = 9;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = posts?.dataTemp?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(posts?.dataTemp?.length / itemsPerPage) || 0;

  
  useEffect(() => {
    let tagsTemp = {};
    posts?.data?.forEach(post => {
      post.tags.forEach(tag => {
        if (tagsTemp[tag]) {
          tagsTemp[tag] += 1;
        } else {
          tagsTemp[tag] = 1;
        }
      })
    });
    tagsTemp = Object.entries(tagsTemp).sort((a, b) => b[1] - a[1]);
    // get top 10 tags
    tagsTemp = tagsTemp.slice(0, 10);
    // add all
    tagsTemp = [["Tất cả", 0], ...tagsTemp]
    setTags(tagsTemp);
  }, [posts]);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % posts?.dataTemp?.length;
    setItemOffset(newOffset);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startFilter = () => {
    let content = searchContentRef.current.value;
    dispatch(startFilterPost({content}));
  }
  const searchTag = (tag) => {
    if(tag == "Tất cả") tag = "all";
    dispatch(startFilterPost({tag: tag}));
  }
  return (
    <>
    <Head>
      <title>Bài viết mới nhất</title>
      </Head> 
      <div className={`search`}>
        <div className="search__inner">
            <div className="input__wrapper">
              <label htmlFor="" className="input__label">Tìm kiếm bài viết</label>
              <input type="text" placeholder="Nhập nội dung tìm kiếm" ref={searchContentRef} />
            </div>
            <button className="button" onClick={startFilter}>Tìm</button>
        </div>
    </div>
    <div className="tags">
      <div className="tags__inner">
        <div className="tags__title">Từ khóa nổi bật</div>
        <div className="tags__list">
          {tags?.length > 0 && tags.map(tag => <div className="tag" onClick={()=>searchTag(tag[0])} key={tag[0]}>#{tag[0]}</div>)}
        </div>
      </div>
    </div>
    <div className="switch">
      <div className={`switch__item ${!isGrid && "active"}`} onClick={()=>switchDisplayType()}><CiBoxList/></div>
      <div className={`switch__item ${isGrid && "active"}`} onClick={()=>switchDisplayType()}><BsGrid/></div>
    </div>
      
    <div className={`post__list ${!isGrid && "list"}`}>
      {currentItems?.length > 0 &&  currentItems?.map(item => <PostItem key={item._id} post={item}></PostItem>)}
      {posts?.data.length === 0 && <>
        <PostItemSkeleton /><PostItemSkeleton /><PostItemSkeleton /> <PostItemSkeleton /><PostItemSkeleton /><PostItemSkeleton /> </>}
    </div>
    {currentItems?.length > 0 && 
        <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="Previous"
        renderOnZeroPageCount={null}
        className="pagination"
      />}
    </>
  );
}

export default Home;