import {
  columns,
  rowData,
  filteredRows,
} from "../static/dump";

const NormalTable = () => {
  return (
    <div className="w-2/3 overflow-auto">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowData.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={`${row.id}/${col}`}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NormalTable;
