import React from 'react';
import './QuestionCard.css';

type Props = {
    question: string,
    answers: string[],
    marks: string[],
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };

  const QuestionCard: React.FC<Props> = ({
      question,
      answers,
      marks,
      callback
  }) => (
    <div className="questionCard">        
        <p className="questionCard-title">{question}</p>
        <div className="answer-list">
            {answers.map((answer, id) => (
                <span
                    className="answer-item"                        
                    key={answer}
                    data-answer={id}
                    onClick={callback}
                >
                    <span className="answer-item-mark">{marks[id]}</span>
                    <span className="answer-item-content">{answer}</span>                     
                </span>
            ))}            
        </div>        
    </div>
  );
  
  export default QuestionCard;