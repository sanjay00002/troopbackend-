import React, { useState } from 'react';
import { useEffect } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:5001/stockConnection');

export default function Stock() {
  const [stockName, setstockName] = useState('demo name');
  const [ltp, setltp] = useState(0);
  const [openPrice, setopenPrice] = useState(0);
  const [highPrice, sethighPrice] = useState(0);
  const [lowPrice, setlowPrice] = useState(0);
  const [closePrice, setclosePrice] = useState(0);

  const getData = () => {
    socket.emit('get-data');
  };

  useEffect(() => {
    // For testing purpose
    socket.on('Tick', (data) => {
      // console.log("Data Recived");
      console.log('receiveTick:::::', data);

      setltp(data.last_traded_price);
      setopenPrice(data.open_price_day);
      sethighPrice(data.high_price_day);
      setlowPrice(data.low_price_day);
      setclosePrice(data.close_price);
    });

    // Smart api connection check
    socket.emit('smart-api-connect');
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="stock">
          <p>Stock Name: {stockName}</p>
          <p>Last Traded Price: {ltp}</p>
          <p>Open Price: {openPrice}</p>
          <p>High Price: {highPrice}</p>
          <p>Low Price: {lowPrice}</p>
          <p>Close Price: {closePrice}</p>
          <button onClick={getData}>Get Data</button>
        </div>
      </header>
    </div>
  );
}

// subscription_mode: '2',
// exchange_type: '1',
// token: '"1594"',
// sequence_number: '1039',
// exchange_timestamp: '1688174718777',
// last_traded_price: '133550',
// last_traded_quantity: '39',
// avg_traded_price: '132613',
// vol_traded: '12821692',
// total_buy_quantity: '3344',
// total_sell_quantity: '0',
// open_price_day: '130820',
// high_price_day: '133890',
// low_price_day: '130445',
// close_price: '129335'
