import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { AssignmentTurnedInOutlined, AssignmentTurnedInRounded, DescriptionOutlined, DescriptionRounded, ImageOutlined, ImageRounded, PeopleAltOutlined, PeopleAltRounded, AdminPanelSettingsOutlined, AdminPanelSettingsRounded, SettingsOutlined, SettingsRounded } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";

const SideNav = () => {
    const [active, setActive] = useState("Dashboard");
    const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", icon: <Home size={18} />, activeIcon: <Home size={19}/>, linkto: "/dashboard" },
    { name: "Tasks", icon: <AssignmentTurnedInOutlined  />, activeIcon: <AssignmentTurnedInRounded />, linkto: "/dashboard" },
    { name: "RFI", icon: <DescriptionOutlined />, activeIcon: <DescriptionRounded />, linkto: "/rfi-list" },
    { name: "Drawings", icon: <ImageOutlined />, activeIcon: <ImageRounded />, linkto: "/dashboard" },
    { name: "Contacts", icon: <PeopleAltOutlined />, activeIcon: <PeopleAltRounded  />, linkto: "/dashboard" },
    { name: "Admin", icon: <AdminPanelSettingsOutlined />, activeIcon: <AdminPanelSettingsRounded />, linkto: "/user-management" },
    { name: "Settings", icon: <SettingsOutlined />, activeIcon: <SettingsRounded />, linkto: "/dashboard" },
  ];

  const getPageTitle = (path) => {
    if (path.includes("/rfi")) return "RFI";
    if (path.includes("/tenant") || path.includes("/seats")) return "Admin";
    return null;
  };

  const pageTitle = getPageTitle(location.pathname);

  // initialize active automatically based on url
  useEffect(() => {
    if (pageTitle) setActive(pageTitle);
  }, [pageTitle]);

  return (
    <div className="fixed top-16 h-screen w-20 bg-white flex flex-col py-4 space-y-6 shadow-sm">
      {menu.map((item) => {
        
        const isActive = active === item.name;
        
        return (
          <Link
            to={item.linkto}
            key={item.name}
            onClick={() => {setActive(item.name); navigate(item.linkto);}}
            className={`relative flex flex-row mx-1 items-center justify-center cursor-pointer transition-colors duration-200 ${
              isActive
                ? "text-brand-primary font-semibold"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            <div className={`absolute left-0 top-0.5 w-[3px] h-[65px] rounded bg-brand-primary ${
            isActive ? "opacity-100" : "opacity-0"}`} />
            <div className="flex flex-col items-center">
                <div className="p-2 rounded-lg transition-transform duration-150">
                {isActive ? item.activeIcon : item.icon}
                </div>
                <span className="text-[12px]">{item.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
    );
}

export default SideNav