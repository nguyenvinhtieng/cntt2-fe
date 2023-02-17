import React, { useEffect } from 'react';
import CommentItem from '../CommentItem/CommentItem';

export default function PostCommentBlock({post}) {
    const [commentThread, setCommentThread] = React.useState([]);
    useEffect(()=> {
        let commentPost = post.comments;
        let comments = [];
        let commentReply = [];
        commentPost.forEach((comment) => {
            if(!comment.reply_id){
                comments.push({...comment, replies: []});
            }else {
                commentReply.push(comment);
            }
        })
        commentReply.forEach((comment) => {
            comments = comments.map(item => {
                if(item._id === comment.reply_id){
                    item.replies.push(comment);
                }
                return item;
            })
        })
        setCommentThread(comments);
    }, [post])

    return (
        <div className="post-detail__comments">
            {commentThread.length == 0 && <div className="post-detail__comments__empty">Chưa có bình luận nào</div>}
            {commentThread.length > 0 && commentThread.map((item, _) => (
                <ul className="comment-thread" key={item._id}>
                    <CommentItem comment={item} reply_for={item._id}></CommentItem>
                    {item.replies.length > 0 && item.replies.map((reply, _) => (
                        <CommentItem comment={reply} key={reply._id} reply_for={item._id}></CommentItem>
                    ))}
                </ul>
            ))}
        </div>
    )
}
