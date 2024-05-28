import React, { useState , useRef, useEffect, useCallback } from 'react';
import Node from './node';
import Edge from './edge';
import './graph.css'
const Graph = () => {
  const [nodes, setNodes] = useState([
    { id: 1, x: 500, y: 300 },
    { id: 2, x: 700, y: 300 }
    
  ]);

  const [edges , setEdges] = useState([
    {source: nodes[0], destination:nodes[1] , weight: 0}

  ])

  const [idCounter , setIdCount] = useState(2);

  const [toggleAddNode , setToggleAddNode] = useState(false);

  const moveNode = useCallback((id, x, y) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, x, y } : node
      )
    );
  }, [nodes]);


  const addNode = (e) => {
    if(toggleAddNode){
      const newNode = {id: idCounter , x: e.pageX , y: e.pageY}
      setNodes([...nodes , newNode]);
      setIdCount(prev => prev+1);
      
    }
    console.log(nodes);
    
  }


  const handleAddNodeButton = () => {
    setToggleAddNode(prev=> !prev);
    

  }

  //To get the array container
  const [graphRect, setGraphRect] = useState();
  const graphContainer = useRef(null);

  useEffect(()=>{
    

    if (graphContainer.current) {
      setGraphRect(graphContainer.current.getBoundingClientRect());
    }

    
    
  } , [])

  return (
    <div className='mainContainer'>
    
    <div className='interface'>
      <button className= "graphButton" onClick={handleAddNodeButton} style={{
        backgroundColor: toggleAddNode?  'red':'#007bff'

      }}>{toggleAddNode? 'ADDING NODES' : 'ADD NODES'}</button>

    </div>

    <div ref={graphContainer} onClick={addNode} className= "graphContainer">
      
      {
      nodes.map((node) => (
        <Node
          key={node.id}
          id={node.id}
          x={node.x}
          y={node.y}
          moveNode={moveNode}
          container={graphRect}
        />
      ))
      }
      {
        edges.map((edge) => (
        <Edge
          key={edge.source.id}
          source={edge.source}
          destination={edge.destination}
          weight={1}
        />
      ))
      }
      
    </div>

    </div>
    
  );
};

export default Graph;