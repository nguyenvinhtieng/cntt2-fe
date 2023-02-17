import Link from 'next/link'
import { BiChat } from 'react-icons/bi'
import { TiTick } from 'react-icons/ti'
import UserItem from '../UserItem/UserItem'

export default function QuestionItem({question}) {
  return (
    <li className="question__item">
        <Link href={`/question/${question.slug}`}>
            <UserItem time={question.createdAt} user={question.author}></UserItem>
            <div className="question__item--ttl">
                {question.title}
            </div>
            <ul className="tag-list">
                {question.tags.map((tag, index) => <li key={tag} className="tag-item">{tag}</li>)}
            </ul>
            <div className="question__item--info">
                <span className="question__item--infoItem">
                    <span className="ico"><BiChat></BiChat></span>
                    <span className='num'>{question?.answers?.length || 0 } câu trả lời</span>
                </span>
                {question?.answers?.filter(item => item.status == "accepted").length > 0 && <span className="question__item--infoItem is-active">
                    <span className="ico"><TiTick></TiTick></span>
                    <span>Đã được giải đáp</span>
                </span>}
            </div>
        </Link>
    </li>
  )
}
