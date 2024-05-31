import React, {useState , useEffect} from "react";
import './pathfinding.css'
import { MinHeap } from 'mnemonist';

import Graph from "./graph";
import { index } from "d3";


function pathfinding(){
    
  const [graphStates , setGraphStates] = useState({
    showWeights: true, 
    showId: false,
    addingNodes: false ,
    removingNodes: false , 
    algorithm: 'bfs' ,
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

  const dfsAlgorithm = (data, source, destination) => {
    const nodes = data.nodes.map(node => ({ id: node.id }));
    const links = data.links.map(link => ({ source: link.source.id, target: link.target.id, weight: link.weight }));
    const steps = [];
    const visited = new Set();
    const stack = [source];
    const parents = {};

    while (stack.length > 0) {
        const currentNode = stack.pop();

        if (!visited.has(currentNode)) {
            visited.add(currentNode);

            const step = {
                nodes,
                links: links.map(link => ({
                    ...link,
                    visited: visited.has(link.source) && visited.has(link.target),
                    considered: link.source === currentNode || link.target === currentNode,
                    path: false 
                }))
            };
            steps.push(step);

            if (currentNode === destination) break;

            const neighbors = links
                .filter(link => link.source === currentNode || link.target === currentNode)
                .map(link => (link.source === currentNode ? link.target : link.source))
                .filter(neighbor => !visited.has(neighbor));

            neighbors.forEach(neighbor => {
                stack.push(neighbor);
                parents[neighbor] = currentNode;
            });
        }
    }

    const finalStep = {
        nodes,
        links: links.map(link => {
            let path = false;
            let currentNode = destination;
            while (currentNode !== source) {
                const parent = parents[currentNode];
                if ((link.source === currentNode && link.target === parent) || (link.target === currentNode && link.source === parent)) {
                    path = true;
                }
                currentNode = parent;
            }
            return {
                ...link,
                visited: visited.has(link.source) && visited.has(link.target),
                considered: false,
                path
            };
        })
    };
    steps.push(finalStep);

    return steps;
};
  
const bfsAlgorithm = (data, source, destination) => {
  const nodes = data.nodes.map(node => ({ id: node.id }));
  const links = data.links.map(link => ({ source: link.source.id, target: link.target.id, weight: link.weight }));
  const steps = [];
  const visited = new Set();
  const queue = [source];
  const parents = {};

  while (queue.length > 0) {
      const currentNode = queue.shift();

      if (!visited.has(currentNode)) {
          visited.add(currentNode);

          const step = {
              nodes,
              links: links.map(link => ({
                  ...link,
                  visited: visited.has(link.source) && visited.has(link.target),
                  considered: link.source === currentNode || link.target === currentNode,
                  path: false 
              }))
          };
          steps.push(step);

          if (currentNode === destination) break;

          const neighbors = links
              .filter(link => link.source === currentNode || link.target === currentNode)
              .map(link => (link.source === currentNode ? link.target : link.source))
              .filter(neighbor => !visited.has(neighbor));

          neighbors.forEach(neighbor => {
              queue.push(neighbor);
              parents[neighbor] = currentNode;
          });
      }
  }

  
  const finalStep = {
      nodes,
      links: links.map(link => {
          let path = false;
          let currentNode = destination;
          while (currentNode !== source) {
              const parent = parents[currentNode];
              if ((link.source === currentNode && link.target === parent) || (link.target === currentNode && link.source === parent)) {
                  path = true;
              }
              currentNode = parent;
          }
          return {
              ...link,
              visited: visited.has(link.source) && visited.has(link.target),
              considered: false,
              path
          };
      })
  };
  steps.push(finalStep);

  return steps;
};
  
const dijkstraAlgorithm = (data, source, destination) => {
  const nodes = data.nodes.map(node => ({ id: node.id }));
  const links = data.links.map(link => ({ source: link.source.id, target: link.target.id, weight: link.weight }));
  const steps = [];
  const distances = {};
  const previous = {};
  const visited = new Set();
  const queue = new MinHeap((a, b) => a.distance - b.distance);

  nodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
  });
  distances[source] = 0;

  queue.push({ id: source, distance: 0 });

  while (queue.size > 0) {
      const { id: currentNode } = queue.pop();
      visited.add(currentNode);

      const step = {
          nodes,
          links: links.map(link => ({
              ...link,
              visited: visited.has(link.source) && visited.has(link.target),
              considered: link.source === currentNode || link.target === currentNode,
              path: false
          }))
      };
      steps.push(step);

      if (currentNode === destination) break;

      const neighbors = links
          .filter(link => link.source === currentNode || link.target === currentNode)
          .map(link => ({
              ...link,
              neighbor: link.source === currentNode ? link.target : link.source,
          }));

      for (const { neighbor, weight } of neighbors) {
          if (!visited.has(neighbor)) {
              const newDistance = distances[currentNode] + weight;
              if (newDistance < distances[neighbor]) {
                  distances[neighbor] = newDistance;
                  previous[neighbor] = currentNode;
                  queue.push({ id: neighbor, distance: newDistance });
              }
          }
      }
  }

  const finalStep = {
      nodes,
      links: links.map(link => {
          let path = false;
          let currentNode = destination;
          while (currentNode !== source) {
              const parent = previous[currentNode];
              if ((link.source === currentNode && link.target === parent) || (link.target === currentNode && link.source === parent)) {
                  path = true;
              }
              currentNode = parent;
          }
          return {
              ...link,
              visited: visited.has(link.source) && visited.has(link.target),
              considered: false,
              path
          };
      })
  };
  steps.push(finalStep);

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
    if (graphStates.algorithm == 'bfs'){
      const bfsSteps = bfsAlgorithm(graphData , source, destination);
      setSteps(bfsSteps);
      setGraphStates(prev => ({...prev , visualize: !graphStates.visualize , currentStep: 0 , addingNodes: false , removingNodes: false }));
      
    }
    else if(graphStates.algorithm == 'dfs'){
      const dfsSteps = dfsAlgorithm(graphData ,source,destination);
      
      setSteps(dfsSteps);
      setGraphStates(prev => ({...prev , visualize: !graphStates.visualize , currentStep: 0 , addingNodes: false , removingNodes: false }));

    }
    else if(graphStates.algorithm == 'dijkstra'){
      const dijkstra = dijkstraAlgorithm(graphData ,source,destination);
      
      setSteps(dijkstra);
      setGraphStates(prev => ({...prev , visualize: !graphStates.visualize , currentStep: 0 , addingNodes: false , removingNodes: false }));

    }
    const resetData = {
      nodes: graphData.nodes,
      links: graphData.links.map(link => ({
        ...link,
        visited: false,
        considered: false,
    }))}
    setGraphData(resetData);


  }




  const changeAlgorithm = () => {
    const x = document.getElementById("algorithmType").value;
    if (x==1){
      setGraphStates(prev => ({...prev , algorithm: 'bfs'}))
      
    }
    else if (x==2){
      setGraphStates(prev => ({...prev , algorithm: 'dfs'}))
    }
    else if (x==3){
      setGraphStates(prev => ({...prev , algorithm: 'dijkstra'}))
    }
    setGraphStates(prev => ({...prev , visualize : false}));
    const resetData = {
      nodes: graphData.nodes,
      links: graphData.links.map(link => ({
        ...link,
        visited: false,
        considered: false,
    }))}
    setGraphData(resetData);
    
  }


  
  const changeNextWeight = () => {
    const x = document.getElementById("nextWeight").value;
    setNextWeight(x);
  }

  const [destination , setDestination] = useState(8)
  const changeDestination =() => {
    const x = Number(document.getElementById("destination").value);
    setDestination(x);
  }
  const [source , setSource] = useState(1)
  const changeSource =() => {
    const x = Number(document.getElementById("source").value);
    setSource(x);

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

    if(graphStates.algorithm === "bfs"){
        InfoCard =(
            <div className="InfoMain2">
                <p className="InfoHeader2">Edges</p>
                <div className="InfoColor2" id= "ic1s" ></div> <p className="InfoLabel2">Visited Edges</p>
                <div className="InfoColor2" id= "ic2s" ></div> <p className="InfoLabel2">Path Generated</p>
                <div className="InfoColor2" id= "ic3s" ></div> <p className="InfoLabel2">Neighbouring Edges</p>
            </div>
        ); 
    }
    else if(graphStates.algorithm === "dfs"){
      InfoCard =(
          <div className="InfoMain2">
              <p className="InfoHeader2">Edges</p>
              <div className="InfoColor2" id= "ic1s" ></div> <p className="InfoLabel2">Visited Edges or edges to visited nodes</p>
              <div className="InfoColor2" id= "ic2s" ></div> <p className="InfoLabel2">Generated Path</p>
              <div className="InfoColor2" id= "ic3s" ></div> <p className="InfoLabel2">Neighbouring Edges to the newly traversed node</p>
              
          </div>
      ); 
    }
    else if(graphStates.algorithm === "dijkstra"){
      InfoCard =(
          <div className="InfoMain2">
              <p className="InfoHeader2">Edges</p>
              <div className="InfoColor2" id= "ic1s" ></div> <p className="InfoLabel2">Analysed Path</p>
              <div className="InfoColor2" id= "ic2s" ></div> <p className="InfoLabel2">Shortest Path</p>
              <div className="InfoColor2" id= "ic3s" ></div> <p className="InfoLabel2">New Neighbouring Paths to be Analysed</p>
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
        <label for="source"><br/>Source: </label>
        <input type="number" id="source" onChange={changeSource} min="1" max="10" style={{width: '30%' , marginBottom: '10px'}}></input>
        <label for="destination"><br/>Destination: </label>
        <input type="number" id="destination" onChange={changeDestination} min="1" max="10" style={{width: '30%' , marginBottom: '10px'}}></input>

        <label for="algorithmType"><br/>Choose an Algorithm: </label>
            <select name="algorithmType" id="algorithmType" onChange={changeAlgorithm}>
              <option value={1}>BFS Algorithm</option>
              <option value={2}>DFS Algorithm</option>
              <option value={3}>Dijkstra</option>

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

export default pathfinding;