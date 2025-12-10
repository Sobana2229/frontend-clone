import SubButtonSideBar from "./subButtonSideBar";
function SideBarSubList({ subNavbarTitle = [], isSidebarOpen }) {        
  return (
    <div className="w-full h-fit flex flex-col items-center justify-center">
      {isSidebarOpen && 
        subNavbarTitle.map((item, index) => (
            <SubButtonSideBar key={index} title={item.title} to={item.to} />
        ))
      }
    </div>
  );
}

export default SideBarSubList;
