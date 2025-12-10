import { CheckCircle, X, Warning, XCircle, Check, CheckCircleIcon } from "@phosphor-icons/react";

export const CustomToast = ({ message, closeToast, status = "success" }) => {
  const toastConfig = {
    success: {
      bgColor: "bg-green-td-50",
      iconBgColor: "bg-green-td-600",
      textColor: "text-green-600",
      borderColor: "border-green-600",
      icon: CheckCircle
    },
    error: {
      bgColor: "bg-red-td-50",
      iconBgColor: "bg-red-td-600",
      textColor: "text-red-600",
      borderColor: "border-red-600",
      icon: XCircle
    },
    warning: {
      bgColor: "bg-yellow-td-50",
      iconBgColor: "bg-yellow-td-600",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-600",
      icon: Warning
    }
  };
  const config = toastConfig[status] || toastConfig.success;
  const IconComponent = config.icon;

  return (
    <div className={`w-full max-w-md min-w-[400px] h-fit flex items-center justify-between gap-3 ${config.bgColor} rounded-md pe-2 relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-full h-full flex ${config.bgColor}`}>
        <div className={`w-[16%] h-full ${config.iconBgColor}`}></div>
        <div className={`h-full flex-1 ${config.bgColor}`}></div>
      </div>
      <div className={`w-full relative z-20 flex items-center justify-center gap-4 py-2 pr-2 pl-2`}>
        <div className={`${config.iconBgColor} p-3 rounded-l-md flex items-center justify-center min-w-[40px]`}>
          <CheckCircleIcon size={25} className="text-white" />
        </div>
        <p className={`flex-1 text-sm font-medium ${config.textColor}`}>{message}</p>
        <button
          onClick={closeToast}
          className={`${config.textColor} border-2 rounded-full ${config.borderColor} h-5 w-5 flex items-center justify-center`}
        >
          <X size={10} className="font-bold" />
        </button>
      </div>
    </div>
  );
};