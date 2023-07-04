import React from 'react'
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import axios from 'axios'
const socket = io.connect('http://localhost:5000/liveContest');
// const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlRyb29wLXZhT0dCUm9jIiwiaWF0IjoxNjg3ODUzNDkzLCJleHAiOjE2ODc4NTQwOTN9.KEoAZQaWkWxBnoryHhssqLBs1krk7UFihMyJGONVtWA"


export default function LiveContesflow() {

  useEffect(() => {
    socket.emit('contest-session-joined')
  })
  

  const handlePostPayment=()=>{
    socket.emit("payment-done")
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* Asssuming payment step is done */}
          <button onClick={handlePostPayment}>Payment Done</button>
        
      </header>
    </div>
  )
}
