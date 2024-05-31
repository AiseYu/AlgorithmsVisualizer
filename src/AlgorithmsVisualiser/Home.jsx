import React, { useState } from 'react';
import './Home.css';

function Home() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  return (
    <div className="home">
      
      
      <div className="content">
        <button onClick={toggleSidePanel} id = "sidePanel">Side Panel</button>
        <main className="main">
          
          <p>The objective of this project is to create an interactive visualizer that can demonstrate the workings of popular graph algorithms, including:
<br/>•	Quick Sort
<br/>•	Merge Sort
<br/>•	Bubble Sort
<br/>•	Selection Sort
<br/>•	Kruskal's Algorithm
<br/>•	Prim's Algorithm
<br/>•	Depth first search Algorithm
<br/>•	Breadth first search Algorithm
<br/>•	Dijkstra’s Algorithm
<br/>•	Binary tree traversals (in-order, pre-order and post-order).
</p>
        </main>
        {isSidePanelOpen && (
          <aside className="side-panel">
            
            <p style={{color: 'black'}}>
              CREDIT: <br/>Roll Numbers:
            <br/>210710007043
            <br/>210710007020 
            <br/>210710007003
            </p>
          </aside>
        )}
      </div>
      <footer className="footer">
        <p>&copy; 2024 MyWebsite.</p>
      </footer>
    </div>
  );
}

export default Home;
