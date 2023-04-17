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
      props.setSelectedNode(props.nodes[nodes]);
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
      ref={(network: Network) => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
        console.log(network);
      }}
    />
  );
}

export default Graph;