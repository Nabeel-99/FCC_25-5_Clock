import { useState } from 'react'

import './App.css'
import { useEffect } from "react"

function App() {

  const [breakLength, setBreakLength] = useState(5)
  const [sessionLength, setSessionLength] = useState(25)
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60)
  const [isTimer, setIsTimer] = useState(false)
  const [timerLabel, setTimerLabel] = useState('Session')
  let timerId
  const beepUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav'
  
  const playAudio = (beepUrl) => {
    const audio = new Audio(beepUrl)
    audio.currentTime = 0
    audio.play()
  }
  

   // play beep sound when timer reaches 0
  useEffect(() => {
    if(timeLeft === 0){
      playAudio(beepUrl)
    }
  }, [timeLeft])

  useEffect(() => {
    if (isTimer) {
        timerId = setInterval(() => {
            setTimeLeft(prevTime => {
                const newTime = prevTime - 1;
                if (newTime >= 0) {
                    return newTime;
                } else {
                    clearInterval(timerId);
                    if(timerLabel === 'Session'){
                      setTimerLabel('Break')
                      setTimeLeft(breakLength * 60)
                    }else{
                      setTimerLabel('Session')
                      setTimeLeft(sessionLength * 60)
                    }
                   
                    setIsTimer(true); // isTimer remains true
                    return; // Reset timeLeft to sessionLength
                }
            });
        }, 1000);
    } else {
        clearInterval(timerId);
    }

    return () => clearInterval(timerId);
}, [isTimer, sessionLength, timeLeft]);
  
//  format time in mm:ss 
 const formatTime = (timeInMs) => {
    let mins = Math.floor(timeInMs / 60)
    let secs = timeInMs % 60
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
 }

  

//  handle rest
  const handleReset = () => {
    setBreakLength(5) //initial value
    setSessionLength(25)
    setTimeLeft(1500) //initial value
    clearInterval(timerId) //clear interval 
    setIsTimer(false) //do not start
    const audio = document.getElementById('beep')
    audio.pause();
    audio.currentTime=0;

    setTimerLabel('Session')
  }

  const handleBreakDownLength = () => {
      if(breakLength === 1) return
      setBreakLength(breakLength - 1)
      setTimeLeft(breakLength * 60)
    
  }
  const handleBreakUpLength = () => {
    if (breakLength === 60 ) return
      setBreakLength(breakLength + 1)
    
  }

  const handleSessionDownLength = () => {
    if(sessionLength === 1) return
    setSessionLength(sessionLength - 1)
    setTimeLeft((sessionLength * 60) - 60)
  }
  const handleSessionUpLength = () => {
    if(sessionLength === 60)return
    setSessionLength(sessionLength + 1)
    setTimeLeft((sessionLength * 60) + 60)
  }

  const handleStartStopButton = () => {
    setIsTimer(!isTimer)
    
  }
  return (
    <>
      <div className="container">
        <h3 className="text-3xl">25 + 5 Clock</h3>
        <div className="flex flex-col items-center">
            <div className="mb-3">
              <div id="break-label">Break Length</div>
              <div className="flex items-center gap-3">
                <button id="break-decrement" className="bg-orange-200 border-2 cursor-pointer"
                onClick={handleBreakDownLength}
                >Down</button>
                <p id="break-length" className="border-2 p-2 px-4">{breakLength}</p>
                <button id="break-increment" className="bg-orange-200 border-2 cursor-pointer"
                onClick={handleBreakUpLength}
                >Up</button>
              </div>
            </div>
            <div className="mb-3">
              <div id="session-label">Session Length</div>
              <div className="flex items-center gap-3">
                <button id="session-decrement" className="bg-blue-500 border-2 cursor-pointer"
                onClick={handleSessionDownLength}
                >Down</button>
                <p id="session-length" className="border-2 p-2 px-4">{sessionLength}</p>
                <button id="session-increment" className="bg-blue-500 border-2 cursor-pointer"
                onClick={handleSessionUpLength}
                >Up</button>
              </div>
            </div>
            <div className="rounded-full p-4 w-72 h-36 bg-blue-950 flex flex-col items-center justify-center text-white font-bold">
                <div id="timer-label" className="text-2xl">
                  <audio id="beep" src={beepUrl}></audio>
                  {timerLabel}</div>
                <div>
                  <div id="time-left" className="text-5xl">{formatTime(timeLeft)}</div>
                </div>
            </div>
            <div className="mt-3 flex gap-3 text-white">
              <button onClick={handleStartStopButton} id="start_stop" className="bg-green-500 cursor-pointer border-2">Start/Stop</button>
              <button onClick={handleReset} id="reset" className="bg-red-500 cursor-pointer border-2">Reset</button>
            </div>
        </div>
      </div>
    </>
  )
}

export default App
