import React, { useState, useEffect } from 'react';
import './App.css';
import data from './data.json';
import hand from './assets/hand.svg';
import QuestionCard from './components/QuestionCard';
import Earn from './components/Earn';

type Titles = {
  initTitle: string,
  initButton: string,
  endTitle: string,
  endButton: string
}

type QuestionType = {
  title: string,
  answers: string[],
  correct: number
}

type GameState = {
  number: number,
  procc: number,
}

export type EarnSys = {
  mark: string,
  divider: string,
  income: number[],
  current: number,
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    number: 0,
    procc: 0,
  });
  const [mobileState, setMobile] = useState(false);
  const [answState, setAnswer] = useState(0);

  const mainText:Titles = data.mainText;
  const answersNumerator:string[] = data.questionsNumerator;;
  const earnData:EarnSys = data.earning;
  const questionData:QuestionType[] = data.questions;
  const questionCount: number = questionData.length - 1;
  const [totalScore, setTotalScore] = useState<string>('$0');

  const getWindowWidth = () => {
    const {innerWidth: width } = window;
    return width;
  }
  
  const startGame = () => {
    setGameState({
      number: 0,
      procc: 1
    });
  }

  const checkAnswer = (e: any) => {
    if(answState !== 0) return;
    setAnswer(1);
    const selectedSpan = e.target.dataset.answer === undefined ? e.target.parentNode : e.target; 
    const answerList = selectedSpan.parentNode.children;
    const ans = typeof selectedSpan.dataset.answer === undefined ? -1 : Number(selectedSpan.dataset.answer);
    const srcClass = selectedSpan.className;
    selectedSpan.className = selectedSpan.className.includes('selected') ? selectedSpan.className : selectedSpan.className + ' selected';
    setTimeout(() => {
      const correctSpan = answerList[questionData[gameState.number].correct];
      if(selectedSpan !== correctSpan) {
        selectedSpan.className = srcClass + ' wrong';
        correctSpan.className += ' correct'
      } else {
        selectedSpan.className = srcClass + ' correct';
      }
      setTimeout(() => {        
        for(const span of answerList){
          span.className = srcClass;
        }
      }, 1300);
      setTimeout(() => {
        setAnswer(0);
        if(questionData[gameState.number].correct === ans) {
          if(questionCount > gameState.number){
            setGameState({
              number: gameState.number + 1,
              procc: gameState.procc,
            });
          } else {
            setTotalScore(earnData.mark + earnData.income[gameState.number].toLocaleString('ru').replaceAll(' ', earnData.divider));
            setGameState({
              number: gameState.number,
              procc: 2,
            });
          }      
        } else {
          if (gameState.number) setTotalScore(earnData.mark + earnData.income[gameState.number-1].toLocaleString('ru').replaceAll(' ', earnData.divider));
          else setTotalScore(earnData.mark + '0');
          setGameState({
            number: gameState.number,
            procc: 2,
          });
        }
      }, 1400);
    }, 800); 
  }

  const openScoreMenu = (e: any) => {
    const menu = e.target.offsetParent;
    const srcClass = menu.className.split(' ')[0];
    menu.className = menu.className.includes('close') ? srcClass + ' open' : srcClass + ' close';
  }

  useEffect(() => {
    const handleResize = () => {
      const width = getWindowWidth();
      if(width>931) setMobile(true);
      else setMobile(false);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
    
  }, []);

  return gameState.procc === 0 ? (
    <div className="container init">
      <img className="hand" src={hand} width="624" height="367" alt="Hand"/>
      <div className="init-container">
        <p className="init-title">{mainText.initTitle}</p>
        <button 
          className="init-button"
          onClick={startGame}
        >{mainText.initButton}</button>
      </div>
    </div>
  ) : gameState.procc === 1 ? (
    <div className="container running">
      <QuestionCard 
        question={questionData[gameState.number].title}
        answers={questionData[gameState.number].answers}
        marks={answersNumerator}
        callback={checkAnswer}
      />
      {mobileState ? (
        <Earn 
          mark={earnData.mark}
          divider={earnData.divider}
          income={earnData.income}
          current={gameState.number}
        />
      ) : (
        <div className="earn-menu close">
          <span
            className="toggle-icon"
            onClick={openScoreMenu}
          ></span>
          <Earn               
            mark={earnData.mark}
            divider={earnData.divider}
            income={earnData.income}
            current={gameState.number}
          />
        </div>
      )}
    </div>
  ) : (    
    <div className="container end">
    <img className="hand" src={hand} width="624" height="367" alt="Hand"/>
    <div className="init-container">
      <div>
        <p className="end-subtitle">{mainText.endTitle}</p>
        <p className="init-title end">{totalScore} earned</p>
      </div>
      <button 
        className="init-button"
        onClick={startGame}
      >{mainText.endButton}</button>
    </div>
  </div>
  )
    
}

export default App;