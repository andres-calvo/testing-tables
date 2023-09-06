import { useRef, Fragment, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDraggable, DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { columns } from "../static/dump";

const VirtualTable = () => {
  const parentRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);
  const columnSizeRef = useRef([])
  const [isDragging, setIsDragging] = useState(false);
  const rowVirtualizer = useVirtualizer({
    count: rowData.length,
    estimateSize: () => 40,
    getScrollElement: () => parentRef.current,
  });
  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columns.length,
    estimateSize: (i) => columnSizeRef.current[i],
    getScrollElement: () => parentRef.current,

  });
  useEffect(() => {
    fetch("http://localhost:4000/api").then(async (res) => {
      const { columnsData, rowsData } = await res.json();
      setRowData(rowsData);
      setColumns(columnsData);
      columnSizeRef.current=columnsData.map((col) => 200);
    });
  }, []);

  if (rowData.length == 0 || columns.length == 0) return null;
  return (
    <DndContext
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e) => {
        const colIndex = columns.findIndex((col)=> col ===e.active.id)
        console.log(e.delta)
        columnSizeRef.current = columnSizeRef.current.map((size,index)=>{
          if(index === colIndex){
            return size + e.delta.x
          }
          return size
        })
        console.log(columnSizeRef.current)

        columnVirtualizer.measure()
        setIsDragging(false)
      }}
      modifiers={[restrictToHorizontalAxis]}
    >
      <div className="w-2/3 h-96 overflow-auto text-black" ref={parentRef}>
        <div
          style={{
            width: `${columnVirtualizer.getTotalSize()}px`,
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          <div
            className="sticky top-0 border border-gray-500 shadow-lg z-10"
            style={{
              height: 40,
              gridColumnStart: 1,
              gridColumnEnd: columns.length,
            }}
          >
            {columnVirtualizer.getVirtualItems().map((col) => (
              <div
                key={col.key}
                className="border"
                style={{
                  height: 40,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: col.size,
                  transform: `translateX(${col.start}px)`,
                }}
              >
                {columns[col.index]}
                <ColumnSizing col={columns[col.index]} />
              </div>
            ))}
          </div>
          {rowVirtualizer.getVirtualItems().map((row) => (
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
          ))}
        </div>

        <p className="fixed bottom-0">
          {columns.length} Columnas X {rowData.length} Filas
        </p>
        <DragOverlay>
          {isDragging && <div className="h-96 w-2 bg-red-500 "></div>}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default VirtualTable;



const ColumnSizing = ({ col }: { col: string }) => {
  const { setNodeRef, listeners, attributes } = useDraggable({ id: col });
  return (
    <div
      className="absolute -right-1 top-0 opacity-0 hover:opacity-100 
  h-10 w-2 bg-red-500"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    ></div>
  );
};
