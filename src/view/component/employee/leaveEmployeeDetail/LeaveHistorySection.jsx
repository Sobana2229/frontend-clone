// Tambahkan dependency useState jika ingin dropdown dapat dipilih
import { useState } from "react";

// Data dummy tampilan
const upcomingHolidays = [
  { date: "20-Oct-2025, Monday", name: "Deepavali" },
  { date: "25-Dec-2025, Thursday", name: "Christmas" },
];

const pastLeaves = [
  {
    date: "14-May-2025, Wednesday",
    type: "Casual Leave",
    typeColor: "bg-blue-400",
    duration: "0.5 day",
    status: "Cancelled",
  },
  {
    date: "09-May-2025, Friday",
    type: "Earned Leave",
    typeColor: "bg-green-400",
    duration: "1 day",
    status: "Cancelled",
  },
  {
    date: "09-May-2025, Friday",
    type: "Earned Leave",
    typeColor: "bg-green-400",
    duration: "1 day",
    status: "Cancelled",
  },
  {
    date: "06-May-2025, Tuesday",
    type: "Casual Leave",
    typeColor: "bg-blue-400",
    duration: "1 day",
    status: "Cancelled",
  }
];

function LeaveHistorySection() {
  const [viewUpcoming, setViewUpcoming] = useState(true);

  return (
    <div className="w-full space-y-6 mt-10">

      {/* Upcoming Leave & Holidays */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="mb-4 flex items-center">
          <select
            className="border rounded px-3 py-2 bg-white"
            value="Upcoming Leave & Holidays"
            onChange={() => setViewUpcoming(true)}
          >
            <option>Upcoming Leave & Holidays</option>
          </select>
        </div>
        <div className="w-full grid grid-cols-2 gap-2">
          <div>
            {upcomingHolidays.map((item, idx) => (
              <div key={idx} className="py-2">{item.date}</div>
            ))}
          </div>
          <div>
            {upcomingHolidays.map((item, idx) => (
              <div key={idx} className="py-2">{item.name}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Past Leave & Holidays */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="mb-4 flex items-center">
          <select
            className="border rounded px-3 py-2 bg-white"
            value="Past Leave & Holidays"
            onChange={() => setViewUpcoming(false)}
          >
            <option>Past Leave & Holidays</option>
          </select>
        </div>
        <div className="w-full">
          <table className="w-full text-sm">
            <tbody>
              {pastLeaves.map((item, idx) => (
                <tr key={idx} className="border-b last:border-b-0">
                  <td className="py-2 pr-4">{item.date}</td>
                  <td className="py-2 pr-4 flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded ${item.typeColor}`}></span>
                    <span>{item.type}</span>
                    <span className="ml-2 text-gray-400">• {item.duration}</span>
                  </td>
                  <td className="py-2 pr-4 text-red-500">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default LeaveHistorySection