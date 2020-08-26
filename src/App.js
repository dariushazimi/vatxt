import React, { useState, useEffect } from 'react';
import './App.css';
import moment from 'moment';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'
//mic.lang = 'zh'
//mic.lang = 'ja'
//mic.lang = 'de'
//let datetime = new Date();
//let datetime = Date.now();
//By installing moment module in a nodejs project:
//npm i --save moment
let timestamp = Number(new Date());
let thisTime = moment(timestamp).format("MMMM Do YYYY_HH-mm-ss.SSSS"); // February 28th 2020_01-06-34.0000
 // Below lines didn't work
//const moment = require('moment');

//let now = moment();




function App() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])

  useEffect(() => {
    // eslint-disable-next-line
    handleListen() // eslint-disable-line no-use-before-define
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]) // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line
  const handleListen = () => {
    if (isListening) {
      mic.start()
      //let datetime = new Date();
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      if (note != null){
        setSavedNotes([...savedNotes, thisTime + note])
        setNote('')
      }


      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

//  const handleSaveNote = () => {
//    setSavedNotes([...savedNotes, note])
//    setNote('')
//  }

  return(
    // you can use <react.fragment> depending on what library is used
   <>
        <h1>Voice Notes</h1>
      <div className="container">
        <div className="box">
          <h2>Current Note</h2>
          {isListening ? <span role="img" aria-label="mic">🎙️</span> : <span role="img" aria-label="stop">🛑🎙️</span>}


          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Notes</h2>
          {savedNotes.map(n => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
      </>
  );
}

export default App
