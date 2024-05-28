import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Graph = ({ data }) => {
  const svgRef = useRef();
  const simulationRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(300, 200));
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
      .attr('stroke-width', d => Math.sqrt(d.value));

    // Draw nodes
    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', 10)
      .attr('fill', '#69b3a2')
      .on('mouseover' , handleMouseOver)
      .on('mouseout' , handleMouseOut)
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

    node.append('title')
      .text(d => d.id);

    simulation.nodes(data.nodes).on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });

    simulation.force('link').links(data.links);
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
      d3.select(this).attr('fill', '#ff0000');
      
    }

    function handleMouseOut(event, d) {
      d3.select(this).attr('fill', '#69b3a2');
      
    }

    return () => {
      // Cleanup the simulation on component unmount
      simulation.stop();
    };
  }, [data]);

  return (
    <svg ref={svgRef} width="800" height="600" ></svg>
  );
};

export default Graph;