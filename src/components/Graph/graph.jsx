import React, { useState } from 'react';
import VisGraph from 'react-vis-graph-wrapper';

// Vis js Graph component.
function Graph({ nodesInGraph, edgesInGraph, setSelectedNode, setIsOpen, toggleIsTransitive }) {

  function getMapHeight() {
    return (window.innerHeight / 1.85);
  }

  const [options, setOptions] = useState({
    autoResize: false,
    height: getMapHeight() + "px"
  });

  // Adjusts the graph height accordingly on resize
  React.useEffect(() => {
    function handleResize() {
      setOptions({
        autoResize: false,
        height: getMapHeight() + "px"
      });
    }
    window.addEventListener('resize', handleResize)
  })

  const graph = {
    nodes: nodesInGraph,
    edges: edgesInGraph,
  }

  const events = {
    select: ({ nodes, edges }) => {
      setSelectedNode(nodesInGraph[nodes]);
    },
    doubleClick: ({ nodes, edges }) => {
      if (nodes.length > 0)
        setIsOpen(true);
      if ((edges.length > 0) && (nodes.length === 0)) {
        toggleIsTransitive(edgesInGraph[edges]);
      }
    }
  }

  return (
    <div id="map">
      <VisGraph
        graph={graph}
        options={options}
        events={events}
        alt="Graph showing the query to be made."
      />
    </div>
  );
}

export default Graph;