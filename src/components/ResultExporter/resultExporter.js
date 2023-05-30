import React from 'react';
import { DropdownMenuItem } from "../Dropdown/dropdown";
import { saveAs } from 'file-saver';
import XLSX from 'xlsx/dist/xlsx.full.min.js';

const ResultExporter = ({ data, fileType }) => {
    const handleExport = () => {
        let content = '';
        if (!data) return;
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

    const convertToTXT = (data) => {
        const nestedArrays = Object.values(data);
        const headers = Object.keys(nestedArrays[0][0]).join('\t');
        const rows = nestedArrays.flatMap((nestedArray) => {
            const rowData = nestedArray.map((item) => Object.values(item).join('\t'));
            return rowData.length ? rowData : ['']; // Add an empty row if no data in the array
        });
        return `${headers}\n${rows.join('\n')}`;
    };

    const convertToODS = (data) => {
        const workbook = XLSX.utils.book_new();
        const combinedData = Object.values(data).flatMap((sheetDataArray) => sheetDataArray);
        const headers = Array.from(new Set(combinedData.flatMap(Object.keys)));
        const sheetData = combinedData.map(Object.values);
        const sheet = XLSX.utils.json_to_sheet([headers], { skipHeader: true });
        XLSX.utils.sheet_add_json(sheet, sheetData, { skipHeader: true, origin: 'A2' });
        XLSX.utils.book_append_sheet(workbook, sheet, 'Combined Data');

        const odsContent = XLSX.write(workbook, { bookType: 'ods', type: 'binary' });
        const content = new Blob([s2ab(odsContent)], {
            type: 'application/vnd.oasis.opendocument.spreadsheet',
        });
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
