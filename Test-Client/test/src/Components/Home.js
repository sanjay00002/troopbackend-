import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import axios from 'axios';
const socket = io.connect('http://localhost:5000');

export default function Home() {
  useEffect(() => {
    const stock_token = ['99926009', '99926008','99926029', '99926023'];
    socket.emit('send-stock-tokens',stock_token)
  },)
  

  return (
    <div className="App">
      <header className="App-header">
        
      </header>
    </div>
  )
}
