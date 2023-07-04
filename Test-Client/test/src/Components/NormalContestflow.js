import React from 'react'
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import axios from 'axios'
const socket = io.connect('http://localhost:5000/normalContest');
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlRyb29wLVVGWlg4TGJvIiwiaWF0IjoxNjg3ODU4NjYxLCJleHAiOjE2ODc4NTkyNjF9.0PZShCGd68UjrVP5HzmD_RKuHvD3GO6kZtqU7kQ-Qos"

export default function NormalContestflow() {
    
  // const handleCreateContest =()=>{
  //   console.log("Create Contest triggered");
  //   const data = {
  //     "name": "Test Contest 8",
  //     "category": "Custom",
  //     "pricePool": 30000,
  //     "slots": 500,
  //     "startTime": "2023-06-15T12:01:14.673Z",
  //     "endTime": "2023-06-16T12:01:14.673Z",
  //     "priceDistribution": [
  //       {
  //         "rank": {
  //           "from": 1,
  //           "to": 1
  //         },
  //         "price": 5000
  //       },
  //       {
  //         "rank": {
  //           "from": 2,
  //           "to": 2
  //         },
  //         "price": 2500
  //       },
  //       {
  //         "rank": {
  //           "from": 3,
  //           "to": 3
  //         },
  //         "price": 1000
  //       },
  //       {
  //         "rank": {
  //           "from": 4,
  //           "to": 4
  //         },
  //         "price": 500
  //       },
  //       {
  //         "rank": {
  //           "from": 5,
  //           "to": 100
  //         },
  //         "price": 100
  //       },
  //       {
  //         "rank": {
  //           "from": 101,
  //           "to": 450
  //         },
  //         "price": 50
  //       },
  //       {
  //         "rank": {
  //           "from": 451,
  //           "to": 500
  //         },
  //         "price": 0
  //       }
  //     ]
  //   }
  //   axios.post('http://localhost:5000/api/v1/contest/create', data, {
  //     headers: {
  //       Authorization: `Bearer ${authToken}`,
  //     },
  //   })
  //     .then((response) => {
        
  //       console.log(response);
  //       socket.emit("create-contest",response);
        
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  const [room1Users, setroom1Users] = useState(0)
  const [room2Users, setroom2Users] = useState(0)
  

  const handleContestJoin = (roomId) =>{

    const data = {
      "id": roomId,
      "selectedStocks": ["Nifty", "TATA"]
    }
    axios.post('http://localhost:5000/api/v1/contest/join', data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        // console.log(response);
        socket.emit("join-contest",response);
        
      })
      .catch((error) => {
        console.error(error);
      });
  }


  useEffect(() => {
    socket.on("user-count",(data)=>{
      if(data.id  === 'zCl7cWMfOX'){
        setroom1Users(data.count);
      }

      if(data.id === 'VQJ7NhPhRr'){
        setroom2Users(data.count);
      }
    })

    const contests ={
      contest1: 'zCl7cWMfOX',
      contest2: 'VQJ7NhPhRr',
    }

    socket.emit("user-count",contests)
  },);
  return (
    <div className="App">
      <header className="App-header">
        {/* <button onClick={handleCreateContest}>Create Contest</button> */}
        <div className='contest1'>
          <p>Joined Player Count: {room1Users}</p>
          <button onClick={(e) => handleContestJoin("zCl7cWMfOX")}>Join Contest 1</button>
        </div>

        <div className='contest2'>
        <p>Joined Player Count: {room2Users}</p>
          <button onClick={(e) => handleContestJoin("VQJ7NhPhRr")}>Join Contest 2</button>
        </div>
      </header>
    </div>
  )
}
