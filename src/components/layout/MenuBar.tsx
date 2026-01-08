import { useLocation, useParams } from "react-router-dom";
import Logo from "../../assets/icon_logo.png";
import { useState } from "react";
import { NotificationsRounded } from '@mui/icons-material';
import UserMenuModal from "../modals/UserMenuModal";

const MenuBar = () => {
  const { id } = useParams;
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(false);

  const getPageTitle = (path) => {
    if (path === "/dashboard") return "My Dashboard";
    if (path.includes("/projects/")) return "Project Dashboard";
    if (path.includes("/projects/") && path.includes("/add-member")) return "Add Member";
    if (path.includes("/rfi-list")) return "RFI Manager";
    if (path.includes("/rfi-details")) return "RFI";
    if (path.includes("/user-profile")) return "User Profile";
    if (path.includes("/tenant-management")) return "Tenant Management";
    return "My Dashboard";
  };

  const pageTitle = getPageTitle(location.pathname);

  console.log(location);

  return (
    <div className="w-[100vw] h-16 bg-white fixed flex items-center justify-between pl-5.5 shadow-sm z-40">
      <div className="flex items-center gap-12">
        <img src={Logo} alt="logo" className="h-8" />
        <span className="text-xl font-bold text-gray-800">{pageTitle}</span>
      </div>

      <div className="flex items-center">
        <NotificationsRounded className="w-7 h-7 text-gray-300 mr-3"/>

        <div className="h-8 w-px bg-gray-300" />
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-3.5 pr-9 " 
          onClick={() => setIsOpen(true)}
        >
          <span className="text-sm text-gray-700">James Smith</span>
          <img
            src="https://i.pravatar.cc/37"
            alt="profile"
            className="w-9 h-9 rounded-full border"
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-9 top-15 " onMouseLeave={() => setIsOpen(false)}> 
          <UserMenuModal />
        </div>
      )}

    </div>
  );
}

export default MenuBar
