import { useRef, Fragment, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const VirtualTableNative = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);
  const rowVirtualizer = useVirtualizer({
    count: rowData.length,
    estimateSize: () => 40,
    getScrollElement: () => parentRef.current,
  });
 
  useEffect(() => {
    fetch("http://localhost:4000/api").then(async (res) => {
      const { columnsData, rowsData } = await res.json();
      setRowData(rowsData);
      setColumns(columnsData);
    });
  }, []);
  
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  if (rowData.length == 0 || columns.length == 0) return null;
  return (
    <div className="w-2/3 h-96 overflow-auto text-black" ref={parentRef}>
      <table className="w-full table-fixed border-spacing-0 border-collapse">
        <thead className="sticky top-0 m-0 bg-slate-500">
          <tr>
            {columns.map((col) => (
              <th key={col}  colSpan={1} style={{ width: 200 ,textAlign:"left"}}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => (
            <tr key={virtualRow.key}>
              {columns.map((col) => (
                <td key={col}>{rowData[virtualRow.index][col]}</td>
              ))}
            </tr>
          ))}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </tbody>
      </table>

      {/* {rowVirtualizer.getVirtualItems().map((row) => (
          <Fragment key={row.key}>
            {columnVirtualizer.getVirtualItems().map((col) => (
              <div
                key={`${row.key}/${col.key}`}
                style={{
                  position: "absolute",
                  height: row.size,
                  width: col.size,
                  top: 0,
                  left: 0,
                  transform: `translateX(${col.start}px) translateY(${
                    row.start + 40
                  }px)`,
                }}
              >
                {rowData[row.index][columns[col.index]]}
              </div>
            ))}
          </Fragment>
        ))} */}
    </div>
  );
};

export default VirtualTableNative;
