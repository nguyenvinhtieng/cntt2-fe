import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux'
import QuestiomItemSkeleton from '~/components/QuestiomItemSkeleton/QuestiomItemSkeleton';
import QuestionItem from '~/components/QuestionItem/QuestionItem'
import { fetchQuestionData } from '~/redux/actions/questionAction';

export default function QuestionPage() {
  const [itemOffset, setItemOffset] = useState(0);
  const questions = useSelector(state => state.questions)
  const dispatch = useDispatch();
  let itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = questions?.dataTemp?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(questions?.dataTemp?.length / itemsPerPage) || 0;
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % questions?.dataTemp?.length;
    setItemOffset(newOffset);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div className="questionPage">
      <Head>
        <title>Câu hỏi mới nhất</title>
      </Head>
        <h3>Câu hỏi mới nhất</h3>
        <div className="questionPage__filter">

        </div>
        <ul className="" style={{listStyle: "none"}}>
          {currentItems?.length > 0 &&  currentItems?.map(question => <QuestionItem key={question._id} question={question}></QuestionItem>)}
          {/* {questions?.data?.length > 0 && 
          <InfiniteScroll
            dataLength={questions?.data?.length}
            next={()=> dispatch(fetchQuestionData({}))}
            hasMore={questions?.total > questions?.data?.length || false}
            scrollThreshold={"200px"}
            className="question__list"
            loader={<>
              <QuestiomItemSkeleton /><QuestiomItemSkeleton /><QuestiomItemSkeleton />
            </>}
            endMessage={
              <p className="end-message">
                Yay! You have seen it all
              </p>
            }
          >
            {questions?.data?.map((question) => <QuestionItem key={question._id} question={question}></QuestionItem>)}
          </InfiniteScroll>
          } */}
            {/* {questions?.data?.length > 0 && questions?.data?.map((question, _) => <QuestionItem key={question._id} question={question}></QuestionItem>)} */}
            {questions?.data?.length == 0 && !questions.loading && <div className="question__list--empty">Không có câu hỏi nào</div>}
            {/* {questions?.data?.length == 0 && questions.loading && new Array(5).fill(null).map((_, index) => <QuestiomItemSkeleton key={index} />)} */}
        </ul>
        {currentItems?.length > 0 && 
          <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          className="pagination"
        />}
    </div>
  )
}
