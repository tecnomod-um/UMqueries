import React, { useCallback, useRef } from "react";
import QueryExporterStyles from './queryExporter.module.css';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';

// Exports all query graphs to .json file
export function QueryToFile({ getQueryData }) {
  const exportQueries = useCallback(() => {
    console.log(getQueryData())
    const { graphs, bindings, startingVar } = getQueryData();
    let modifiedGraphs = graphs.map(graph => ({
      ...graph,
      nodes: graph.nodes.map(node => {
        let label = node.label.split(' ')[0];
        return { ...node, label };
      })
    }));

    const queryData = {
      graphs: modifiedGraphs,
      bindings,
      startingVar,
    };

    const fileName = "queries.json";
    const fileData = JSON.stringify(queryData, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    saveAs(blob, fileName);
  }, [getQueryData]);

  return (
    <button className={QueryExporterStyles.file_button} onClick={exportQueries}>
      <span className={QueryExporterStyles.buttonText}>Export queries</span>
      <DownloadIcon className={QueryExporterStyles.buttonIcon} />
    </button>
  );
}

// Imports a query .json file to the app 
export function FileToQuery({ onFileSelect }) {
  const fileInputRef = useRef(null);
  const handleFileSelect = () => {
    if (fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target.result;
        const queryData = JSON.parse(fileData);
        onFileSelect(queryData);
      }
      reader.readAsText(file);
    }
  };
  return (
    <div onClick={() => fileInputRef.current.click()} className={QueryExporterStyles.file_button}>
      <input className={QueryExporterStyles.hiddenInput}
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      <span className={QueryExporterStyles.buttonText}>Load queries</span>
      <UploadFileIcon className={QueryExporterStyles.buttonIcon} />
    </div>
  );
}
