import { CalendarBlank, DeviceMobile, DotsThree, EnvelopeSimple, MapPin, TreeStructure, User } from "@phosphor-icons/react";
import ToggleAction from "../../../component/toggle";
import { useState } from "react";
import { formatZohoDateFull } from "../../../../../helper/globalHelper";
const baseUrl = import.meta.env.VITE_BASEURL;
const token = localStorage.getItem("zoho_access_token");

function OverviewEmployeePages({data}) {
  const [isProfessionalTaxEnabled, setIsProfessionalTaxEnabled] = useState(true);
  return (
    <div className={`w-full h-screen flex flex-col items-start justify-start pt-12`}>
      <div className="w-full p-5 flex space-x-4">
        <div className="w-[40%] rounded-lg border-[1px] shadow-sm overflow-hidden">
          <div className="w-full py-10 flex flex-col items-center justify-center space-y-4">
            <div className="h-[100px] w-[100px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
              <img className="w-full h-full" src={data?.photo == "-1" ? "https://contacts.zoho.com/file?ID=839307310&fs=thumb" : `${baseUrl}/zoho/show-employee-photo/${data?.photo}?accessToken=${token}`} alt="user_profiles" />
            </div>
            <div className="w-full flex flex-col items-center justify-center space-y-1">
              <h1 className="text-lg">{data?.["First Name"]} <span>({data?.["Employee ID"]})</span></h1>
              <p>{data?.["Designation"] ? data?.["Designation"] : "-"}</p>
            </div>
          </div>
          <div className="w-full p-5">
            <div className="flex flex-col px-4 space-y-2 border-y-[1px] py-4">
              <p className="font-light">Basic Information</p>
              <div className="flex items-center justify-start space-x-2">
                <EnvelopeSimple />
                <p className="font-normal">{data?.["Email address"] ? data?.["Email address"] : "-"}</p>
              </div>
              <div className="flex items-center justify-start space-x-2">
                <DeviceMobile />
                <p className="font-normal">{data?.["Work Phone Number"] ? data?.["Work Phone Number"] : "-"}</p>
              </div>
              <div className="flex items-center justify-start space-x-2">
                <User />
                <p className="font-normal">Others</p>
              </div>
              <div className="flex items-center justify-start space-x-2">
                <CalendarBlank />
                <p className="font-normal">
                  {data?.["Email address"]?.trim() && data?.["Date of Joining"]
                  ? `${formatZohoDateFull(data["Date of Joining"])} (Date of Joining)`
                  : "-"}
                </p>
              </div>
              <div className="flex items-center justify-start space-x-2">
                <TreeStructure className="rotate-90" />
                <p className="font-normal">{data?.["Department"] ? data?.["Department"] : "-"}</p>
              </div>
              <div className="flex items-center justify-start space-x-2">
                <MapPin />
                <p className="font-normal">{data?.["Seating Location"] ? data?.["Seating Location"] : "-"}</p>
              </div>
            </div>
            <div className="flex flex-col p-4 space-y-3">
              <div className="w-full flex items-center justify-between">
                <p>Professional Tax</p>
                <ToggleAction setAction={setIsProfessionalTaxEnabled} Action={isProfessionalTaxEnabled} />
              </div>
              <div className="w-full flex items-center justify-start font-light text-sm space-x-[40%]">
                <p>Portal Access</p>
                <p>Disabled (Enable)</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[40%] space-y-4">
          <div className="w-full p-5 rounded-lg border-[1px] shadow-sm overflow-hidden space-y-3">
            <h1 className="font-bold">Personal Information</h1>
            <table className="table-auto w-full">
              <tbody>
                <tr className="">
                  <td className="py-1 w-1/3 align-top">Date of Birth</td>
                  <td className="py-1 w-1/2 whitespace-normal">{data?.["Date of Birth"] ? data?.["Date of Birth"] : "-"}</td>
                </tr>
                <tr className="">
                  <td className="py-1 w-1/3 align-top">Father's Name</td>
                  <td className="py-1 w-1/2 whitespace-normal">{data?.["Father's Name"] ? data?.["Father's Name"] : "-"}</td>
                </tr>
                <tr className="">
                  <td className="py-1 w-1/3 align-top">PAN</td>
                  <td className="py-1 w-1/2 whitespace-normal">{data?.["PAN"] ? data?.["PAN"] : "-"}</td>
                </tr>
                <tr className="">
                  <td className="py-1 w-1/3 align-top">Personal Email Address</td>
                  <td className="py-1 w-1/2 whitespace-normal">{data?.["Personal Email Address"] ? data?.["Personal Email Address"] : "-"}</td>
                </tr>
                <tr className="">
                  <td className="py-1 w-1/3 align-top">Residential Address</td>
                  <td className="py-1 w-1/2 whitespace-normal" style={{ wordBreak: "break-all" }}>
                    {data?.["Present Address"] ? data?.["Present Address"] : "-"}
                  </td>
                </tr>
                <tr className="">
                  <td className="py-1 w-1/3 align-top">Differently Abled Type</td>
                  <td className="py-1 w-1/2 whitespace-normal">{data?.["Differently Abled Type"] ? data?.["Differently Abled Type"] : "None"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="w-full p-5 rounded-lg border-[1px] shadow-sm overflow-hidden space-y-3">
            <h1 className="font-bold">Payment Information</h1>
            <table className="table-auto w-full">
              <tbody>
                <tr className="">
                  <td className="py-1 w-1/3 align-top">Payment Mode</td>
                  <td className="py-1 w-1/2 whitespace-normal">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewEmployeePages;