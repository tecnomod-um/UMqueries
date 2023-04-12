import React from 'react';
import GraphStyles from "./graph.module.css";
import VisGraph, {
  GraphData,
  GraphEvents,
  Options,
} from 'react-vis-graph-wrapper';

function Graph(props) {
  var graph: GraphData = {
    nodes: props.nodes,
    edges: props.edges,
  };

  const options: Options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: '#000000',
    },
    height: '500px',
  };

  const events: GraphEvents = {
    select: (event: any) => {
      const { nodes, edges } = event;
      console.log(nodes, edges);
    },
  };
  return (
    <VisGraph
      graph={graph}
      options={options}
      events={events}
    />
  );
}

export default Graph;