import React, { useState, useEffect } from 'react';

const Node = ({ id, x, y, moveNode , container }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEntering , setIsEntering] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    setIsEntering(true);
  };

  const handleMouseLeave = () => {
    setIsEntering(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      
      moveNode(
        id, 
        Math.max(container.left + 20, Math.min(e.pageX , container.right - 50)) , 
        Math.max(container.top + 20 , Math.min(e.pageY , container.bottom - 50))
      )
    }
  };

  const handleStyles = () => {
    let node = document.getElementById(id);
    let nodeStyle = node.style;
    if (isEntering){
      nodeStyle.backgroundColor = 'red'
    }
    else{
      nodeStyle.backgroundColor = 'rgb(153, 0, 255)'
    }

  } 

  useEffect(() => {
    let node = document.getElementById(id);
    if (node) {
      handleStyles();
      node.addEventListener('mousedown', handleMouseDown);
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    
      return () => {
        node.removeEventListener('mousedown', handleMouseDown);
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isEntering]);

  return (
    <div id={id}
      style={{
        position: 'absolute',
        left: x-15,
        top: y-15,
        width: 30,
        height: 30,
        backgroundColor: 'rgb(153, 0, 255)',
        cursor: 'move',
        userSelect: 'none',
      }}
    >{id}</div>
  );
};

export default Node;