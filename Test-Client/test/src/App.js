import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/Home';
import NormalContestflow from './Components/NormalContestflow';
import LiveContesflow from './Components/LiveContesflow';
import Stock from './Components/Stock';


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/normalContestJoin' element={<NormalContestflow/>}/>
        <Route path='/liveContestJoin' element={<LiveContesflow/>}/>
        <Route path='/stockTesting' element={<Stock/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
