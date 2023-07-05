import React from 'react';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import axios from 'axios';
const socket = io.connect('http://localhost:5000/liveContest');
// const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlRyb29wLXZhT0dCUm9jIiwiaWF0IjoxNjg3ODUzNDkzLCJleHAiOjE2ODc4NTQwOTN9.KEoAZQaWkWxBnoryHhssqLBs1krk7UFihMyJGONVtWA"

export default function LiveContesflow() {
  const [inputValue, setInputValue] = useState('');
  const [socketID, setsocketID] = useState('')
  const [selectstockbool, setselectstockbool] = useState(false);
  const [findMatch, setfindMatch] = useState(false);
  const [apponent, setapponent] = useState('');
  const [matched, setmatched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log('Submitted value:', inputValue);
    setInputValue('');
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    socket.on('select-stock', () => {
      console.log('select-stock');
      setselectstockbool(true);
    });

    socket.on('match-found', (matched_users) => {
      setmatched(true);
      if (inputValue === matched_users.user1) {
        setapponent(matched_users.user2);
      } else {
        setapponent(matched_users.user1);
      }
    });

    socket.on('get-socket-id', (id) => {
      setsocketID(id);
    });
  });

  const handleContestJoin = (userId, contesId) => {
    const user = {
      user_id: userId,
      contest_id: contesId,
    };
    socket.emit('add-in-db', user);
  };

  const handleStockSelection = (userId, contestId, stockId) => {
    setfindMatch(true);
    const user = {
      user_id: userId,
      contest_id: contestId,
      stock_id: stockId,
    };
    socket.emit('find-match', user);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Asssuming payment step is done */}
        <form onSubmit={handleSubmit}>
          <label>
            Enter a test value:
            <input type="text" value={inputValue} onChange={handleChange} />
          </label>
          <button type="submit">Submit</button>
          <p>Submitted value: {inputValue}</p>
        </form>
        <p>Session Id: {socketID}</p>

        <div className="box">
          Live Contest 1
          {selectstockbool === true ? (
            <>
              <div>
                {findMatch === true ? (
                  <div>
                    {matched === true ? (
                      <p>Matched with {apponent}</p>
                    ) : (
                      <p>Finding your apponent ...</p>
                    )}
                  </div>
                ) : (
                  <>
                    <p>Select Stock</p>
                    <button
                      className="stocks"
                      onClick={(e) =>
                        handleStockSelection(inputValue, 'contest1', 'stockId1')
                      }
                    >
                      Stock 1
                    </button>
                    <button
                      className="stocks"
                      onClick={(e) =>
                        handleStockSelection(inputValue, 'contest1', 'stockId2')
                      }
                    >
                      Stock 2
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <button onClick={(e) => handleContestJoin(inputValue, 'contest1')}>
              Join
            </button>
          )}
        </div>
        {/* <div className='box'>Live Contest 2 
        {selectstockbool === true ? (
          <p>Select Stock</p>
        ):(
          <button onClick={(e) => handleContestJoin(inputValue,"contest2")}>Join</button>          
        )}
        </div>
        <div className='box'>Live Contest 3 
        {selectstockbool === true ?(
          <p>Select Stock</p>
        ):(
          <button onClick={(e) => handleContestJoin(inputValue,"contest3")}>Join</button>  
        )}
        </div>
        <div className='box'>Live Contest 4 
        {selectstockbool ===true ? (
          <p>Select Stock</p>
        ):(
          <button onClick={(e) => handleContestJoin(inputValue,"contest4")}>Join</button>

        )}
        </div> */}
      </header>
    </div>
  );
}
