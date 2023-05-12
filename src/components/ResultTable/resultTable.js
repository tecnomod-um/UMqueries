import React, { useState, useCallback, useEffect, useRef } from "react";
import ResultTableStyles from "./resultTable.module.css";

function getTableHeaders(filteredLists) {
  if (!filteredLists) {
    return [];
  }
  const headers = new Set();
  Object.values(filteredLists).forEach((items) => {
    items.forEach((item) => {
      Object.keys(item).forEach((key) => {
        headers.add(key);
      });
    });
  });
  return Array.from(headers);
}

function getTableContent(filteredLists) {
  if (!filteredLists || Object.keys(filteredLists).length === 0) {
    return null;
  }

  return (
    <tbody className={ResultTableStyles.resTbody}>
      {Object.keys(filteredLists).map(key =>
        filteredLists[key].map((item, index) => (
          <tr key={`${key}-${index}`} className={ResultTableStyles.resTr}>
            {Object.keys(item).map(innerKey => (
              <td key={`${key}-${index}-${innerKey}`} className={ResultTableStyles.resTd}>
                <span className={ResultTableStyles.resSpan}>{item[innerKey]}</span>
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
}

const ResultTable = ({ filteredLists, minCellWidth }) => {
  // MAKE HOOK IN COLUMNS WORK
  const [tableHeight, setTableHeight] = useState("auto");
  const [activeIndex, setActiveIndex] = useState(null);
  const tableElement = useRef(null);
  const [columns, setColumns] = useState(createHeaders(['.']));

  function createHeaders(headers) {
    if (headers.length === 0) {
      return [];
    }

    return headers.map((item) => ({
      text: item,
      ref: React.createRef()
    }));
  }

  useEffect(() => {
    const tableHeaders = getTableHeaders(filteredLists);
    setColumns(createHeaders(tableHeaders));
  }, [filteredLists]);

  useEffect(() => {
    setTableHeight(tableElement.current.offsetHeight);
  }, []);

  const mouseDown = (index) => {
    setActiveIndex(index);
  };

  const mouseMove = useCallback(
    (e) => {
      const gridColumns = columns.map((col, i) => {
        if (i === activeIndex) {
          const width = e.clientX - col.ref.current.offsetLeft;

          if (width >= minCellWidth) {
            return `${width}px`;
          }
        }
        return `${col.ref.current.offsetWidth}px`;
      });

      tableElement.current.style.gridTemplateColumns = `${gridColumns.join(
        " "
      )}`;
    },
    [activeIndex, columns, minCellWidth]
  );

  const removeListeners = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveIndex(null);
    removeListeners();
  }, [setActiveIndex, removeListeners]);

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => {
      removeListeners();
    };
  }, [activeIndex, mouseMove, mouseUp, removeListeners]);

  return (
    <span>
      <div className={ResultTableStyles.tableWrapper}>
        <table className={ResultTableStyles.resTable} ref={tableElement}>
          <thead className={ResultTableStyles.resThead}>
            <tr className={ResultTableStyles.resTr}>
              {columns.map(({ ref, text }, i) => (
                <th className={ResultTableStyles.resTh} ref={ref} key={text}>
                  <span className={ResultTableStyles.resSpan}>{text}</span>
                  <div
                    style={{ height: tableHeight }}
                    onMouseDown={() => mouseDown(i)}
                    className={`${ResultTableStyles.resizeHandle} ${activeIndex === i ? ResultTableStyles.active : "idle"
                      }`}
                  />
                </th>
              ))}
            </tr>
          </thead>
          {getTableContent(filteredLists)}
        </table>
      </div>
    </span>
  );
};

export default ResultTable;
