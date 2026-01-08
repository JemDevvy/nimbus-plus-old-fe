import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectSelection } from '../../hooks/useProjectSelection'; // adjust path as needed
import EditProjectDetails from "./EditProjectDetails";

// UI components
import { PlaceRounded, CreateOutlined, BusinessOutlined, WorkOutline, CalendarToday, LinearScale } from '@mui/icons-material';
import noImage from "../../assets/no-image.jpg";
import Toast from "./Toast";


const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disciplineOptions, setDisciplineOptions] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("");
  const [selectedRequestTo, setSelectedRequestTo] = useState<string[]>([]);
  const [selectedCcTo, setSelectedCcTo] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [showRfiForm, setShowRfiForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
  }

  // Ensure discipline is synced to rfiForm when modal opens

  const [rfiForm, setRfiForm] = useState({
    subject: "",
    discipline: "",
    requiredResponseDate: "",
    requestTo: [],
    ccTo: [],
    tags: [],
    requestToGuest: [],
    comment: "",
    status: "requested",
    rfiDescription: "",
    file: null as File | null,
  });
  const [rfiLoading, setRfiLoading] = useState(false);
  const [rfiError, setRfiError] = useState("");
  const [rfiSuccessOpen, setRfiSuccessOpen] = useState(false);

  useEffect(() => {
  if (showRfiForm && selectedDiscipline) {
    setRfiForm(prev => ({ ...prev, discipline: selectedDiscipline }));
  }
}, [showRfiForm, selectedDiscipline]);

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const token = localStorage.getItem("token");
        const [discRes, tagRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/enums/disciplines`, {
            method: "GET",
            credentials: "include"
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/enums/tags`, { 
            method: "GET",
            credentials: "include"
          })
        ]);
        const discData = await discRes.json();
        const tagData = await tagRes.json();
        setDisciplineOptions(Array.isArray(discData) ? discData : []);
        setTagOptions(Array.isArray(tagData) ? tagData : []);
        setSelectedDiscipline(Array.isArray(discData) && discData.length > 0 ? discData[0] : "");
      } catch (err) {
        setDisciplineOptions([]);
        setTagOptions([]);
      }
    };
    fetchEnums();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, 
      {
        method: "GET",
        credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setProjectDetails(data);
      })
      .catch(() => {
        setProjectDetails(null);
      });
    fetch(`${import.meta.env.VITE_API_URL}/api/project-members/${id}`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(async data => {
        const membersRaw = data.members || data;
        const membersWithNames = await Promise.all(
          membersRaw.map(async (member: any) => {
            let name = "";
            let accountStatus = "";
            let email = "";
            try {
              const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${member.userId}`, 
                { 
                  method: "GET",
                  credentials: "include"
                });
              if (userRes.ok) {
                const userData = await userRes.json();
                name = userData.name || userData.fullName || "";
                accountStatus = userData.accountStatus || "";
                email = userData.email || "";
              }
            } catch {}
            return { ...member, name, accountStatus, email };
          })
        );
        setMembers(membersWithNames);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch members");
        setLoading(false);
      })
  }, [id]);

  const handleRfiChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRfiForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRfiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRfiLoading(true);
    setRfiError("");
    // Allow either a normal recipient or a guest
    const hasNormal = selectedRequestTo && selectedRequestTo.length > 0;
    const hasGuest = rfiForm.requestToGuest && rfiForm.requestToGuest.length > 0;
    if (!hasNormal && !hasGuest) {
      setRfiLoading(false);
      setRfiError("Please select at least one recipient in 'Request To'.");
      return;
    }
    // const rfiNum = rfiNumber || generateRfiNumber(Number(id));
    const formData = new FormData();
    formData.append("projectId", String(id));
    // formData.append("rfiNumber", rfiNum);
    formData.append("subject", rfiForm.subject);
    formData.append("discipline", rfiForm.discipline);
    formData.append("rfiDescription", rfiForm.rfiDescription);
    selectedRequestTo.forEach(name => {
      const member = members.find(m => m.name === name);
      formData.append("requestTo", String(member?.userId || name));
    });
    // Add guest recipients as a single JSON array if present
    if (rfiForm.requestToGuest && rfiForm.requestToGuest.length > 0) {
      formData.append("requestToGuest", JSON.stringify(rfiForm.requestToGuest));
    }
    selectedCcTo.forEach(name => {
      const member = members.find(m => m.name === name);
      formData.append("ccTo", String(member?.userId || name));
    });
    selectedTags.forEach(t => formData.append("tags", t));
    formData.append("requiredResponseDate", rfiForm.requiredResponseDate);
    formData.append("requestedDate", new Date().toISOString().slice(0, 10));
    formData.append("comment", rfiForm.comment);
    formData.append("status", rfiForm.status);
    if (rfiForm.file) {
      formData.append("files", rfiForm.file);
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rfi`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to create RFI");
      setShowRfiForm(false);
      setRfiSuccessOpen(true);
      // Redirect to /rfi-toolpad with selected project
      setSelectedProject(id);
      navigate('/rfi-toolpad');
    } catch (err) {
      setRfiError("Failed to create RFI");
    } finally {
      setRfiLoading(false);
    }
  };

  const { setSelectedProject } = useProjectSelection();

  const handleViewRFIs = (projectId) => {
    setSelectedProject(projectId);
    navigate('/rfi-toolpad');
};

  return (
    <div className='bg-white p-5 rounded-lg shadow-sm w-full'>
      {isEditing ? (
        <EditProjectDetails 
          project={projectDetails} 
          onCancel={() => setIsEditing(false)} 
          onSave={(updated) => {
            setIsEditing(false);
            setToast({ show: true, message: "Project updated successfully!", type: "success" });
            // Reload project details
            const token = localStorage.getItem("token");
            fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
                // headers: { 'Authorization': `Bearer ${token}` },
              method: "GET",
              credentials: "include"
            })
              .then(res => res.json())
              .then(data => {
                setProjectDetails(data);
              });
          }} />
      ) :(
        <div className="flex flex-col">
            <div className="flex flex-row justify-between">
                <h1 className='font-bold text-lg '>{projectDetails?.name || "Project"}</h1>
                <button className="text-gray-400 text-lg rounded-lg hover:text-blue-700 transition cursor-pointer" onClick={() => setIsEditing(true)}>
                    <CreateOutlined />
                </button>
            </div>
            
            <div>
                <PlaceRounded className="text-gray-400 -ml-1" />
                <p className="text-md text-gray-500 inline-block ml-1">{projectDetails?.address || ""} {projectDetails?.suburb ? `, ${projectDetails.suburb}` : ""} {projectDetails?.state ? `, ${projectDetails.state}` : "-"} {projectDetails?.country ? `, ${projectDetails.country}` : ""}</p>
            </div>
            <div className="flex flex-row gap-2">
                <div className="flex-2">
                    <img 
                        src={projectDetails?.projectImage || noImage} 
                        alt={projectDetails?.name} 
                        className="w-full h-[200px] object-cover rounded-lg mt-3" />
                </div>
                <div className="flex-3 ml-5">
                    <div className="grid grid-cols-2 grid-rows-5 gap-4 w-full">
                        <div className="space-x-2">
                            <span className="text-md inline-block"><BusinessOutlined className="-mt-1 mr-1" /> Project Description</span>
                        </div>
                        <div className="">
                            <p className="text-md font-semibold inline-block">{projectDetails?.projectDescription || "-"}</p>
                        </div>
                        <div className="row-start-2 space-x-2 ml-8">
                            <p className="text-md inline-block">Building Class</p>
                        </div>
                        <div className="col-span-2 row-start-2">
                            <p className="text-md font-semibold inline-block">{projectDetails?.buildingClass || "-"}</p>
                        </div>
                        <div className="row-start-3 space-x-2">
                            <span className="text-md inline-block"><WorkOutline className="-mt-1 mr-1" /> Client</span>
                        </div>
                        <div className="col-span-2 row-start-3">
                            <p className="text-md font-semibold inline-block">{projectDetails?.client || "-"}</p>
                        </div>
                        <div className="row-start-4 space-x-2 ml-8">
                            <p className="text-md inline-block">Start Date</p>
                        </div>
                        <div className="col-span-2 row-start-4">
                            <p className="text-md font-semibold inline-block">{projectDetails?.startDate ? new Date(projectDetails.startDate).toLocaleDateString() : "-"}</p>
                        </div>
                        <div className="row-start-5 space-x-2 ml-8">
                            <p className="text-md inline-block">Project Stage</p>
                        </div>
                        <div className="col-span-2 row-start-5">
                            <p className="text-md font-semibold inline-block">{projectDetails?.projectsStage || "-"}</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 justify-end mt-auto text-center">
                    <p className={`${getStatusColor(projectDetails?.status)}`}>{projectDetails?.status.toUpperCase(0) || "-"}</p>
                </div>
            </div>
        </div>
        )}
    <Toast
      message={toast.message}
      show={toast.show}
      onClose={() => setToast({ ...toast, show: false })}
      type={toast.type as "success" | "error"}
    />
    </div>
  );
}

export default Project