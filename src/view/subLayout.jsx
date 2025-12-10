import {
  Outlet,
  useLocation,
} from "react-router-dom";
import SubSideBar from "./component/subSideBar";

// this sublayout is for handling sub side bar  (e.g. admin reimbursement page)
const SubLayout = () => {
    return (
        <div 
            className="flex w-full h-full"
        >
            <SubSideBar 
                children={<Outlet />}
            />
        </div>
    );
};

export default SubLayout;