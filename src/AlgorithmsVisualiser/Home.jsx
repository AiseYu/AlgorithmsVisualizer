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
        <button onClick={toggleSidePanel}>Side Panel</button>
        <main className="main">
          
          <p>...Some Content</p>
        </main>
        {isSidePanelOpen && (
          <aside className="side-panel">
            
            <p>210710007043
            210710007020 
            210710007003
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
