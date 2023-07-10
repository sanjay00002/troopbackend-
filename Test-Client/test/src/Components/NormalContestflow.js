import React from 'react';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
const socket = io.connect('http://localhost:5000/normalContest');
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlRyb29wLUlkYktxcEdQIiwiaWF0IjoxNjg4OTg1MDI3LCJleHAiOjE2ODg5ODU2Mjd9.M_ttw2skeDNXmF9mKG9iwRIGyN0I8dEKgRbRQoMTU90';

export default function NormalContestflow() {

  const [room1Users, setroom1Users] = useState(0);
  const [room2Users, setroom2Users] = useState(0);
  const [stock1datafeed, setstock1datafeed] = useState();
  const [stock2datafeed, setstock2datafeed] = useState();

  const handleContestJoin = (roomId) => {
    const data = {
      id: roomId,
      portfolio: {
        name: 'Test',
        stocks: [],
      },
    };
    axios
      .post('http://localhost:5000/api/v1/contest/join', data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.log(response.status);        
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Socket connection for getting live stock feed
    socket.on('get-live-data', (data) => {
      if (data.token === '"99926009"') {
        setstock1datafeed(data.last_traded_price);
      }
      if (data.token === '"99926008"') {
        setstock2datafeed(data.last_traded_price);
      }
    });

    socket.on("user-count",(data)=>{
      console.log(data);

      if(data.contest_id === 'a4T5w7PLMm'){
        setroom1Users(data.count);
      }

      if(data.contest_id === 'uegQVP2NXu'){
        setroom2Users(data.count);
      }
    })

    const contests =[
      'a4T5w7PLMm',
      'uegQVP2NXu'
    ]

    socket.emit("user-count",contests)
  });
  return (
    <div className="App">
      <header className="App-header">
        {/* <button onClick={handleCreateContest}>Create Contest</button> */}
        <div className="contest1">
          <p>Joined Player Count: {room1Users}</p>
          <button onClick={(e) => handleContestJoin('a4T5w7PLMm')}>
            Join Contest 1
          </button>
          <p>Nifty Bank: {stock1datafeed}</p>
        </div>

        <div className="contest2">
          <p>Joined Player Count: {room2Users}</p>
          <button onClick={(e) => handleContestJoin('uegQVP2NXu')}>
            Join Contest 2
          </button>
          <p>Nifty IT: {stock2datafeed}</p>
        </div>
      </header>
    </div>
  );
}
