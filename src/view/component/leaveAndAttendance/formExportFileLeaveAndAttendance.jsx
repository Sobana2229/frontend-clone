function FormExportFileLeaveAndAttendance({setShowModal}) {
  return (
    <div className="w-full flex flex-col gap-4 rounded-lg">
      <div className="w-full flex items-start justify-start flex-col px-4 space-y-5">
        {/* Info Text */}
        <p className="text-sm text-gray-600">
          You can protect the exported report with a password to keep your data secure.
        </p>

        {/* Checkbox */}
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" className="h-4 w-4" />
          Protect this file with a password
        </label>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 border-t pt-4 px-4 pb-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Export
        </button>
        <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default FormExportFileLeaveAndAttendance;
