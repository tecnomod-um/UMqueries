import React, { useState } from "react";
import VisGraph from "react-vis-graph-wrapper";

// Vis.js Graph component.
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
      if (nodes?.length > 0)
        setSelectedNode(nodesInGraph.find(node => node.id === Number(nodes)));
      else if (edges?.length > 0)
        setSelectedEdge(edgesInGraph.find(edge => edge.id === Number(edges)));
      else {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    },
    doubleClick: ({ nodes, edges }) => {
      if (nodes.length > 0)
        setIsOpen(true);
      else if (edges.length > 0)
        toggleIsTransitive(edgesInGraph.find(edge => edge.id === Number(edges)));
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