import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './spanningtree.css'
const Graph = ({ data, graphStates , onNodeClick}) => {
  const svgRef = useRef();
  const simulationRef = useRef();
  const tooltipRef = useRef();
  const instructionRef = useRef();

  useEffect(() => {
    const tooltip = d3.select(tooltipRef.current);
    const instruction = d3.select(instructionRef.current);

    const svg = d3.select(svgRef.current)
      .attr("width", 800)
      .attr("height", 550)
      .style("background-color" , 'black')
      .style("border", "1px solid black");
      

    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-600))
        .force('center', d3.forceCenter(350, 240));
    }

    

    const simulation = simulationRef.current;

    
    // if(graphStates.visualize){
    //   simulation.force('center', d3.forceCenter(350, 240));
    // }
    // else{
    //   simulation.force('center', d3.forceCenter(400, 240));

    // }

    // Clear previous content
    svg.selectAll('*').remove();

    // Draw links

    
    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.9)
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke-width', d => 0.5)
      
      .attr('stroke' , d =>  d.considered ? '#0000ff': d.inMST? '#ff0000': '#ffffff')
      .attr('stroke-width' , d => d.inMST ? 3 : d.considered  ? 3 :0.5 );
    
    

    const linkLabels = svg.append("g")
    .selectAll("text")
    .data(data.links)
    .enter().append("text")
    // .attr("dy", -3)
    .attr("font-size", "12px")
    .attr("fill", "white")
    .text(d => d.weight);


    const nodeLabels = svg.append("g")
    .selectAll("text")
    .data(data.nodes)
    .enter().append("text")
    .attr("font-size", "12px")
    .attr("fill", "white")
    .text(d => d.id);
    
    nodeLabels.style("fill" , "#00ff00")


    //STATES
    if(!graphStates.showWeights){
        linkLabels.style("display", "none")
    }

    if(!graphStates.showId){
        nodeLabels.style("display", "none")

    }
    

    // Draw nodes
    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', d => d.id == graphStates.selectedNode? 14: 10)
      .attr('fill', d => d.id == graphStates.selectedNode ?  '#00ff00': '#ffffff')
      .on('mouseenter' , handleMouseEnter)
      .on('mouseout' , handleMouseOut)
      .on('click' , function(event, d){
        if(onNodeClick && (graphStates.addingNodes||graphStates.removingNodes)){
          onNodeClick(d);
          
        }
      })
      
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded))
        
    

    node.append('title')
      .text(d => d.id)
    

    simulation.nodes(data.nodes).on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
        


      linkLabels
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);

      nodeLabels
        .attr("x", d => d.x-10)
        .attr("y", d =>  d.y-10);

    
    });

    simulation.force('link').links(data.links);
    simulation.force('link').distance(d => 3);
    simulation.force('link').strength(d => 0.5/d.weight);

    simulation.alpha(1).restart();

    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
      
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function handleMouseEnter(event, d) {
      tooltip.style("opacity", 1)
              .text(`On Node ID: ${d.id} 
              ,Selected Node: ${graphStates.selectedNode? graphStates.selectedNode: 'None'}`);
      if(graphStates.selectedNode ===0 ){
        d3.select(this).transition().duration(200)
        .attr('r', '14')
        .attr('fill', '#ff0000');
      }
        
      
    }

    function handleMouseOut(event, d) {
      tooltip.style("opacity", 1)
              .text(`On Node ID: None 
               ,Selected Node: ${graphStates.selectedNode? graphStates.selectedNode: 'None'}`);
      if(graphStates.selectedNode ===0 ){
        d3.select(this).transition().duration(300)
        .attr('r', '10')
        .attr('fill', '#ffffff');
      }
      
    }

    if (graphStates.addingNodes){
      if(graphStates.selectedNode ===0){
        instruction.style("opacity", 1)
              .text(`Select a Node`);
      }
      else{
        instruction.style("opacity", 1)
              .text(`Click on the selected node again to add a new node or ${'\n'}click on an existing node to add an edge with the corresponding next edge weight.`);

      }
    }
    else if(graphStates.removingNodes){
      if(graphStates.selectedNode ===0){
        instruction.style("opacity", 1)
              .text(`Select a Node.`);
      }
      else{
        instruction.style("opacity", 1)
              .text(`Click on the selected node again to remove the node or ${'\n'}click on an existing node to remove the edge in between.`);

      }

    }
    else{
      instruction.style("opacity", 0)
    }
    
    

    return () => {
      simulation.stop();
    };
  }, [data, graphStates , onNodeClick]);

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} ></svg>
      <div ref={instructionRef} className='instruction'/>
      <div ref={tooltipRef} className='tooltip'/>
      
    </div>
  );
};

export default Graph;


