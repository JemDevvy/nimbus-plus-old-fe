import React, { useState } from "react";
import Toast from "../newUI/Toast";
import { useParams, useNavigate } from "react-router-dom";
import { validateText } from "../../utils/validate"

import { PROJECT_STATUS } from "../../constants/projectStatus";
import { PROJECT_STAGE } from "../../constants/projectStage";

// UI components
import { PlaceRounded, BusinessOutlined, WorkOutline, Save } from '@mui/icons-material';
import noImage from "../../assets/no-image.jpg";
import CustomSelect from "./CustomSelect";

const EditProjectDetails = ({ project, onCancel, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: project?.name || "",
    address: project?.address || "",
    projectDescription: project?.projectDescription || "",
    startDate: project?.startDate || "",
    buildingClass: project?.buildingClass || "",
    client: project?.client || "",
    status: project?.status || "",
    projectsStage: project?.projectsStage || "",
    createdAt: project?.createdAt ? new Date(project.createdAt).toISOString().slice(0, 10) : "",
    projectImage: project?.projectImage || null,
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
  };

  const validateForm = () => {
    const pattern = /^[A-Za-z0-9 .,'"()\-!?#&/:=%]+$/;

    const rules = {
        name: { minLength: 3, maxLength: 100, pattern },
        address: { maxLength: 500, pattern },
        projectDescription: { maxLength: 1000, pattern },
        buildingClass: { maxLength: 100, pattern },
        client: { maxLength: 200, pattern },
        status: { maxLength: 100, pattern },
        projectsStage: { maxLength: 100, pattern },
        startDate: {},          // skip regex — it's a date
        createdAt: {},          // read-only
        projectImage: {},       // skip, file type handled separately
      };

      for (const key in rules) {
        const value = formData[key];
        const validation = validateText(value, rules[key]);

        if (!validation.valid) {
          triggerToast(validation.error!, "error");
          return false;
        }
      }

      return true;
  };

 
 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (!validateForm()) {
    setLoading(false);
    return;
  }
  
  const token = localStorage.getItem("token");
  const url = `${import.meta.env.VITE_API_URL}/api/projects/${id}`;
  let body;
  let headers = {};
  let fetchOptions = {};

  if (formData.projectImage instanceof File) {
    body = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        body.append(key, value);
      }
    });
    headers = { Authorization: `Bearer ${token}` };
    fetchOptions = {
      method: "PUT",
      headers,
      body,
      credentials: "include"
    };
  } else {
    body = JSON.stringify(formData);
    // headers = {
    //   "Content-Type": "application/json",
    //   Authorization: `Bearer ${token}`
    // };
    fetchOptions = {
      method: "PUT",
      // headers,
      body,
      credentials: "include"
    };
  }

  console.log("Submitting formData:", formData);
  fetch(url, fetchOptions)
    .then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    })
    .then((data) => {
      setLoading(false);
      triggerToast("Project updated successfully!", "success");
      setFormData({
        name: data.name || "",
        address: data.address || "",
        projectDescription: data.projectDescription || "",
        startDate: data.startDate || "",
        buildingClass: data.buildingClass || "",
        client: data.client || "",
        status: data.status || "",
        projectsStage: data.projectsStage || "",
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString().slice(0, 10) : "",
        projectImage: data.projectImage || null,
      });
      onSave(data);
    })
    .catch((err) => {
      setLoading(false);
      triggerToast(err instanceof Error ? err.message : String(err) || "Failed to Edit Project", "error")
    });
}; 


  const statusOptions = PROJECT_STATUS.map((status) => ({ value: status, label: status }));
  const stageOptions = PROJECT_STAGE.map((status) => ({ value: status, label: status }));

  return (
  <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="relative flex flex-row justify-between">
            <h1 className='font-bold text-lg '>{project?.name || "Project"}</h1>
            <div className="absolute right-0 flex flex-row gap-3 ">
              <button className={`px-5 py-1 bg-white font-bold border-2 border-gray-200 rounded-lg transition cursor-pointer ${loading ? "cursor-wait" : "hover:border-red-100 cursor-pointer"}`} disabled={loading} onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className={`px-5 py-1 text-white font-bold rounded-lg transition ${loading ? "bg-gray-400 cursor-wait" : "bg-brand-primary hover:bg-blue-700 cursor-pointer"}`} disabled={loading}>
                <Save className="-mt-1 mr-1"/> 
                {loading ? "Saving..." : "Save"}
              </button>
              {error && <div className="text-red-500 font-semibold mb-2">{error}</div>}
            </div>
        </div>
    <div>
      <PlaceRounded className="text-gray-400 -ml-1" />
      <input
        type="text"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        className="text-md text-gray-500 w-1/4 px-2 rounded-lg bg-brand-whiteback border-1 border-gray-300 focus:outline-none focus:border-blue-500"
        placeholder="Project Address"
        disabled={loading}
      />
    </div>
        <div className="flex flex-row gap-2">
            <div className="flex-2">
                <img 
                    src={noImage || project?.projectImage} 
                    alt={project?.name} 
                    className="w-full h-[200px] object-cover rounded-lg mt-3" />
            </div>
            <div className="flex-3 ml-5">
                <div className="grid grid-cols-3 grid-rows-5 gap-2">
                    <div className="space-x-2">
                        <span className="text-md inline-block"><BusinessOutlined className="-mt-1 mr-2" />Project Description</span>
                    </div>
                    <div className="col-span-2">
                        <input
                          type="text"
                          value={formData.projectDescription}
                          onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                          className="text-md text-gray-500 w-full px-2 py-0.5 -mt-1 rounded-md bg-brand-whiteback border-1 border-gray-300 focus:outline-none focus:border-blue-500"
                          placeholder="Enter Project Description"
                          disabled={loading}
                        />
                    </div>
                    <div className="row-start-2 space-x-2 ml-8">
                        <p className="text-md inline-block">Building Class</p>
                    </div>
                    <div className="col-span-2 row-start-2">
                        <input
                          type="text"
                          value={formData.buildingClass}
                          onChange={(e) => setFormData({ ...formData, buildingClass: e.target.value })}
                          className="text-md text-gray-500 w-full px-2 py-0.5 -mt-1 rounded-md bg-brand-whiteback border-1 border-gray-300 focus:outline-none focus:border-blue-500"
                          placeholder="Enter Building Class"
                          disabled={loading}
                        />
                    </div>
                    <div className="row-start-3 space-x-2">
                        <span className="text-md inline-block"><WorkOutline className="-mt-1 mr-2" />Client</span>
                    </div>
                    <div className="col-span-2 row-start-3">
                        <input
                          type="text"
                          value={formData.client}
                          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                          className="text-md text-gray-500 w-full px-2 py-0.5 -mt-1 rounded-md bg-brand-whiteback border-1 border-gray-300 focus:outline-none focus:border-blue-500"
                          placeholder="Enter Client"
                          disabled={loading}
                        />
                    </div>
                    <div className="row-start-4 space-x-2 ml-8">
                        {/* <CalendarToday className="" /> */}
                        <p className="text-md inline-block">Start Date</p>
                    </div>
                    <div className="col-span-2 row-start-4">
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="text-md text-gray-500 w-3/4 px-2 py-0.5 -mt-1 rounded-md bg-brand-whiteback border-1 border-gray-300 focus:outline-none focus:border-blue-500"
                          disabled={loading}
                        />
                    </div>
                    <div className="row-start-5 space-x-2 ml-8">
                        <p className="text-md inline-block">Project Stage</p>
                    </div>
                    <div className="col-span-2 row-start-5">
                    <CustomSelect
                      options={stageOptions}
                      value={formData.projectsStage}
                      onChange={(v) => setFormData({ ...formData, projectsStage: v })}
                      placeholder="Select Project Stage"
                      className="w-3/4 px-2 py-0.5 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                    />
                    </div>
                </div>
            </div>
            <div className="flex-1 justify-end mt-auto text-center">
              <CustomSelect
                options={statusOptions}
                placeholder={formData.status || "Status"}
                value={formData.status}
                onChange={(v) => setFormData({ ...formData, status: v })}
                className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
              />
            </div>
        </div>
      <Toast
        message={toast.message}
        show={toast.show}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
        duration={3000}
      />
    </form>
  );
}

export default EditProjectDetails