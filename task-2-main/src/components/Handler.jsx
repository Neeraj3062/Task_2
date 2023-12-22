import { useState } from "react";
import ItemList from "./ItemList";
import DataTable from "./DataTable";

const Handler = () => {
  const [dataField, setDataField] = useState({});
  const [selectedField, setSelectedField] = useState({});
  const [fullData, setFullData] = useState([]);

  const handleFileUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType == "application/json") {
        const reader = new FileReader();
        reader.onload = function (e) {
          const content = e.target.result;
          try {
            const parsedData = JSON.parse(content);
            setFullData(parsedData.products);
            let dataList = {};
            Object.keys(parsedData.products[12]).forEach((key) => {
              dataList[key] = true;
            });
            setDataField(dataList);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        };
        reader.readAsText(file);
      } else {
        const fileUrl = URL.createObjectURL(file);
        const response = await fetch(fileUrl);
        const text = await response.text();
        const lines = text.split("\n");
        setFullData(lines);
        const _data = lines[0].split(",");
        setDataField(_data);
      }
    }
  };

  const transferCheckedItems = (from, setFrom, to, setTo) => {
    const transferFrom = { ...from },
      transferTo = { ...to };

    for (let key in transferFrom) {
      if (transferFrom[key] === true) {
        transferTo[key] = transferFrom[key];
        delete transferFrom[key];
      }
    }

    setTo(transferTo);
    setFrom(transferFrom);
  };
  const hasNoSelectedItem = (list) => {
    for (let key in list) {
      if (list[key] === true) {
        return false;
      }
    }
    return true;
  };
  return (
    <div className="my-4 container mx-6">
      <h1 className="text-2xl my-3 mx-6  text-black  text-2xl font-bold">Import Products Info</h1>
      <div className="flex items-center flex-wrap flex-row">
        <div className="max-w-auto px-10 py-8 mx-6 my-4  border border-gray-200 rounded-lg ">
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-">
            Select File
          </h5>

          <p className="mb-3 font-normal text-gray-900 dark:text-black-800">
            Please Upload file from your device
          </p>

          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer  dark:text-black-400 focus:outline-none  dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            accept=".json,.csv"
            onChange={handleFileUpload}
          />
          <label
            className="block mb-2 text-sm font-medium text-gray-900 "
            htmlFor="file_input"
          >
            Upload file
            <span className="text-gray-800">
              (Only .json and .csv files are allowed)
            </span>
          </label>
        </div>
        <div className="max-w-auto px-10 py-8 mx-6 my-4  border border-gray-200 rounded-lg ">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-black-900 dark:text-black">
            Specify Format
          </h5>

          <p className="mb-3 font-normal text-gray-700 dark:text-black-400">
            Please Specify the File Format
          </p>
          <div className="grid grid-cols-2 gap-2">
            <label
              htmlFor="countries"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Specify Format
            </label>
            <select
              required
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option defaultValue="">Choose Format</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
            <label
              htmlFor="countries"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Encoding
            </label>
            <select
              required
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option defaultValue="">Choose Encoding</option>
              <option value="csv">UTF-8</option>
              <option value="json">ASCII</option>
            </select>
          </div>
        </div>
      </div>
      <div className="max-w-auto p-6 px-6 py-8 mx-4 my-4 bg-white border border-gray-200 rounded-lg shadow ">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-black-900 dark:text-black">
          Select Headers to be Included
        </h5>
        {fullData.length == 0 && (
          <span className="text-sm text-black-900">
            {" "}
            ( waiting for file to be uploaded )
          </span>
        )}

        <form>
          <div className="grid grid-cols-3 gap-2">
            <ItemList list={dataField} setList={setDataField}></ItemList>
            <div className="py-4 rounded-lg text-black text-center align-middle">
              <button
                className="mt-2 border-2 border-black-500 rounded-lg p-2"
                disabled={hasNoSelectedItem(dataField)}
                onClick={() =>
                  transferCheckedItems(
                    dataField,
                    setDataField,
                    selectedField,
                    setSelectedField
                  )
                }
              >
                &gt;&gt;
              </button>
              <br></br>
              <button
                className="mt-2 border-2 text-black border-black-500 rounded-lg p-2"
                disabled={hasNoSelectedItem(selectedField)}
                onClick={() =>
                  transferCheckedItems(
                    selectedField,
                    setSelectedField,
                    dataField,
                    setDataField
                  )
                }
              >
                &lt;&lt;
              </button>
            </div>
            <ItemList
              list={selectedField}
              setList={setSelectedField}
            ></ItemList>
          </div>
        </form>
      </div>
      <DataTable data={fullData} fields={selectedField}></DataTable>
    </div>
  );
};

export default Handler;
