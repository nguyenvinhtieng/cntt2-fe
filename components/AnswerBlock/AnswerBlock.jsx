import React, { useEffect } from 'react';
import AnswerItem from '../AnswerItem/AnswerItem';

export default function AnswerBlock({answers, author_question_id}) {
    const [answerThread, setAnswerThread] = React.useState([]);
    useEffect(()=> {
        if(!answers || answers.length === 0) return;
        let answersData = [...answers];

        let answersThreadData = [];
        let answerReply = [];
        answersData.forEach((answer) => {
            if(!answer.reply_id){
                answersThreadData.push({...answer, replies: []});
            }else {
                answerReply.push(answer);
            }
        })
        answerReply.forEach((answer) => {
            answersThreadData.forEach((a, index) => {
                if(a._id === answer.reply_id) {
                    answersThreadData[index].replies.push(answer);
                }
            })
        })
        setAnswerThread(answersThreadData);
    }, [answers])

  return (
    <div className="answer__list">
        {answerThread.length > 0 && answerThread.map((thread, index) => (
            <div className="answer__thread" key={thread._id}>
                <AnswerItem author_question_id={author_question_id} answer={thread} reply_id={thread._id}></AnswerItem>
                {thread.replies.length > 0 && thread.replies.map((reply, index) => (
                    <AnswerItem author_question_id={author_question_id} key={reply._id} answer={reply} reply_id={thread._id}></AnswerItem>
                ))}
            </div>
        ))}
        
    </div>
  )
}
