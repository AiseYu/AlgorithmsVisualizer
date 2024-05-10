import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
function Navigation() {
  return (
    <div className='Navigation'>
        <header className="header">
        <h1 id='mainHead'>Algorithms Visualizer</h1>
        </header>
        <Link to="/" className='button'>Home</Link>
        <Link to="/sorting" className='button'>SortingVisualiser</Link>
        <Link to="/spanningtree" className='button'>SpanningTreeVisualiser</Link>
      
    </div>
  );
}

export default Navigation;