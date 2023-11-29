import React from 'react';
import { DropdownMenuItem } from "../Dropdown/dropdown";
import { saveAs } from 'file-saver';
import XLSX from 'xlsx';

// Exports the result to the passed filetype
const ResultExporter = ({ data, fileType }) => {
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
            case 'txt':
                const txtContent = convertToTXT(data);
                content = `data:text/plain;charset=utf-8,${encodeURIComponent(txtContent)}`;
                break;
            case 'ods':
                const odsContent = convertToODS(data);
                content = odsContent;
                break;
            default:
                console.error(`Unsupported file type: ${fileType}`);
                return;
        }
        const fileName = `UMquery.${fileType}`;
        saveAs(content, fileName);
    };

    const convertToCSV = (data) => {
        const headers = Object.keys(data).join(',');
        const rows = Array.from({ length: data[Object.keys(data)[0]].length }, (_, idx) =>
            Object.values(data).map((column) => column[idx]).join(',')
        );
        return `${headers}\n${rows.join('\n')}`;
    };

    const convertToTSV = (data) => {
        const headers = Object.keys(data).join('\t');
        const rows = Array.from({ length: data[Object.keys(data)[0]].length }, (_, idx) =>
            Object.values(data).map((column) => column[idx]).join('\t')
        );
        return `${headers}\n${rows.join('\n')}`;
    };

    const convertToTXT = (data) => {
        const headers = Object.keys(data);
        const rows = Array.from({ length: data[headers[0]].length }, (_, idx) =>
            headers.map((header) => `${header}: ${data[header][idx]}`).join(', ')
        );
        return rows.join('\n');
    };    

    const convertToODS = (data) => {
        const workbook = XLSX.utils.book_new();
        const headers = Object.keys(data);
        const rows = Array.from({ length: data[headers[0]].length }, (_, idx) =>
            Object.values(data).map((column) => column[idx])
        );
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Query results');
        const odsContent = XLSX.write(workbook, { bookType: 'ods', type: 'binary' });
        const content = new Blob([s2ab(odsContent)], { type: 'application/vnd.oasis.opendocument.spreadsheet' });
        return URL.createObjectURL(content);
    };

    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
    };

    return (
        <DropdownMenuItem onClick={handleExport}>
            {fileType.toUpperCase()}
        </DropdownMenuItem>
    );
};

export default ResultExporter;
