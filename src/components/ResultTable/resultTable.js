import { useState, useCallback, useEffect, useRef } from "react";
import ResultTableStyles from "./resultTable.module.css";


// Headers will be dictated by modified intrinsic properties
function getTableHeaders(filteredLists) {
  if (filteredLists == null)
    return [];
  let headers = [];
  Object.keys(filteredLists).forEach(key =>
    filteredLists[key].forEach(item => {
      Object.keys(item).forEach(innerKey => {
        if (!headers.includes(innerKey)) {
          headers.push(innerKey);
        }
      });
    })
  );
  return headers;
}

// Table will be filled with the filtered results
function getTableContent(filteredLists) {
  if (filteredLists == null || Object.keys(filteredLists).lengths === 0)
    return null;

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

// Headers will be dictated by modified intrinsic properties
const createHeaders = (headers) => {
  if (headers.length > 0)
    return headers.map((item) => ({
      text: item,
      ref: useRef()
    }));
  else return [];
}

const ResultTable = ({ filteredLists, minCellWidth }) => {
  const tableHeaders = getTableHeaders(filteredLists);
  const [tableHeight, setTableHeight] = useState("auto");
  const [activeIndex, setActiveIndex] = useState(null);
  const tableElement = useRef(null);

  console.log("printing");
  console.log(tableHeaders);
  const columns = createHeaders(tableHeaders);

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
