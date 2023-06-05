import React, { useState, useEffect } from "react";
import './Pomodoro.css';
import Menu from './Menu';
import start from "../images/start.png";
import stop from "../images/stop.webp";
import reset from "../images/reset.png";

export default function Pomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isStarted, setStarted] = useState(false);

  const min = minutes.toString().padStart(2, '0');
  const sec = seconds.toString().padStart(2, '0');

  function handleChange(e) {
    if (e.target.value >= 0) {
      setMinutes(Math.round(e.target.value));
    } else {
      setMinutes(0);
    }
  };

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      if (isStarted === true) {
        if (seconds === 0) {
          if (minutes !== 0) { //we have minutes but no secs has left
            setSeconds(59);
            setMinutes(minutes - 1);
          } else { //no mins and no secs left
            resetTimer();
          }
        } else { //secs are not 0 so keep decreasing them
          setSeconds(seconds - 1);
        }
      }
    }, 1000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [seconds, isStarted]);

  function startTimer() {
    setStarted(true);
  }

  function stopTimer() {
    setStarted(false);
  }

  function resetTimer() {
    setStarted(false);
    setSeconds(0);
    setMinutes(0);
  }

  return (
    <div>
      <Menu></Menu>
      <h1 className="mainTitle">Pomodoro technique</h1>
      <div className="subTitle">This popular time management method asks you to alternate pomodoros — focused work sessions — with frequent short breaks to promote sustained concentration.</div>
      
      <div className="mainContent">
        <div className="explanationContainer">
          <div className="explanationTitle">How to do it?</div>
          <ul className="explanationList">
            <li className="explanationListItem">✓ Choose a task</li>
            <li className="explanationListItem">✓ Set a 25 minute timer</li>
            <li className="explanationListItem">✓ Work on the task until the time is up</li>
            <li className="explanationListItem">✓ Take a 5 minute break</li>
          </ul>
          <div className="customTimerCont">
            <div className="setTimerTitle">Set your timer! Add minutes here:</div>
            <input type="number" onChange={handleChange} value={minutes} className="setMinutes" min={0}/>
          </div>
        </div>

        <div className="pomodoro">
          <div className="timer" data-testid="tid">
          {min}:{sec}
          </div>
          <img onClick={startTimer} src={start} alt="start" className='buttonicons'></img>
          <img onClick={stopTimer} src={stop} alt="stop" className='buttonicons'></img>
          <img onClick={resetTimer} src={reset} alt="reset" className='buttonicons'></img>
      </div>

    </div>
    </div>
  );
}