import React, { useState } from 'react';

function Space(){

    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      setCoordinates({ x: clientX, y: clientY });
    };
  
    return (
      <div 
        style={{ 
          width: '400px', 
          height: '300px', 
          border: '1px solid black',
          position: 'relative',
        }}
        onMouseMove={handleMouseMove}
      >
        <p>Cursor coordinates: {coordinates.x}, {coordinates.y}</p>
        
      </div>
    );
}

export default Space;



