import { Link, useNavigate, useParams } from "react-router-dom";
import { templateRegularPayslipsEdit, templateRegularPayslipsList } from "../../../../../../data/dummy";
import PdfDocument from "../../../../component/pdfDocument";
import { useEffect, useState } from "react";
import settingTemplateStoreManagements from "../../../../../store/tdPayroll/setting/templates";
const baseUrl = import.meta.env.VITE_BASEURL;
import { toast } from "react-toastify";
import ImageScaleSwiper from "../../../../component/pdfTamplates/imageScaleSwiper";

function EditTamplates() {
  const { id } = useParams();
  const { imgTamplateSetting, loading, uploadImgTamplateSetting, fetchImgTamplateSetting, createAvailableDetailTamplate, fetchAvailableDetailTamplate, availableDetailTamplate } = settingTemplateStoreManagements();
  const [currentTamplates, setCurrentTamplates] = useState("");
  const [currentTamplatesId, setCurrentTamplatesId] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const navigate = useNavigate();
  const [checkedPrefs, setCheckedPrefs] = useState({});
  const [logoScale, setLogoScale] = useState({ value: 1, size: 'w-16 h-16' });

  useEffect(() => {
    const [name, idx] = id.split("-");
    const templateName = name.split("_").join(" ");
    setCurrentTamplatesId(idx);
    setCurrentTamplates(templateName);
  }, [id]);

  useEffect(() => {
    if(!imgTamplateSetting){
      fetchImgTamplateSetting()
    }
  }, []);

  useEffect(() => {
    if (availableDetailTamplate) {
      const prefs = {};
      templateRegularPayslipsEdit.forEach(el => {
        const key = el.split(" ").join("_").toLowerCase();
        prefs[key] = availableDetailTamplate[key] === true;
      });
      setCheckedPrefs({
        ...prefs,
        show_organisation_address: availableDetailTamplate?.show_organisation_address || false
      });
      setLogoScale(JSON.parse(availableDetailTamplate.logo_scale))
    }
  }, [availableDetailTamplate]);

  useEffect(() => {
    if (currentTamplates) {
      fetchAvailableDetailTamplate(currentTamplates);
    }
  }, [currentTamplates]);

  useEffect(() => {
    window.history.replaceState({ fromEdit: true }, "", location.pathname + location.search);
    window.history.pushState({ fromEdit: true }, "", location.pathname + location.search);

    const handlePopState = (event) => {
      if (event.state?.fromEdit) {
        navigate({
          pathname: "/setting",
          search: "?tab=Templates",
        }, { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate, location]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const handleCheckboxChange = (key) => {
    setCheckedPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const submitForm = async (isSave) => {
    const formCheckedPrefs = [];
    templateRegularPayslipsEdit.forEach((item, idx) => {
      const checkbox = document.getElementById(`payslip-pref-${idx}`);
      if (checkbox?.checked) {
        formCheckedPrefs.push(item);
      }
    });
    
    if (checkedPrefs["show_organisation_address"]) {
      formCheckedPrefs.push("Show Organisation Address");
    }  

    const body = {
      name: currentTamplates,
      setAvailableDetail: formCheckedPrefs,
      logo_scale: logoScale
    };

    if (thumbnailFile) {
      const formData = new FormData();
      formData.append("thumbnail", thumbnailFile);
      await uploadImgTamplateSetting(formData);
    }
    await createAvailableDetailTamplate(body)
    await fetchImgTamplateSetting();
    await fetchAvailableDetailTamplate(currentTamplates)
    if(isSave){
      toast.success("Success Edit Tamplates", {
          autoClose: 3000,
          closeButton: false,
          hideProgressBar: true,
      })
      navigate("/setting?tab=Templates", { replace: true });
    }
  };

  return (
    <div className="w-full h-screen flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-[20%] h-full bg-white p-5 space-y-5 border-r overflow-y-auto overflow-x-hidden relative">
        <div className="w-full border-b pb-5 flex items-center justify-start text-xl font-medium">
          {templateRegularPayslipsList[currentTamplatesId]}
        </div>

        <div className="w-full">
          <div className="flex flex-col">
            <div className="rounded-md flex-col border w-full overflow-hidden">
              <div className="w-full h-full py-2">
                <img
                  className="w-full object-contain h-[150px]"
                  src={baseUrl + imgTamplateSetting}
                  alt="thumbnail"
                />
              </div>
              <div className="w-full h-fit bg-gray-50 py-2">
                {imgTamplateSetting && (
                  <ImageScaleSwiper logoScale={logoScale} onScaleChange={(scaleOption) => setLogoScale(scaleOption)} />
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 text-sm"
            />

            <p className="text-sm font-light mt-2 mb-6">
              Note: The resized logo will be displayed in all PDF files.
            </p>
          </div>

          <div className="w-full flex space-x-2 items-center justify-start mb-10">
            <input
              id="use-logo"
              type="checkbox"
              checked={checkedPrefs["show_organisation_address"] || false}
              onChange={() => handleCheckboxChange("show_organisation_address")}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <label htmlFor="use-logo" className="text-sm text-gray-700">
              Show Organisation Address
            </label>
          </div>

          <h1 className="font-medium">Payslip Preferences</h1>
          <div className="w-full flex-col flex space-y-2 flex-1 overflow-y-auto max-h-[250px] mt-2">
            {templateRegularPayslipsEdit.map((el, idx) => {
              const keyData = el.split(" ").join("_").toLowerCase();
              return (
                <div key={idx} className="w-full flex space-x-2 items-center justify-start">
                  <input
                    id={`payslip-pref-${idx}`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                    checked={checkedPrefs[keyData] || false}
                    onChange={() => handleCheckboxChange(keyData)}
                  />
                  <label htmlFor={`payslip-pref-${idx}`} className="text-sm text-gray-700">
                    {el}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full flex items-center justify-start space-x-3 pt-5 absolute bottom-5 left-5">
          <button
            onClick={() => submitForm(true)}
            className="rounded-lg bg-blue-500 text-white px-4 py-1.5"
          >
            Save
          </button>
          <button onClick={() => submitForm(false)} className="rounded-lg bg-white text-black border-2 px-4 py-1">
            Preview
          </button>
        </div>
      </div>

      {/* Main content (PDF preview) */}
      <div className="flex-1 h-full p-20 bg-gray-100 overflow-y-auto">
        <PdfDocument name={currentTamplates} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />
      </div>
    </div>
  );
}

export default EditTamplates;