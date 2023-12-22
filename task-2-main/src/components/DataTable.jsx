const DataTable = ({ data, fields }) => {
  const dataArray = Array.from(Object.entries(data), ([key, value]) => ({
    key,
    ...value,
  }));
  dataArray.sort((a, b) => b.popularity - a.popularity);
  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-black-500 dark:text-black-900">
        <thead className="text-xs text-gray-700 uppercase bg-white-50 ">
          <tr>
            {Object.keys(fields).map((field, idx) => (
              <th key={idx} scope="col" className="px-6 py-3">
                {field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataArray.map((row, idx) => (
            <tr
              key={idx}
              className="bg-white dark:bg-white-800 hover:bg-white-50 dark:hover:bg-white-600"
            >
              {Object.keys(fields).map((label, labelIdx) => (
                <td
                  key={labelIdx}
                  className="px-6 py-4 font-medium text-black-900 whitespace-nowrap dark:text-black"
                >
                  {label == "price" && <span>₹ </span>}
                  {row[label]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
