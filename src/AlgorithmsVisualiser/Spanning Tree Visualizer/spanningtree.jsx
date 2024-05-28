import React, {useState , useEffect} from "react";
import './spanningtree.css'

import Graph from "./graph";


function spanningtree(){
    
  const [controlStates , setControlStates] = useState({
    showWeights: true, 
    addingNodes: false , 
    removingNodes: false , 
    algorithm: 'Prims' , 
    currentStep: 0,
  });

  const [graphData, setGraphData] = useState(
    {
      nodes: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 }
      ],
      links: [
        { source: 1, target: 2, weight: 3 },
        { source: 1, target: 3, weight: 1 },
        { source: 2, target: 3, weight: 4 },
        { source: 2, target: 4, weight: 5 },
        { source: 3, target: 4, weight: 2 },
        { source: 3, target: 5, weight: 4 },
        { source: 4, target: 5, weight: 6 }
      ]
    }
  );

  //for progression
  const [steps, setSteps] = useState([]);
  

  

  //main algorithms

  const primAlgorithm = (data) => {
    const nodes = [...data.nodes];
    const links = [...data.links];
    const mstLinks = [];
    const visited = new Set();
    const considering = [];
    const steps = [];

    visited.add(nodes[0].id);
    while (visited.size < nodes.length) {
      let minEdge = null;
      for (let link of links) {
        if ((visited.has(link.source) && !visited.has(link.target)) ||
            (visited.has(link.target) && !visited.has(link.source))) {
          considering.push(link);
          if (!minEdge || link.weight < minEdge.weight) {
            minEdge = link;
          }
        }
      }
      if (minEdge) {
        mstLinks.push(minEdge);
        visited.add(minEdge.source);
        visited.add(minEdge.target);
        const step = {
          nodes,
          links: links.map(link => ({
            ...link,
            inMST: mstLinks.includes(link),
            considered: considering.includes(link),
            
          }))
        };
        steps.push(step);
      }else {

        console.log(steps);
        break;
      }
    }
    return steps;
  };

  const nextStep = () => {
    setControlStates(prev => ({...prev , currentStep: prev.currentStep +1}));
  };

  const prevStep = () => {
    setControlStates(prev => ({...prev , currentStep: prev.currentStep -1}));
  };



  const [selectedNodes, setSelectedNodes] = useState([]);

  const handleNodeClick = (node) => {
    setSelectedNodes(prevSelectedNodes => {
      const newSelectedNodes = [...prevSelectedNodes, node];
      if (newSelectedNodes.length === 2) {
        createNode(newSelectedNodes[0], newSelectedNodes[1]);
        return [];
      }
      return newSelectedNodes;
    });
  };

  const createNode = (node1, node2) => {
    const edgeExists = graphData.links.some(link => 
      (link.source === node1.id && link.target === node2.id) ||
      (link.source === node2.id && link.target === node1.id)
    );

    if (node1.id === node2.id){
      const newNode = { id: graphData.nodes.length + 1 };
    
      setGraphData(prevData => ({
        nodes: [...prevData.nodes, newNode],
        links: [...prevData.links, { source: node2.id, target: newNode.id , weight: 1}] 
      }));
      setSelectedNodes([]);
    }
    
    else if(!edgeExists){
      setGraphData(prevData => ({
        ...prevData,
        links: [...prevData.links, { source: node1.id, target: node2.id, weight: 1 }]
    }));
    }

    else{
      setSelectedNodes([]);
    }
    
  };


  const removeNode = (d) => {
  
    
    const removedNode = d;
    const newLinks = graphData.links.filter(link => link.source.id !== removedNode.id && link.target.id !== removedNode.id);
    
    setGraphData({
      nodes: graphData.nodes,
      links: newLinks
    });
  };

  const removeEdge = (d) => {


  }

  //TOGGLE BUTTONS
  const toggleShowWeights = () => {
    setControlStates(prevState => ({...prevState , showWeights: !controlStates.showWeights}));
  }

  const toggleAddNodes = () => {
    setControlStates(prevState => ({...prevState , addingNodes: !controlStates.addingNodes , removingNodes: false}))
  }
  const toggleRemoveNodes = () => {
    setControlStates(prevState => ({...prevState , addingNodes: false , removingNodes: !controlStates.removingNodes }))
  }


  useEffect(() => {
    // const newset = primAlgorithm(graphData);
    
  }, []);

  

  return (
    <div className="Container">
      <div className="interface">
        <button className= "graphButton" onClick={toggleShowWeights} style={{backgroundColor: controlStates.showWeights? '#00ff00': '#aaa'}}>Show Weights</button>
        <button className= "graphButton" onClick={toggleRemoveNodes} style={{backgroundColor: controlStates.removingNodes? '#00ff00': '#aaa'}}>Remove Nodes</button>
        <button className= "graphButton" onClick={toggleAddNodes} style={{backgroundColor: controlStates.addingNodes? '#00ff00': '#aaa'}}>Add Nodes</button>
        <button onClick={prevStep}>Previous Step</button>
        <button onClick={nextStep}>Next Step</button>
        {/* <ToggleSwitch operation={toggleShowWeights} label={'Show Weights'}/> */}
      </div>
      <div className="graphContainer">
        <Graph data={graphData} controlStates={controlStates} onNodeClick = {handleNodeClick}/>

      </div>
      
    </div>
  );
}

export default spanningtree;