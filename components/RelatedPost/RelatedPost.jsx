import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import PostItem from '../PostItem/PostItem'
import PostItemSkeleton from '../PostItemSkeleton/PostItemSkeleton'

export default function RelatedPost({post}) {
    const posts = useSelector(state => state.posts)
    const [postRelated, setPostRelated] = React.useState([]);
    useEffect(()=> {
        let tags = post.tags;
        let postsRelatedNew = []
        let numPost = 0;
        // remove post current
        posts.data = posts.data.filter((p) => p._id !== post._id);
        posts.data.forEach((p) => {
            if(postsRelatedNew.length >= 3) return;
            if(p.author._id === post.author._id && p._id !== post._id) {
                postsRelatedNew.push(p);
            }
        })
        console.log("NUm post: ", numPost)
        console.log("Related: ", postsRelatedNew)
        if(postsRelatedNew.length < 3){
            posts.data.forEach((p) => {
                if(postsRelatedNew.length >= 3) return;
                if(p._id !== post._id){
                    let count = 0;
                    tags.forEach((tag) => {
                        if(p.tags.indexOf(tag) !== -1){
                            count++;
                        }
                    })
                    if(count > 0 && postsRelatedNew.length < 3){
                        postsRelatedNew.push({...p, count});
                    }
                }
            })
        }
        
        // if(numPost < 3){
        //     posts.data.forEach((p) => {
        //         if(numPost >= 3) return;
        //         if(p._id !== post._id && postsRelatedNew.indexOf(p) === -1)
        //         postsRelatedNew.push(p);
        //     })
        // }
        // remove post have the same _id in postsRelatedNew
        postsRelatedNew = postsRelatedNew.filter((p, index) => {
            return postsRelatedNew.findIndex((p2) => p2._id === p._id) === index;
        })

        setPostRelated(postsRelatedNew);
    }, [post, posts])
    if(!post) {
        return <ul className="post-detail__related--list">
        <PostItemSkeleton></PostItemSkeleton>
        <PostItemSkeleton></PostItemSkeleton>
        <PostItemSkeleton></PostItemSkeleton>
      </ul>
    }
  return (
    <ul className="post-detail__related--list">
        {postRelated.length > 0 && postRelated.map((item, _) => 
            <PostItem key={item._id + Math.random()} post={item}></PostItem>
        )}
    </ul>
  )
}
