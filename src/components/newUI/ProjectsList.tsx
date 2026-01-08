import React, { useEffect, useState } from "react";

import { useProjectSelection } from "../../hooks/useProjectSelection";

import noImage from "../../assets/no-image.jpg";

const ITEMS_PER_PAGE = 3;

const ProjectsList = ({ projects, pagination }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { setSelectedProject } = useProjectSelection();

    const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProjects = projects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const getStatusColor = (status) => {
    switch (status) {
      case "Requested":
      case "requested":
        return "bg-indigo-100 text-indigo-700";
      case "In Progress":
      case "in progress":
        return "bg-yellow-100 text-yellow-700";
      case "Pending Info":
      case "pending info":
        return "bg-orange-100 text-orange-700";
      case "Closed":
      case "closed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

    return (
      <div className="py-2">
      {/* Project Cards */}
      {pagination ? (
      <div className="flex flex-row gap-3">
        {currentProjects.map((project) => (
          // console.log(project.project),
          <div
            key={project.id}
            className="bg-white w-1/3 rounded-lg shadow-md transition hover:shadow-lg flex flex-col xl:flex-row cursor-pointer"
            onClick={() => {
              setSelectedProject(String(project.id));
              window.location.href = `/projects/${project.id}`;
            }}
          >
            <img
              src={project.projectImage}
              alt=""
              className="w-[88%] xl:w-[200px] h-50 xl:h-40 object-cover rounded-lg my-3 mx-auto xl:mr-0 xl:ml-3"
            />
            <div className="pt-0 xl:pt-4 p-4 px-3 flex flex-col w-full xl:w-1/2 overflow-y-hidden">
              <h3 className="font-bold text-lg text-gray-800 truncate">{project.name}</h3>
              <p className="text-sm text-gray-500">{project.address}</p>
              <div className="mt-auto ml-auto">
                <span className={`px-4 py-2 text-gray-700 rounded-lg text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status || "-"}
                </span>
              </div>
            </div> 
          </div>
        ))} 
      </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {projects.map((project) => (
          // console.log(project.project),
          <div
            key={project.id}
            className="bg-white mr-3 mb-1 rounded-lg shadow-md transition hover:shadow-lg flex flex-row cursor-pointer"
            onClick={() => {
              setSelectedProject(String(project.id));
              window.location.href = `/rfi-list/${project.id}`;
            }}
          >
            <img
              src={project.projectImage || noImage}
              alt={project.name}
              className="w-[200px] h-40 object-cover rounded-lg m-3 mr-0"
            />
            <div className="p-4 px-3 flex flex-col w-3/4 overflow-y-hidden">
              <h3 className="font-bold text-lg text-gray-800 truncate">{project.name}</h3>
              <p className="text-sm text-gray-500">{project.address}</p>
              <p className="text-sm text-gray-500 mt-5">Building Class {project.buildingClass}</p>
              
              <div className="flex flex-row justify-between mt-auto">
                <p className="text-sm text-gray-500 mt-auto">
                  Created&nbsp; 
                  {new Date(project.createdAt).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                </p>
                <span className={`px-4 py-2 text-gray-700 rounded-lg text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status || "-"}
                </span>
              </div>
            </div>
          </div>
        ))} 
        </div>
      ) }

      {/* Pagination */}
      {pagination === true ? (

      <div className="flex justify-center items-center gap-3 my-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-2 text-gray-500 ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
        >
          ◀
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium cursor-pointer ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : " text-gray-600 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-2 text-gray-500 ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          ▶
        </button>
      </div>
      ): (<></>)
      }
    </div>
  );
}

export default ProjectsList