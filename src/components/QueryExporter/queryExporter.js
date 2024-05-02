import React, { useCallback, forwardRef } from "react";
import { saveAs } from 'file-saver';
import QueryExporterStyles from './queryExporter.module.css';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export const QueryToFile = forwardRef(({ getQueryData }, ref) => {
  const exportQueries = useCallback(() => {
    const { graphs, bindings, filters, startingVar, isDistinct, isCount } = getQueryData();
    const modifiedGraphs = graphs.map(graph => ({
      ...graph,
      nodes: graph.nodes.map(node => ({ ...node, label: node.label.split(' ')[0] })),
      edges: graph.edges.map(edge => (edge.data === 'UNION' ? { ...edge, isUnion: true } : edge))
    }));

    const queryData = {
      graphs: modifiedGraphs,
      bindings,
      filters,
      startingVar,
      isDistinct,
      isCount
    };

    const fileName = "queries.json";
    const fileData = JSON.stringify(queryData, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    saveAs(blob, fileName);
  }, [getQueryData]);

  return (
    <button ref={ref} className={QueryExporterStyles.file_button} onClick={exportQueries}>
      <span className={QueryExporterStyles.buttonText}>Export query</span>
      <DownloadIcon className={QueryExporterStyles.buttonIcon} />
    </button>
  );
});

// Imports a query .json file to the app
export const FileToQuery = forwardRef(({ onFileSelect }, ref) => {
  const handleFileSelect = () => {
    if (ref.current.files.length > 0) {
      const file = ref.current.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target.result;
        const queryData = JSON.parse(fileData);
        onFileSelect(queryData);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div onClick={() => ref.current.click()} className={QueryExporterStyles.file_button}>
      <input
        className={QueryExporterStyles.hiddenInput}
        type="file"
        accept=".json"
        ref={ref}
        onChange={handleFileSelect}
      />
      <span className={QueryExporterStyles.buttonText}>Load query</span>
      <UploadFileIcon className={QueryExporterStyles.buttonIcon} />
    </div>
  );
});
