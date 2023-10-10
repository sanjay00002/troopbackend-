import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/Home';
import NormalContestflow from './Components/NormalContestflow';
import LiveContesflow from './Components/LiveContesflow';
import Stock from './Components/Stock';
import SlotMachine from './Components/SlotMachine';


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/normalContestJoin' element={<NormalContestflow/>}/>
        <Route path='/liveContestJoin' element={<LiveContesflow/>}/>
        <Route path='/stockTesting' element={<Stock/>}/>
        <Route path='/slotMachine' element={<SlotMachine/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
