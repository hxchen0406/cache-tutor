import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import LearnerProfile from "./LearnerProfile";
import Home from "./Home";
import Question from "./Question";
import Tutor from "./Tutor";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/profile" element={<LearnerProfile/>}/>
          <Route path={'/'} element={<Home/>}/>
          <Route path={'/question'} element={<Question/>} />
          <Route path={'/tutor'} element={<Tutor/>}/>



        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
