import React from 'react';
import { DropdownMenuItem } from "../Dropdown/dropdown";
import { saveAs } from 'file-saver';

const Exporter = ({ data, fileType }) => {
    const handleExport = () => {
        let content = '';

        switch (fileType) {
            case 'csv':
                const csvContent = convertToCSV(data);
                content = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
                break;

            case 'tsv':
                const tsvContent = convertToTSV(data);
                content = `data:text/plain;charset=utf-8,${encodeURIComponent(tsvContent)}`;
                break;

            case 'odt':
                const odtContent = convertToODT(data);
                content = `data:application/vnd.oasis.opendocument.text;charset=utf-8,${encodeURIComponent(odtContent)}`;
                break;

            case 'txt':
                const txtContent = convertToTXT(data);
                content = `data:text/plain;charset=utf-8,${encodeURIComponent(txtContent)}`;
                break;

            default:
                console.error(`Unsupported file type: ${fileType}`);
                return;
        }

        const fileName = `export.${fileType}`;
        saveAs(content, fileName);
    };

    const convertToCSV = (data) => {
        const nestedArrays = Object.values(data);
        const headers = Object.keys(nestedArrays[0][0]).join(',');
        const rows = nestedArrays.flatMap((nestedArray) =>
          nestedArray.map((item) => Object.values(item).join(','))
        );
        return `${headers}\n${rows.join('\n')}`;
      };
      
      const convertToTSV = (data) => {
        const nestedArrays = Object.values(data);
        const headers = Object.keys(nestedArrays[0][0]).join('\t');
        const rows = nestedArrays.flatMap((nestedArray) =>
          nestedArray.map((item) => Object.values(item).join('\t'))
        );
        return `${headers}\n${rows.join('\n')}`;
      };
      
      const convertToODT = (data) => {
      };
      
      const convertToTXT = (data) => {
        const nestedArrays = Object.values(data);
        const rows = nestedArrays.flatMap((nestedArray) =>
          nestedArray.map((item) => Object.values(item).join('\t'))
        );
        return rows.join('\n');
      };
          

    return (
        <DropdownMenuItem onClick={handleExport}>
            {fileType.toUpperCase()}
        </DropdownMenuItem>
    );
};

export default Exporter;