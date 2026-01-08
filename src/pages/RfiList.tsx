import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectSelection } from '../hooks/useProjectSelection';
import { PlaceRounded, ArrowBackRounded, FilterAltOutlined, AttachmentRounded } from '@mui/icons-material';
import PopUpCreateRFI from "../components/modals/PopUpCreateRFI";
import EditAndCommentRfiPopUp from "../components/modals/EditAndCommentRfiPopUp";
import Toast from "../components/newUI/Toast";

export default function RfiList() {
  const navigate = useNavigate();
  const { selectedProject } = useProjectSelection();
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [rfis, setRfis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editAndCommentPopUpOpen, setEditAndCommentPopUpOpen] = useState(false);
  const [selectedRfi, setSelectedRfi] = useState<any | null>(null);
  const [popUpLoading, setPopUpLoading] = useState(false);
  const [popUpError, setPopUpError] = useState("");
  const [disciplineOptions, setDisciplineOptions] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("");
  const [selectedRequestTo, setSelectedRequestTo] = useState<string[]>([]);
  const [selectedCcTo, setSelectedCcTo] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success" as "success" | "error",
    });

    const triggerToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type });
    };

  // Fetch project details
  useEffect(() => {
    if (!selectedProject) return;
    //const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_URL}/api/projects/${selectedProject}`, {
      // headers: token ? { Authorization: `Bearer ${token}` } : {},
        method: "GET",
        credentials: 'include'
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => setProjectDetails(data))
      .catch(() => setProjectDetails(null));
  }, [selectedProject]);

  // Fetch RFIs and members
  useEffect(() => {
    if (!selectedProject) return;
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    // Fetch RFIs
    fetch(`${import.meta.env.VITE_API_URL}/api/rfi/project/${selectedProject}`, {
      // headers: {
      //   'Content-Type': 'application/json',
      //   ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // },
      method: "GET",
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setRfis(Array.isArray(data) ? data : data.rfis || []);
        console.log("Fetched RFIs:", data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // Fetch members
    fetch(`${import.meta.env.VITE_API_URL}/api/project-members/${selectedProject}`, {
      // headers: { 'Authorization': `Bearer ${token}` },
      method: "GET",
      credentials: 'include',
    })
      .then(res => res.json())
      .then(async (data) => {
        const membersRaw: { userId?: string }[] = Array.isArray(data.members) ? data.members : Array.isArray(data) ? data : [];
        const membersWithNames = await Promise.all(
          membersRaw.map(async (member: { userId?: string }) => {
            let name = "";
            if (member.userId) {
              try {
                const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${member.userId}`, {
                  // headers: { 'Authorization': `Bearer ${token}` },
                  method: "GET",
                  credentials: 'include',
                });
                if (userRes.ok) {
                  const userData = await userRes.json();
                  name = userData.name || userData.fullName || "";
                }
              } catch (err) {}
            }
            return { ...member, name };
          })
        );
        setMembers(membersWithNames);
      })
      .catch(() => setMembers([]));
  }, [selectedProject]);

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

  useEffect(() => {
    if (!selectedProject) return;
    const fetchEnums = async () => {
      try {
        const token = localStorage.getItem("token");
        const [discRes, tagRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/enums/disciplines`, { 
            // headers: { Authorization: `Bearer ${token}` } 
            method: "GET",
            credentials: 'include'
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/enums/tags`, { 
            // headers: { Authorization: `Bearer ${token}` } 
            method: "GET",
            credentials: 'include'
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
  }, [selectedProject]);

      type RfiFormType = {    
        subject: string;
        discipline: string;
        requiredResponseDate: string;
        requestTo: string[];
        ccTo: string[];
        tags: string[];
        requestToGuest: string[];
        comment: string;
        status: string;
        rfiDescription: string;
        file: File | null;
      };
  
      const [rfiForm, setRfiForm] = React.useState<RfiFormType>({
        subject: "",
        discipline: "",
        requiredResponseDate: "",
        requestTo: [],
        ccTo: [],
        tags: [],
        requestToGuest: [],
        comment: "",
        status: "",
        rfiDescription: "",
        file: null
      });

  const getStatusColor = (status) => {
    switch (status) {
      case "requested":
        return "bg-indigo-100 text-indigo-700";
      case "in progress":
        return "bg-yellow-100 text-yellow-700";
      case "pending info":
        return "bg-orange-100 text-orange-700";
      case "closed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleEditModalSave = async (updatedRfi: RFI) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rfi/${updatedRfi.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(updatedRfi),
            credentials: "include",
        });
        if (!res.ok) throw new Error(await res.text());
        setSuccessSnackbar(true);
        fetchRfis(); // Auto-refresh RFI list after edit
    } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
    }
};

  return (
    <div className="max-w-[100vw] max-h-[100vw]">
      <div className="pt-26 pl-30 pr-10">
        <div className="flex flex-row justify-between mb-5">
          <div>
            <h1 className='font-bold text-2xl '>{projectDetails?.name}</h1>
            <PlaceRounded className="text-gray-400 -ml-1" />
            <p className="text-md text-gray-500 inline-block ml-1">{projectDetails?.address || ""} {projectDetails?.suburb ? `, ${projectDetails.suburb}` : ""} {projectDetails?.state ? `, ${projectDetails.state}` : ""} {projectDetails?.country ? `, ${projectDetails.country}` : ""}</p>
          </div>
          <div className="right-0 flex flex-row gap-3">
            <button className="px-8 py-2 h-[80%] bg-gray-300 shadow-sm font-bold rounded-lg hover:bg-blue-100 transition cursor-pointer" 
              onClick={() => navigate(-1)}>
              <span className="font-bold text-xl"><ArrowBackRounded /> </span>Back to Projects
            </button>
            <button type="submit" className="px-8 py-2 h-[80%] bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer" onClick={() => setShowPopup(true)}>
              <span className="font-bold text-xl">+ </span>Create New RFI
            </button>
            {error && <div className="text-red-500 font-semibold mb-2">{error}</div>}
          </div>
        </div>

        {loading ? (
          <div>Loading RFIs...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : rfis.length === 0 ? (
          <div className="text-gray-500">No RFIs found for this project.</div>
        ) : (
          <div>
            <div className="overflow-x-auto rounded-2xl ">
              <table className="min-w-full text-sm text-gray-700 border-0">
                <thead className="bg-white border border-gray-200 rounded-lg shadow-sm text-md uppercase text-gray-500">
                  <tr className="rounded-lg">
                    <th className="px-4 py-3 text-center font-semibold text-lg">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Discipline 
                      <button className="ml-1 cursor-pointer hover:text-black">
                        <FilterAltOutlined />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                    <th className="px-4 py-3 text-left font-semibold">Subject/Description</th>
                    <th className="px-4 py-3 text-left font-semibold">Request By
                      <button className="ml-1 cursor-pointer hover:text-black">
                        <FilterAltOutlined />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Request Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Request To
                      <button className="ml-1 cursor-pointer hover:text-black">
                        <FilterAltOutlined />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Required Date</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Status
                      <button className="ml-1 cursor-pointer hover:text-black">
                        <FilterAltOutlined />
                      </button>
                      </th>
                    <th className="px-4 py-3 text-center font-semibold">Files</th>
                  </tr>
                </thead>
                <tbody className="shadow-md">
                  <tr>
                    <td className="py-2"></td>
                  </tr>
                  {rfis.map((rfi, idx) => (
                    <tr
                      key={rfi.id}
                      className={`bg-white border-b border-gray-300 rounded-lg  hover:bg-gray-100 transition cursor-pointer`}
                      onClick={() => {
                        setSelectedRow(rfi.id);
                        // setEditAndCommentPopUpOpen(true);
                        setSelectedRfi(rfi);
                        window.location.href = `/rfi-details/${rfi.id}`
                      }}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 text-center">
                        {String(rfi.rfiNumber).padStart(2, "0")}
                      </td> 
                      <td className="px-4 py-3">{rfi.discipline}</td>
                      <td className="px-4 py-3">{rfi.category || "Category"}</td>

                      <td className="px-4 py-3">{rfi.subject}</td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <img
                          src={rfi.requestFromAvatar || "https://placehold.net/avatar.png"}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{rfi.requestFrom}</span>
                      </td>
                      <td className="px-4 py-3">
                        {new Date(rfi.requestedDate).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}</td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <img
                          src={rfi.requestToAvatar || "https://placehold.net/avatar.png"}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{rfi.requestToName?.join(", ")}</span>
                      </td>
                      <td className="px-4 py-3">
                        {new Date(rfi.requiredResponseDate).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(rfi.status)}`}
                        >
                          {rfi.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {rfi.attachedFiles != 0 ? (
                          <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
                            <AttachmentRounded />
                          </button>
                        ) : (null)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <EditAndCommentRfiPopUp
        open={editAndCommentPopUpOpen}
        onClose={() => setEditAndCommentPopUpOpen(false)}
        rfi={selectedRfi}
        members={members}
        onEditRfi={async (updatedRfi: Record<string, string>, files: File[]) => {
          setPopUpLoading(true);
          setPopUpError("");
          try {
            const formData = new FormData();
            // Arrays: requestTo, ccTo
            if (Array.isArray(updatedRfi.requestTo)) {
              updatedRfi.requestTo.forEach((to: string) => {
                formData.append("requestTo", to);
              });
            }
            if (Array.isArray(updatedRfi.ccTo)) {
              updatedRfi.ccTo.forEach((to: string) => {
                formData.append("ccTo", to);
              });
            }
            // All other fields: append only once, skip arrays
            Object.entries(updatedRfi).forEach(([key, value]) => {
              if (key === "requestTo" || key === "ccTo") return;
              if ((key === "id" || key === "projectId") && (!value || value === "")) return;
              if (value !== undefined && value !== null) {
                formData.append(key, typeof value === 'string' ? value : String(value));
              }
            });
            files.forEach((file: File) => formData.append('files', file));
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rfi/${updatedRfi.id}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${token}`
              },
              body: formData
            });
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(`Failed to update RFI: ${errorText}`);
            }
            // Refetch RFIs after edit
            const rfisRes = await fetch(`${import.meta.env.VITE_API_URL}/api/rfi/project/${selectedProject}`, {
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              credentials: 'include',
            });
            if (rfisRes.ok) {
              const rfisData = await rfisRes.json();
              setRfis(Array.isArray(rfisData) ? rfisData : rfisData.rfis || []);
            }
            if (!updatedRfi.comment) {
              setEditAndCommentPopUpOpen(false);
              return { type: 'edit' };
            } else {
              return { type: 'comment' };
            }
          } catch (err: unknown) {
            setPopUpError(err instanceof Error ? err.message : String(err));
          } finally {
            setPopUpLoading(false);
          }
        }}
        loading={popUpLoading}
        error={popUpError}
        selectedProject={selectedProject}
      />

      <PopUpCreateRFI
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        members={members}
        selectedProject={selectedProject}
        disciplineOptions={disciplineOptions.map(d => ({ value: d, label: d }))}
        tagOptions={tagOptions.map(t => ({ value: t, label: t }))}
        onSuccess={async () => {
          // Refetch RFIs after creation
          setLoading(true);
          const token = localStorage.getItem("token");
          const rfisRes = await fetch(`${import.meta.env.VITE_API_URL}/api/rfi/project/${selectedProject}`, {
            method: "GET",
            credentials: 'include',
          });
          if (rfisRes.ok) {
            const rfisData = await rfisRes.json();
            setRfis(Array.isArray(rfisData) ? rfisData : rfisData.rfis || []);
          }
          setLoading(false);
          triggerToast("RFI added successfully!", "success");
        }}
      />

      <Toast
        message={toast.message}
        show={toast.show}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
        duration={3000}
      />
    </div>
  );
}
