import React from 'react';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import axios from 'axios';
const socket = io.connect('http://localhost:5000/liveContest');
// const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlRyb29wLXZhT0dCUm9jIiwiaWF0IjoxNjg3ODUzNDkzLCJleHAiOjE2ODc4NTQwOTN9.KEoAZQaWkWxBnoryHhssqLBs1krk7UFihMyJGONVtWA"

export default function LiveContesflow() {
  const [inputValue, setInputValue] = useState('');
  const [socketID, setsocketID] = useState('');
  const [selectstockbool, setselectstockbool] = useState(false);
  const [findMatch, setfindMatch] = useState(false);
  const [apponent, setapponent] = useState('');
  const [matched, setmatched] = useState(false);
  const [stock1datafeed, setstock1datafeed] = useState();
  const [stock2datafeed, setstock2datafeed] = useState();

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

    // socket connection for getting stock data, here stock token list will be the stock token list of a particular contest
    
    
    socket.on('get-live-data', (data) => {
      if(data.token === '"99926029"'){
        setstock1datafeed(data.last_traded_price)
      }if(data.token === '"99926023"'){
        setstock2datafeed(data.last_traded_price)
      }
    });

    socket.on('select-stock', () => {
      console.log('select-stock');
      setselectstockbool(true);
    });

    socket.on('match-found', (apponent) => {
      setmatched(true);
      setapponent(apponent);
    });

    socket.on('get-socket-id', (id) => {
      setsocketID(id);
    });
  });

  const handleContestJoin = (userId, socketId, contesId) => {
    const user = {
      user_id: userId,
      socket_id: socketId,
      contest_id: contesId,
    };
    socket.emit('add-in-db', user);
  };

  const handleStockSelection = (userId, socketId, contestId, stockId) => {
    setfindMatch(true);
    const user = {
      user_id: userId,
      socket_id: socketId,
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
            Enter User Id:
            <input type="text" value={inputValue} onChange={handleChange} />
          </label>
          <p>User Id: {inputValue}</p>
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
                        handleStockSelection(
                          inputValue,
                          socketID,
                          'E73-0iejpl',
                          1,
                        )
                      }
                    >
                      Stock 1
                    </button>
                    <button
                      className="stocks"
                      onClick={(e) =>
                        handleStockSelection(
                          inputValue,
                          socketID,
                          'E73-0iejpl',
                          2,
                        )
                      }
                    >
                      Stock 2
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div>Nifty Auto : {stock1datafeed}</div>
              <div>Nifty Pharma : {stock2datafeed}</div>
              <button
                onClick={(e) =>
                  handleContestJoin(inputValue, socketID, 'E73-0iejpl')
                }
              >
                Join
              </button>
            </>
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
