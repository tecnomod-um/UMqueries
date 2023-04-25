import React from 'react';
import { useRef } from 'react';
import VisGraph from 'react-vis-graph-wrapper';

// Graph component.
function Graph({ nodesInGraph, edgesInGraph, setSelectedNode, setIsOpen }) {

  //const windowSize = useRef([window.innerWidth, window.innerHeight]);
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
    //TODO set height to something like windowSize.current[1]*0.55+'px', but functional
    height: '500px',
  }

  const events = {
    select: ({ nodes, edges }) => {
      setSelectedNode(nodesInGraph[nodes]);
    },
    doubleClick: ({ nodes, edges }) => {
      if (nodes.length > 0)
        setIsOpen(true);
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