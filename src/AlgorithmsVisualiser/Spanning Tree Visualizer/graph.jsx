import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Graph = ({ data, controlStates , onNodeClick}) => {
  const svgRef = useRef();
  const simulationRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr("width", 800)
      .attr("height", 550)
      .style("background-color" , 'white')
      .style("border", "1px solid black");
      

    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-700))
        .force('center', d3.forceCenter(350, 240));
    }

    const simulation = simulationRef.current;

    // Clear previous content
    svg.selectAll('*').remove();

    // Draw links
    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.9)
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke-width', d => 1);

    const linkLabels = svg.append("g")
    .selectAll("text")
    .data(data.links)
    .enter().append("text")
    // .attr("dy", -3)
    .attr("font-size", "12px")
    .attr("fill", "black")
    .text(d => d.weight);

    //STATES
    if(!controlStates.showWeights){
        linkLabels.style("display", "none")
    }
    

    // Draw nodes
    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', 10)
      .attr('fill', '#00ff00')
      .on('mouseover' , handleMouseOver)
      .on('mouseout' , handleMouseOut)
      .on('click' , function(event, d){
        if(onNodeClick && controlStates.addingNodes){
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
    });

    simulation.force('link').links(data.links);
    simulation.force('link').distance(d => d.weight *40);
    simulation.force('link').strength(d => d.weight *0.2);

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

    function handleMouseOver(event, d) {
      d3.select(this).transition().duration(200)
        .attr('r', '12')
        .attr('fill', '#ff0000');
      
    }

    function handleMouseOut(event, d) {
      
      d3.select(this).transition().duration(200)
        .attr('r', '10')
        .attr('fill', '#00ff00');
      
      
    }

    return () => {
      // Cleanup the simulation on component unmount
      simulation.stop();
    };
  }, [data, controlStates , onNodeClick]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default Graph;