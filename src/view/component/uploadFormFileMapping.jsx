import React, { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

function UploadFormFileMapping({ onCancel, handleBack, onNext, dataSelecttion, onMappingChange }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [step, setStep] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [mappingArray, setMappingArray] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    onMappingChange(mappingArray);
  }, [mappingArray, onMappingChange]);

  const handleFileSelect = f => {
    if (!f) return;
    const allowed = ['.csv', '.tsv', '.xls', '.xlsx'];
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      alert('Please select a CSV, TSV, XLS, or XLSX file.');
      return;
    }
    setFile(f);
    setFileName(f.name);
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };
  const handleDragOver = e => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = e => { e.preventDefault(); setIsDragOver(false); };
  const handleClickUpload = () => fileInputRef.current?.click();

  const handleRemoveFile = () => {
    setFile(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleNext = () => {
    if (!file) return;
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (ext === '.csv' || ext === '.tsv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: results => {
          const heads = results.meta.fields || [];
          const rows = results.data || [];
          setHeaders(heads);
          setCsvData(rows);
          initializeMapping(heads);
          setStep(1);
        }
      });
    } else {
      const reader = new FileReader();
      reader.onload = evt => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.SheetNames[0];
        const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        const heads = Object.keys(json[0] || {});
        setHeaders(heads);
        setCsvData(json);
        initializeMapping(heads);
        setStep(1);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const initializeMapping = heads => {
    const init = heads.map(name => ({ name, uuid: '', type: '' }));
    setMappingArray(init);
  };

  const updateMappingItem = (index, uuid, type) => {
    setMappingArray(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], uuid, type };
      return copy;
    });
  };

  const handleSubmit = () => {
    const savePrefs = document.getElementById('savePrefs').checked;
    
    // ✅ Tambahin value ke SEMUA mappingArray (tidak filter)
    const mappingWithValues = mappingArray.map(mapping => {
      // Ambil value dari row PERTAMA CSV untuk field ini
      const columnName = mapping.name;
      const firstRowValue = csvData[0]?.[columnName] || '';
      
      return {
        name: mapping.name,
        uuid: mapping.uuid,
        type: mapping.type,
        value: firstRowValue // ✅ Value dari row pertama
      };
    });
    onNext({ file, savePrefs, data: mappingWithValues }); // ✅ Pass as data
  };

  const handlePrevious = () => {
    setStep(0);
    setFile(null);
    setFileName('');
    setHeaders([]);
    setCsvData([]);
    setMappingArray([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // === STEP 0: Upload ===
  if (step === 0) {
    return (
      <div className="bg-white w-fit max-w-xl rounded-md p-6 shadow">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
            Download a{' '}
            <a
              href="/sample/sample_past_payroll_statement.csv"
              download
              className="text-blue-600 underline cursor-pointer"
            >
              sample file
            </a>{' '}
            and compare with your import file to ensure readiness.
          </p>
        </div>
        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : file
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 bg-gray-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv,.xls,.xlsx"
              onChange={e => handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            {file ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <span role="img" aria-label="file" className="text-3xl text-green-600">
                    📄
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">{fileName}</p>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                >
                  <span role="img" aria-label="close">❌</span> Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <span role="img" aria-label="upload" className="text-3xl text-gray-400">
                    📤
                  </span>
                </div>
                <p className="text-base font-medium text-gray-700">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500">Max Size: 5 MB | Format: CSV, TSV, XLS</p>
                <button
                  type="button"
                  onClick={handleClickUpload}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  Choose File
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!file}
            className="px-6 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // === STEP 1: Mapping ===
  const selectedUuids = mappingArray.map(m => m.uuid).filter(u => u);

  return (
    <div className="bg-white max-w-4xl rounded-md p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <span>
          Selected File:{' '}
          <span className="bg-pink-50 text-pink-700 px-2 py-1 rounded">{fileName}</span>
        </span>
        <span className="text-sm text-gray-500">
          {csvData.length} row(s) found
        </span>
      </div>
      <p className="mb-6 text-gray-600">Map imported file fields to payroll fields below.</p>
      <div className="w-full">
        <div className="flex font-semibold mb-2">
          <div className="w-1/2">Fields</div>
          <div className="w-1/2">Import File Fields</div>
        </div>
        {headers.length === 0 ? (
          <div className="text-gray-400 text-sm">No headers found</div>
        ) : (
          headers.map((field, idx) => {
            const currentUuid = mappingArray[idx]?.uuid || '';
            const options = dataSelecttion.filter(item =>
              !selectedUuids.includes(item.value) || item.value === currentUuid
            );
            return (
              <div key={field} className="flex items-center mb-2">
                <div className="w-1/2 text-base text-gray-700">{field}</div>
                <div className="w-1/2">
                  <select
                    className="border border-gray-300 px-3 py-2 rounded text-sm text-gray-600 w-full"
                    value={currentUuid}
                    onChange={e => {
                      const selValue = e.target.value;
                      const selItem = dataSelecttion.find(d => d.value === selValue);
                      updateMappingItem(idx, selValue, selItem?.type || '');
                    }}
                  >
                    <option value="">Select</option>
                    {options.map((item, i) => (
                      <option key={i} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="bg-gray-50 px-4 py-4 mt-6 rounded-md flex items-center">
        <input type="checkbox" id="savePrefs" className="mr-3" />
        <label htmlFor="savePrefs" className="text-gray-700 text-sm">
          Save these selection preferences for future imports.
          <span
            style={{ marginLeft: '4px', fontSize: '12px', color: '#b5b5b5', cursor: 'pointer' }}
            title="This will save your mapping for future use."
          >
            &#9432;
          </span>
        </label>
      </div>
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={handlePrevious}
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
        >
          &#8592; Previous
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
      <div className="text-sm text-red-500 w-full flex items-center justify-end mt-2">
        * indicates mandatory fields
      </div>
    </div>
  );
}

export default UploadFormFileMapping;
