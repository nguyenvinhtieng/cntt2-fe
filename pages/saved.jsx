import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import PostItem from '~/components/PostItem/PostItem';
import PostItemSkeleton from '~/components/PostItemSkeleton/PostItemSkeleton';
import { getMethod } from '~/utils/fetchData';

export default function SavedPage() {
  const [bookmarks, setBookmarks] = React.useState([])
  const [loaded, setLoaded] = React.useState(false)
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const fetchBookmarks = () => {
    getMethod("bookmark/my-bookmarks")
      .then((res) => {
        const { data } = res;
        if(data.status){
          setBookmarks(data.bookmarks);
        }
        setLoaded(true);
      })
      .catch(er => console.log(er))
  }
  useEffect(()=>{
    fetchBookmarks();
  }, [auth])
  
  useEffect(() => {
    if(!auth.user) {
      router.push("/")
    }
  }, [auth])

  return (
    <>
      <Head>
        <title>Bài viết đã lưu</title>
      </Head>
      {!loaded && <>
        <ul className="post__list">
        <PostItemSkeleton></PostItemSkeleton>
        <PostItemSkeleton></PostItemSkeleton>
        <PostItemSkeleton></PostItemSkeleton>
        <PostItemSkeleton></PostItemSkeleton>
        </ul>
      </>}

      {loaded && bookmarks && bookmarks.length == 0 && <p>Không có bài viết nào</p>}
      <ul className="post__list">
        {bookmarks.length > 0 && bookmarks.map((b, index) => 
          <PostItem post={b.post} key={b._id}></PostItem>
        )}
      </ul>
    </>
  )
}
