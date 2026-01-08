import { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";

// UI components
import SearchBar from "../components/newUI/SearchBar";
import Graphic from "../assets/new-project-graphic.png";
import ProjectList from "../components/newUI/ProjectsList";

import { Box, Alert, CircularProgress } from "@mui/material";
import ProjectFilter from "../components/newUI/ProjectsFilter";

interface Project {
  id: number;
  name: string;
  projectDescription?: string;
  projectImage?: string;
  status?: string;
  manager?: string;
  due?: string;
}

export default function RFIProjectSelect() {
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
        credentials: "include"
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

  return (
    <div className="max-w-[100vw] max-h-[100vw]">
      <div className="pt-26 pl-30 pr-10 flex flex-row gap-5">
        <div className="flex-grow">
          <div className="flex flex-row gap-5 w-full">
            <h1 className="text-xl font-bold">
              My Projects
            </h1>
            <SearchBar placeholder="Find a project..." onChange={(e) => {}} />
          </div>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : projects.length === 0 && (!accessToken || error) ? (
            <Alert severity="error" className="my-4">Not authenticated. Please log in.</Alert>
          ) : (
            
            <div className="mb-5">
              <div className="flex flex-row justify-between items-center">
                <ProjectFilter />
              </div>
              
              {projects.length == 0 ? (
                <div className="flex flex-col items-center justify-center mx-auto p-10">
                  <img src={Graphic} alt="No projects" className="mx-auto my-10 w-xl" />
                  <h1 className="font-bold text-xl">No Projects yet.</h1>
                </div>
              ) : (
                <ProjectList projects={projects} pagination={false} />
              )}
            
            </div>
          )}
        </div>
        </div>

      
    </div>
  );
}