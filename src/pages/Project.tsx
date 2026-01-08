import { useParams, Link } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
import { useProjectSelection } from '../hooks/useProjectSelection'; // adjust path as needed
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

// UI components
import NotificationsView from "../components/newUI/NotificationsView";
import Overview from "../components/newUI/Overview";
import ProjectDetails from "../components/newUI/ProjectDetails";


const Project = () => {
  const { id } = useParams();
  const { setSelectedProject } = useProjectSelection();

  return (
    <div className="max-w-[100vw] max-h-[100vw]">
      <div className="pt-26 pl-30 pr-10 flex flex-col xl:flex-row gap-5">
        <div className="flex-grow">
            {/* Pass handleUpdateProject to ProjectDetails or use as needed */}
            <ProjectDetails />
            <div className="flex flex-row my-5 justify-between text-center">
              <Link to="/dashboard"  className="px-5 xl:px-8 py-2 mr-3 2xl:mr-0 bg-gray-300 shadow-sm font-bold rounded-lg hover:bg-blue-100 transition cursor-pointer">
                <span className="font-bold text-xl"><ArrowBackRoundedIcon /> </span>Back to Main Dashboard
              </Link>
              <button className="px-10 py-2 mr-3 2xl:mr-0 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer" 
              onClick={() => {
                setSelectedProject(Number(id));
                window.location.href = `/projects/${id}/add-member`;
              }}>
                Project Members
              </button>
              <button className="px-5 xl:px-10 py-2 mr-3 2xl:mr-0 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer"
              onClick={() => {
                setSelectedProject(Number(id));
                sessionStorage.setItem("fromPage", "project");
                window.location.href = `/rfi-list/${id}`;
              }}>
                RFI Manager
              </button>
              <button className="px-5 2xl:px-8 py-2 mr-3 2xl:mr-0 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer">
                Task Tracker
              </button>
              <button className="px-5 2xl:px-8 py-2mr-3 2xl:mr-0  bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer">
                Drawings
              </button>
            </div>
            <Overview />
        </div>
        <NotificationsView />
        </div>
    </div>
  );
}

export default Project