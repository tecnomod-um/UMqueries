import React from "react";
import VisGraph from "react-vis-graph-wrapper";
import GraphStyles from "./graph.module.css";

// Vis.js Graph component.
function Graph({ activeGraph, setSelectedNode, setSelectedEdge, setDataOpen, toggleIsTransitive }) {

  const nodesInGraph = activeGraph.nodes;
  const edgesInGraph = activeGraph.edges;

  const options = {
    height: '100%',
    width: '100%',
  };

  const graph = {
    nodes: nodesInGraph,
    edges: edgesInGraph,
  };

  const handleNodeSelection = (selectedNodes, selectedEdges) => {
    if (selectedNodes?.length > 0)
      setSelectedNode(nodesInGraph.find(node => node.id === Number(selectedNodes)));
    else if (selectedEdges?.length > 0)
      setSelectedEdge(edgesInGraph.find(edge => edge.id === Number(selectedEdges)));
  };

  const events = {
    dragStart: ({ nodes, edges }) => handleNodeSelection(nodes, edges),
    click: ({ nodes, edges }) => handleNodeSelection(nodes, edges),
    doubleClick: ({ nodes, edges }) => {
      if (nodes.length > 0)
        setDataOpen(true);
      else if (edges.length > 0)
        toggleIsTransitive(edgesInGraph.find(edge => edge.id === Number(edges)));
    },
    deselectNode: () => {
      setSelectedNode(null);
      setSelectedEdge(null);
    }
  };

  return (
    <div id="map" className={GraphStyles.map} alt="Graph showing the query to be made.">
      <VisGraph
        graph={graph}
        options={options}
        events={events}
      />
    </div>
  );
}

export default Graph;
