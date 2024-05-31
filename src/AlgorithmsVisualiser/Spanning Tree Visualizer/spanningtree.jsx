import React, {useState , useEffect} from "react";
import './spanningtree.css'
import { MinHeap } from 'mnemonist';

import Graph from "./graph";
import { index } from "d3";


function spanningtree(){
    
  const [graphStates , setGraphStates] = useState({
    showWeights: true, 
    showId: false,
    addingNodes: false , 
    removingNodes: false , 
    algorithm: 'prims' ,
    visualize: false, 
    currentStep: 0,
    selectedNode: 0
    
  });

  const [nextWeight , setNextWeight] = useState(1)

  const [graphData, setGraphData] = useState(
    {
      nodes: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 }
      ],
      links: [
        { source: 1, target: 2, weight: 3 },
        { source: 1, target: 3, weight: 1 },
        { source: 2, target: 3, weight: 4 },
        { source: 2, target: 4, weight: 5 },
        { source: 3, target: 4, weight: 2 },
        { source: 3, target: 5, weight: 4 },
        { source: 4, target: 5, weight: 6 },
        { source: 5, target: 6, weight: 3 },
        { source: 5, target: 7, weight: 1 },
        { source: 6, target: 7, weight: 4 },
        { source: 6, target: 8, weight: 5 },
        { source: 7, target: 8, weight: 2 }
      ]
    }
  );



  //for progression
  const [steps, setSteps] = useState([]);
  

  

  //main algorithms

  const kruskalAlgorithm = (data) => {
    const nodes = data.nodes.map(node => ({ id: node.id }));
    const links = data.links.map(link => ({ source: link.source.id, target: link.target.id, weight: link.weight }));
    const mstLinks = [];
    const parent = {};
    const rank = {};
    const steps = [];

    const find = (node) => {
      if (parent[node] !== node) {
        parent[node] = find(parent[node]);
      }
      return parent[node];
    };

    const union = (node1, node2) => {
      const root1 = find(node1);
      const root2 = find(node2);
      if (root1 !== root2) {
        if (rank[root1] > rank[root2]) {
          parent[root2] = root1;
        } else if (rank[root1] < rank[root2]) {
          parent[root1] = root2;
        } else {
          parent[root2] = root1;
          rank[root1]++;
        }
      }
    };

    
    nodes.forEach(node => {
      parent[node.id] = node.id;
      rank[node.id] = 0;
    });

    
    const heap = new MinHeap((a, b) => a.weight - b.weight);
    for (let link of links){
      heap.push(link);
    }
    console.log(heap)

    
    while (mstLinks.length < nodes.length - 1 && heap.size > 0) {
      const minEdge = heap.pop();
      const { source, target } = minEdge;
      if (find(source) !== find(target)) {
        union(source, target);
        mstLinks.push(minEdge);
        const step = {
          nodes,
          links: links.map(link => ({
            ...link,
            inMST: mstLinks.includes(link),
            considered: (link === minEdge),
          }))
        };
        steps.push(step);
      }
      else{
        const step = {
          nodes,
          links: links.map(link => ({
            ...link,
            inMST: mstLinks.includes(link),
            considered: link === minEdge,
          }))
        };
        steps.push(step);
        
      }
    }
    const step = {
      nodes,
      links: links.map(link => ({
        ...link,
        inMST: mstLinks.includes(link),
        considered: false,
      }))
    };
    steps.push(step);
    
    return steps;
  };

  const primAlgorithm = (data) => {
    const nodes = data.nodes.map(node=> ({id: node.id}));
    const links = data.links.map(link => ({source: link.source.id, target: link.target.id , weight: link.weight}));
    const mstLinks = [];
    const visited = new Set();
    const steps = [];
    
    visited.add(nodes[0].id);
    while (visited.size < nodes.length) {
      let considering = [];
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
        const step2 = {
          nodes,
          links: links.map(link => ({
            ...link,
            inMST: mstLinks.includes(link),
            considered: false,
            
          }))
        };
        steps.push(step);
        steps.push(step2);
      }else {

        console.log("broke");
        break;
      }
    }
    return steps;
  };

  const nextStep = () => {
    setGraphStates(prev => ({...prev , currentStep: Math.min(steps.length-1 , prev.currentStep +1)}));
  };

  const prevStep = () => {
    setGraphStates(prev => ({...prev , currentStep: Math.max(prev.currentStep -1 , 0)}));
  };



  const [selectedNodes, setSelectedNodes] = useState([]);

  const handleNodeClick = (node) => {
    const nodes = graphData.nodes;
    const links = graphData.links;
    
    setSelectedNodes(prevSelectedNodes => {
      const newSelectedNodes = [...prevSelectedNodes, node];
      if (newSelectedNodes.length === 2) {
        if(graphStates.addingNodes){
          createNode(newSelectedNodes[0], newSelectedNodes[1]);
        }
        else if(graphStates.removingNodes){
          removeNode(newSelectedNodes[0], newSelectedNodes[1]);
        }
        
        setGraphStates(prev => ({...prev , selectedNode: 0}))
        
        return [];
      }

      setGraphStates(prev => ({...prev , selectedNode: node.id}))
    
    
      return newSelectedNodes;
    });
  };

  const createNode = (node1, node2) => {
    const edgeExists = graphData.links.some(link => 
      (link.source.id === node1.id && link.target.id === node2.id) ||
      (link.source.id === node2.id && link.target.id === node1.id)
    );

    if (node1.id === node2.id){
      const newNode = { id: graphData.nodes.length + 1 };
    
      setGraphData(prevData => ({
        nodes: [...prevData.nodes, newNode],
        links: [...prevData.links, { source: node2.id, target: newNode.id , weight: nextWeight}] 
      }));
      setSelectedNodes([]);
    }
    
    else if(!edgeExists){
      setGraphData(prevData => ({
        ...prevData,
        links: [...prevData.links, { source: node1.id, target: node2.id, weight: nextWeight }]
    }));
      setSelectedNodes([]);
    }

    else{
      setSelectedNodes([]);
    }
    
  };


  const removeNode = (node1 , node2) => {
    const edgeExists = graphData.links.some(link => 
      (link.source.id === node1.id && link.target.id === node2.id) ||
      (link.source.id === node2.id && link.target.id === node1.id)
    );
    console.log(edgeExists);
    
    if(node1.id === node2.id){
      const newLinks = graphData.links.filter(link => link.source.id !== node1.id && link.target.id !== node1.id);
      const newNodes = graphData.nodes.filter(node => node.id !== node1.id);
      setGraphData({
        nodes: newNodes,
        links: newLinks
      });
      setSelectedNodes([]);
    }
    if(edgeExists){
      
      setGraphData(prevData => ({
        ...prevData,
        links: [...prevData.links.filter(link=> !((link.source.id == node1.id && link.target.id == node2.id)||
                                                (link.source.id == node2.id && link.target.id == node1.id)))]
      }));
      setSelectedNodes([]);
    }
    else{
      setSelectedNodes([]);
    }
    
  };

  //TOGGLE BUTTONS
  const toggleShowWeights = () => {
    setGraphStates(prevState => ({...prevState , showWeights: !graphStates.showWeights}));
  }
  const toggleShowId = () => {
    setGraphStates(prevState => ({...prevState , showId: !graphStates.showId}));

  }

  const toggleAddNodes = () => {
    setGraphStates(prevState => ({...prevState, visualize: false , addingNodes: !graphStates.addingNodes , removingNodes: false}))
  }
  const toggleRemoveNodes = () => {
    setGraphStates(prevState => ({...prevState , visualize: false, addingNodes: false , removingNodes: !graphStates.removingNodes }))
  }

  const toggleVisualization = () => {

    if (graphStates.algorithm == 'prims'){
      const primSteps = primAlgorithm(graphData);
      setSteps(primSteps);
      setGraphStates(prev => ({...prev , visualize: !graphStates.visualize , currentStep: 0 , addingNodes: false , removingNodes: false }));
      
    }
    else if(graphStates.algorithm == 'kruskal'){
      const kruskalSteps = kruskalAlgorithm(graphData);
      
      setSteps(kruskalSteps);
      setGraphStates(prev => ({...prev , visualize: !graphStates.visualize , currentStep: 0 , addingNodes: false , removingNodes: false }));

    }
    const resetData = {
      nodes: graphData.nodes,
      links: graphData.links.map(link => ({
        ...link,
        inMST: false,
        considered: false,
    }))}
    setGraphData(resetData);
    
  }


  const changeAlgorithm = () => {
    const x = document.getElementById("algorithmType").value;
    if (x==1){
      setGraphStates(prev => ({...prev , algorithm: 'prims'}))
      
    }
    else if (x==2){
      setGraphStates(prev => ({...prev , algorithm: 'kruskal'}))
    }
    setGraphStates(prev => ({...prev , visualize : false}));
    const resetData = {
      nodes: graphData.nodes,
      links: graphData.links.map(link => ({
        ...link,
        inMST: false,
        considered: false,
    }))}
    setGraphData(resetData);
    
  }

  const changeNextWeight = () => {
    const x = document.getElementById("nextWeight").value;
    setNextWeight(x);
  }
    

  useEffect(() => {
      
  }, []);

  useEffect(() => {
      if (steps.length > 0 && graphStates.visualize){
        const x = Math.floor(graphStates.currentStep)
        setGraphData(steps[x]);
      }
      
  }, [graphStates.currentStep, steps]);

  
  let InfoCard ;

    if(graphStates.algorithm === "prims"){
        InfoCard =(
            <div className="InfoMain2">
                <p className="InfoHeader2">Edges</p>
                <div className="InfoColor2" id= "ic1s" ></div> <p className="InfoLabel2">Under Consideration</p>
                <div className="InfoColor2" id= "ic2s" ></div> <p className="InfoLabel2">Inside Minimum Spanning Tree</p>
            </div>
        ); 
    }
    else if(graphStates.algorithm === "kruskal"){
      InfoCard =(
          <div className="InfoMain2">
              <p className="InfoHeader2">Edges</p>
              <div className="InfoColor2" id= "ic1s" ></div> <p className="InfoLabel2">Checking the next minimum weighted edge for cycles</p>
              <div className="InfoColor2" id= "ic2s" ></div> <p className="InfoLabel2">Inside Minimum Spanning Tree</p>
          </div>
      ); 
    }

  let InfoCard2 ;
    InfoCard2 = (
      <div className="InfoMain3">
          <p className="InfoHeader2">Nodes</p>
          <div className="InfoColor2" id= "ic2s" ></div> <p className="InfoLabel2">Hovering On</p>
          <div className="InfoColor2" id= "ic3s" ></div> <p className="InfoLabel2">Selected</p>
          <div className="InfoColor2" id= "ic4s" ></div> <p className="InfoLabel2">Not Selected</p>
          
          
          
      </div>
  ); 

  return (
    <div className="Container">
      <div className="interface">
        <button className= "graphButton" onClick={toggleShowWeights} style={{backgroundColor: graphStates.showWeights? '#00ff00': '#666', marginTop: '20px'}}>Show Weights</button>
        <button className= "graphButton" onClick={toggleShowId} style={{backgroundColor: graphStates.showId? '#00ff00': '#666'}}>Show Node ID</button>
        <button className= "graphButton" onClick={toggleAddNodes} style={{backgroundColor: graphStates.addingNodes? '#00ff00': '#666' }}>Add Nodes or Edges</button>
        <button className= "graphButton" onClick={toggleRemoveNodes} style={{backgroundColor: graphStates.removingNodes? '#00ff00': '#666',marginBottom: '20px'}}>Remove Nodes or Edges</button>
        
        <label for="nextWeight">Weight of the next edge: </label>
        <input type="number" id="nextWeight" onChange={changeNextWeight} min="1" max="10" style={{width: '30%' , marginBottom: '10px'}}></input>

        <label for="algorithmType"><br/>Choose an Algorithm: </label>
          <select name="algorithmType" id="algorithmType" onChange={changeAlgorithm}>
              <option value={1}>Prim's Algorithm</option>
              <option value={2}>Kruskal Algorithm</option>
          </select>
        <button className= "graphButton" onClick={toggleVisualization} style={{backgroundColor: graphStates.visualize? '#00ff00': '#666', marginTop: '20px' }}>VISUALIZE</button>
        
        {graphStates.visualize?
        <>
          <button onClick={prevStep}>Previous Step</button>
          <button onClick={nextStep}>Next Step</button>
        </>
        
        :
        <></>}
        {/* <ToggleSwitch operation={toggleShowWeights} label={'Show Weights'}/> */}

        
      </div>
      <div className="graphContainer">
        
        <Graph data={graphData} graphStates={graphStates} onNodeClick = {handleNodeClick}/>
        <div>
          {graphStates.visualize? <>{InfoCard}</>: <></>}
          {InfoCard2}
        </div>
        

      </div>
      
    </div>
  );
}

export default spanningtree;