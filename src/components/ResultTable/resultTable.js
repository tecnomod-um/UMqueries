import { useState, useCallback, useEffect, useRef } from "react";
import ResultTableStyles from "./resultTable.module.css";


// Headers will be dictated by modified intrinsic properties
function getHeaders(headers) {
  if (headers.length > 0)
    return headers.map((item) => ({
      text: item,
      ref: useRef()
    }));
  else return null;
};

function getTableContent(filteredList) {
  const tableRows = filteredList.map(element => {
    {

    }
  });
  return (
    <tbody className={ResultTableStyles.resTbody}>
      {tableRows}
    </tbody>);
}


const tableContent = (
  <tbody className={ResultTableStyles.resTbody}>
    < tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Large Detroit Style Pizza</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3213456785</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$31.43</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Pending</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Dave</span>
      </td>
    </tr >
    <tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>
          Double Decker Club With Fries. Pickles, extra side avacado
        </span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>9874563245</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$12.99</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Delivered</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Cathy</span>
      </td>
    </tr>
    <tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Family Sized Lobster Dinner</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3456781234</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$320.00</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>In Progress</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Alexander</span>
      </td>
    </tr>
    <tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Family Sized Lobster Dinner</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3456781234</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$320.00</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>In Progress</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Alexander</span>
      </td>
    </tr>
    <tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Family Sized Lobster Dinner</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3456781234</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$320.00</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>In Progress</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Alexander</span>
      </td>
    </tr>
    <tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Family Sized Lobster Dinner</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3456781234</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$320.00</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>In Progress</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Alexander</span>
      </td>
    </tr>
    <tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Family Sized Lobster Dinner</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3456781234</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$320.00</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>In Progress</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Alexander</span>
      </td>
    </tr>
    <tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Family Sized Lobster Dinner</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3456781234</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$320.00</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>In Progress</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Alexander</span>
      </td>
    </tr>
    <tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Family Sized Lobster Dinner</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3456781234</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$320.00</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>In Progress</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Alexander</span>
      </td>
    </tr>
    <tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Family Sized Lobster Dinner</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3456781234</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$320.00</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>In Progress</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Alexander</span>
      </td>
    </tr>
    <tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Family Sized Lobster Dinner</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3456781234</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$320.00</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>In Progress</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Alexander</span>
      </td>
    </tr>
    <tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Family Sized Lobster Dinner</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3456781234</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$320.00</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>In Progress</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Alexander</span>
      </td>
    </tr>
    <tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Family Sized Lobster Dinner</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3456781234</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$320.00</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>In Progress</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Alexander</span>
      </td>
    </tr>
    <tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Family Sized Lobster Dinner</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3456781234</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$320.00</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>In Progress</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Alexander</span>
      </td>
    </tr>
  </tbody>
);

// Headers will be dictated by modified intrinsic properties
const createHeaders = (headers) => {
  if (headers.length > 0)
    return headers.map((item) => ({
      text: item,
      ref: useRef()
    }));
  else return null;
};

const createContents = (content) => {
  // content.map(element =>{})
  const tableRows = content.map(element => {
    return (<tr className={ResultTableStyles.resTr}>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Family Sized Lobster Dinner</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>3456781234</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>$320.00</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>In Progress</span>
      </td>
      <td className={ResultTableStyles.resTd}>
        <span className={ResultTableStyles.resSpan}>Alexander</span>
      </td>
    </tr>);
  })

  var result = (<tbody className={ResultTableStyles.resTbody}>{tableRows}</tbody>);
  return result;
}

const ResultTable = ({ varData, filteredList, minCellWidth }) => {
  //console.log("VARDATA: [" + varData + "]");
  console.log("LIST: [" + JSON.stringify(filteredList) + "]");
  const [tableHeight, setTableHeight] = useState("auto");
  const [activeIndex, setActiveIndex] = useState(null);
  const [headers, setHeaders] = useState([
    "Label",
    "Uri",
    "Property1",
    "Property2",
    "Property3"
  ]);

  const tableElement = useRef(null);
  const columns = createHeaders(headers);

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
          {tableContent}
        </table>
      </div>
    </span>
  );
};

export default ResultTable;
