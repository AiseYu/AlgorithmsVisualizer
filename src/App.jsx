import Sorting from "./AlgorithmsVisualiser/Sorting Visualizer/sorting";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navigation from "./AlgorithmsVisualiser/Navigation";
import Home from "./AlgorithmsVisualiser/Home";

function App() {
  return (
    
    <Router>
      <div>
      <Navigation></Navigation>
      <Routes>
      <Route exact path="/" Component={Home} />
      <Route path="/sorting" Component={Sorting} />
      </Routes>
      </div>
      
    </Router>
    
    

  );
}

export default App







