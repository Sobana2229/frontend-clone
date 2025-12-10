import { Link, useLocation } from "react-router-dom";

function SubButtonSideBar({ title = "", to = undefined}) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`w-full flex items-center justify-between p-2 duration-300 ease-in-out group rounded-md ${
        isActive ? "bg-[#3F8DFB]" : "hover:bg-[#3F8DFB]"
      }`}
    >
      <div className="flex items-start justify-center space-x-3">
        <h1
          className={`text-sm font-medium text-white ps-8 ${
            isActive ? "" : ""}
          `}
        >
          {title}
        </h1>
      </div>
    </Link>
  );
}

export default SubButtonSideBar;
