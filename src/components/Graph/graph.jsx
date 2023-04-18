import React from 'react';
import GraphStyles from "./graph.module.css";
import VisGraph from 'react-vis-graph-wrapper';

// Graph component.
function Graph({ nodesInGraph, edgesInGraph, setSelectedNode }) {
  var graph = {
    nodes: nodesInGraph,
    edges: edgesInGraph,
  }

  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: '#000000',
    },
    height: '500px',
  }

  const events = {
    select: ({ nodes, edges }) => {
      console.log("Selected nodes:");
      console.log(nodes);
      console.log("Selected edges:");
      console.log(edges);
      setSelectedNode(nodesInGraph[nodes]);
    },
    doubleClick: ({ pointer: { canvas } }) => {
      console.log("Clicked position [" + canvas.x + "][" + canvas.y + "] on canvas.");
    }
  }

  return (
    <VisGraph className={GraphStyles.graph}
      graph={graph}
      options={options}
      events={events}
    />
  );
}

export default Graph;