import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./Home";
import Question from "./Question";
import Tutor from "./Tutor";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Home/>}/>
          <Route path={'/question'} element={<Question/>} />
          <Route path={'/tutor'} element={<Tutor/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
