import React, { useState } from 'react';
import VisGraph from 'react-vis-graph-wrapper';

// Vis js Graph component.
function Graph({ nodesInGraph, edgesInGraph, setSelectedNode, setSelectedEdge, setIsOpen, toggleIsTransitive }) {

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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  const graph = {
    nodes: nodesInGraph,
    edges: edgesInGraph,
  }

  const events = {
    select: ({ nodes, edges }) => {
      nodesInGraph[nodes] ? (console.log("Selected node ? [" + nodesInGraph[nodes].id + "]")) : (console.log("No node selected"));
      edgesInGraph[edges] ? (console.log("Selected edge ? [" + edgesInGraph[edges].id + "]")) : (console.log("No edge selected"));
      setSelectedNode(nodesInGraph[nodes]);
      setSelectedEdge(edgesInGraph[edges]);
      console.log("Nodes and edges [" + nodesInGraph.length + "] [" + edgesInGraph.length + "]");
    },
    doubleClick: ({ nodes, edges }) => {
      if (nodes.length > 0)
        setIsOpen(true);
      else if (edges.length > 0)
        toggleIsTransitive(edgesInGraph[edges]);
    }
  }

  return (
    <div id="map" alt="Graph showing the query to be made.">
      <VisGraph
        graph={graph}
        options={options}
        events={events}
      />
    </div>
  );
}

export default Graph;