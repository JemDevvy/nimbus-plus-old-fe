import { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";

// UI components
import SearchBar from "../components/newUI/SearchBar";
import Graphic from "../assets/new-project-graphic.png";
import ProjectList from "../components/newUI/ProjectsList";

import { Box, Alert, CircularProgress } from "@mui/material";
import ProjectFilter from "../components/newUI/ProjectsFilter";
import NotificationsView from "../components/newUI/NotificationsView";
import Overview from "../components/newUI/Overview";
import PopupCreateProj from "../components/modals/PopUpCreateProject";
import Toast from "../components/waitlist/Toast";

interface Project {
  id: number;
  name: string;
  projectDescription?: string;
  projectImage?: string;
  status?: string;
  manager?: string;
  due?: string;
}

export default function Dashboard() {
  const { accessToken } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const { setSelectedProject } = useProjectSelection();

  const [showPopup, setShowPopup] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
      fetch(`${import.meta.env.VITE_API_URL}/api/projects/`, {
        method: "GET",
        // headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        credentials: 'include'
                // body: formData,
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch projects");
          setLoading(false);
          return res.json();
        })
        .then((data) => {
          setProjects((data.projects || data).slice().reverse())
          setLoading(false);
          console.log(data);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, [accessToken]);

  useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setShowPopup(false)
        }
      };
  
      if (showPopup) {
        document.addEventListener("keydown", handleEscape);
      }
  
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, [showPopup]);

  return (
    <div className="max-w-[100vw] max-h-[100vw]">
      <div className="pt-26 pl-30 pr-10 flex flex-col xl:flex-row gap-5">
        <div className="flex-grow">
          <div className="flex flex-row gap-5 w-full">
            <h1 className="text-xl font-bold">
              My Projects
            </h1>
            <SearchBar placeholder="Find a project..." onChange={(e) => {}} />
          </div>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200} >
              <CircularProgress />
            </Box>
          ) : projects.length === 0 && (!accessToken || error) ? (
            <Alert severity="error" className="my-4">Not authenticated. Please log in.</Alert>
          ) : (
            
            <div>
              <div className="flex flex-row justify-between items-center">
                <ProjectFilter />
                {projects.length === 0 ? (null) : (
                  <button className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer" 
                  onClick={() => setShowPopup(true)}>
                    <span className="font-bold text-xl">+ </span>Create New Project
                  </button>
                )}
              </div>
              
              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center mx-auto p-10">
                  <img src={Graphic} alt="No projects" className="mx-auto my-10 w-xl" />
                  <h1 className="font-bold text-xl">Every building starts with a plan</h1>
                  <button className="mt-4 px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer" onClick={() => setShowPopup(true)}>
                    <span className="font-bold text-xl">+ </span>Create Your First Project
                  </button>
                </div>
              ) : (
                <ProjectList projects={projects} pagination={true}/>
              )}
            
            </div>
          )}
         {projects.length === 0 ? (null) : (
            <Overview />
         )}
        </div>
        {projects.length === 0 ? (null) : (
            <NotificationsView />
        )}
        </div>

        <PopupCreateProj
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          onSubmit={async (data) => {
            try {
              const formData = new FormData();
              formData.append("name", data.projectName);
              formData.append("address", data.address);
              formData.append("buildingType", data.buildingType);
              formData.append("buildingClass", data.buildingClass);
              formData.append("client", data.client);
              formData.append("status", data.status);
              formData.append("projectsStage", data.projectsStage);
              if (data.projectImage) {
                formData.append("projectImage", data.projectImage);
              }
              const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/`, {
                method: "POST",
                // headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
                credentials: 'include',
                body: formData,
              });
              if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to create project");
              }
              setShowPopup(false); 
              setToast({ show: true, message: "Project created", type: "success" }); 
            } catch (err) {
              console.error("Create project error:", err);
            }
          }}
        />

        <Toast
            message={toast.message}
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
            type={toast.type as "success" | "error"}
        />
      
    </div>
  );
}