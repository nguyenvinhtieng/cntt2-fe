import moment from 'moment';
import Link from 'next/link';
export default function PostItemShort({post}) {
  return (
    <Link href={`/post/${post.slug}`}>
    <div className='post-itemshort'>
        <div className="post-itemshort__wrapper">
            <div className="post-itemshort__thumbnail">
                <img src={post?.thumbnail || "/default.png"} alt="" />
            </div>
            <div className="post-itemshort__content">
                <div className="post-itemshort__content--title">
                    {post?.title}
                </div>
                <div className="post-itemshort__content--desc">
                    {post?.tldr || "Không có tóm tắt bài viết"}
                </div>
                <time className="post-itemshort__content--time">{moment(post?.createdAt).startOf("hours").fromNow()}・</time>
                <time className="post-itemshort__content--time">{Math.floor(post.content.length / 200) + 1} phút đọc</time>
                <ul className="tag-list">
                    {post?.tags.length > 0 && post?.tags?.map((tag) => (
                        <span className="tag-item" key={tag}>{tag}</span>
                    ))}
                </ul>
            </div>
        </div>
    </div>
    </Link>
  )
}
