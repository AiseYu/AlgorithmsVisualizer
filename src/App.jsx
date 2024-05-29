
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navigation from "./AlgorithmsVisualiser/Navigation";

import Home from "./AlgorithmsVisualiser/Home";
import Sorting from "./AlgorithmsVisualiser/Sorting Visualizer/sorting";
import spanningtree from "./AlgorithmsVisualiser/Spanning Tree Visualizer/spanningtree";
import pathfinding from "./AlgorithmsVisualiser/Path Finding Visualizer/pathfinding";



function App() {
  return (
    
    <Router>
      <div>
      <Navigation></Navigation>
      <Routes>
      <Route exact path="/" Component={Home} />
      <Route path="/sorting" Component={Sorting} />
      <Route path="/spanningtree" Component={spanningtree} />
      <Route path="/pathfinding" Component={pathfinding} />
      </Routes>
      </div>
      
    </Router>
    
    

  );
}

export default App







