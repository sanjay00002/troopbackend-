import React from 'react'
import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000/slotMachine');

const handleSlotMachine =()=>{
    socket.emit('triggered')
}

function SlotMachine() {
  return (
    <div className='App-header'>
        <button onClick={handleSlotMachine} >Trigger slot machine</button>
    </div>
  )
}

export default SlotMachine