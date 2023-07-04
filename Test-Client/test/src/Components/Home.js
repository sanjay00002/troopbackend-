import React from 'react'

export default function Home() {
  const handleContestJoin =()=>{

  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='box'>Live Contest 1 
          <button onClick={(e) => handleContestJoin()}>Join</button>
        </div>
        <div className='box'>Live Contest 2
          <button onClick={(e) => handleContestJoin()}>Join</button>
        </div>
        <div className='box'>Live Contest 3
          <button onClick={(e) => handleContestJoin()}>Join</button>
        </div>
        <div className='box'>Live Contest 4
          <button onClick={(e) => handleContestJoin()}>Join</button>
        </div>
      </header>
    </div>
  )
}
