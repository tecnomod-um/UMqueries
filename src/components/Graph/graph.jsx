import React from 'react';
import GraphStyles from "./graph.module.css";
import VisGraph from 'react-vis-graph-wrapper';

function Graph(props) {
  var graph = {
    nodes: props.nodes,
    edges: props.edges,
  };

  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: '#000000',
    },
    height: '500px',
  };

  const events = {
    select: ({ nodes, edges }) => {
      console.log("Selected nodes:");
      console.log(nodes);
      console.log("Selected edges:");
      console.log(edges);
      alert("Selected node: " + nodes);
      props.setSelectedNode(nodes);
    },
    doubleClick: ({ pointer: { canvas } }) => {
      console.log("Clicked position [" + canvas.x + "][" + canvas.y + "] on canvas.");
    }
  }
  return (
    <VisGraph
      graph={graph}
      options={options}
      events={events}
    />
  );
}

export default Graph;